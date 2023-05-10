const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { isAncestor } = require("../lib/utils");

const Project = require("../db/Project");
const Task = require("../db/Task");
const File = require("../db/File");

const jwtAuth = require("../lib/jwtAuth");
const User = require("../db/User");

// Create a new project
router.post("/createProject", jwtAuth, async (req, res) => {
  const newProject = new Project({
    name: req.body.name,
    ownerId: req.user._id,
    description: req.body.description,
    type: req.body.type,
    githubRepo: req.body.githubRepo,
  });

  try {
    const result = await newProject.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("Error creating the project");
  }
});

router.post("/:projectId/assignMember", jwtAuth, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).send("User not found");

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).send("Project not found");

    if (!project.ownerId.equals(req.user._id))
      return res.status(401).send("User is not authorized to assign members");

    console.log(user);
    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      console.log(project.members);
      await project.save();
    }

    res.status(200).send("Member assigned to the project");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error assigning member to the project");
  }
});

router.get("/:projectId/members", jwtAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) return res.status(404).send("Project not found");

    console.log(project.ownerId, req.user);
    if (
      !project.ownerId.equals(req.user._id) &&
      !project.members.some((member) => member._id.equals(req.user._id))
    )
      return res.status(401).send("User is not authorized to view members");

    // for each member, get the user object
    const members = await Promise.all(
      project.members.map(async (member) => {
        member = await User.findById(member);
        return {
          _id: member._id,
          name: member.name,
          email: member.email,
        };
      })
    );

    res.status(200).json(members);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving project members");
  }
});

router.delete("/:projectId/removeMember/:userId", jwtAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).send("Project not found");

    if (!project.ownerId.equals(req.user._id))
      return res.status(401).send("User is not authorized to remove members");

    project.members = project.members.filter(
      (member) => !member.equals(req.params.userId)
    );
    await project.save();

    res.status(200).send("Member removed from the project");
  } catch (error) {
    res.status(500).send("Error removing member from the project");
  }
});

// Get all projects with their tasks for logged in user
router.get("/", jwtAuth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: req.user._id }],
    });
    const projectTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ projectId: project._id });
        return {
          _id: project._id,
          name: project.name,
          description: project.description,
          tasks: tasks.map((task) => ({
            _id: task._id,
            name: task.name,
            description: task.description,
          })),
        };
      })
    );
    res.json(projectTasks);
  } catch (error) {
    res.status(500).send("Error retrieving projects.");
  }
});

// get a project by id
router.get("/:id", jwtAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    let tasks = await Task.find({ projectId: project._id });

    if (!project.ownerId.equals(req.user._id)) {
      tasks = tasks.filter((task) => task.assignedTo.equals(req.user._id));

      if (tasks.length === 0) {
        return res
          .status(401)
          .send("User is not authorized to view this project");
      }
    }

    res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      tasks: tasks.map((task) => ({
        _id: task._id,
        name: task.name,
        description: task.description,
      })),
    });
  } catch (error) {
    res.status(500).send("Error retrieving project.");
  }
});

// Create a new task
router.post("/createTask", jwtAuth, async (req, res) => {
  const data = req.body;

  if (data.assignedTo) {
    // Check if assignedTo is a descendant of the user
    if (
      !isAncestor(req.user._id, data.assignedTo) &&
      !req.user._id.equals(data.assignedTo)
    ) {
      return res.status(401).json({
        message: "User is not authorized to assign tasks to this user",
      });
    }
  }

  //   Check if dueDate is in the future
  if (new Date(data.dueDate) < Date.now()) {
    return res.status(400).json({
      message: "Due date must be in the future",
    });
  }

  // Check if the user is the owner of the project
  const project = await Project.findById(data.projectId);
  if (!project) {
    return res.status(400).json({
      message:
        "Project does not exist or user is not authorized to create tasks for this project",
    });
  }

  const task = new Task({
    name: data.name,
    projectId: data.projectId,
    assignedTo: data.assignedTo,
    description: data.description,
    dueDate: data.dueDate,
    totalMarks: data.totalMarks,
  });

  try {
    await task.save();
    project.totalMarks += task.totalMarks;
    await project.save();
    res.status(200).json({ message: "Task created successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/tasks/:id/grade", jwtAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const project = await Project.findById(task.projectId);

    if (!project.ownerId.equals(req.user._id)) {
      return res
        .status(401)
        .json({ message: "User is not authorized to grade this task" });
    }

    const grade = parseInt(req.body.grade);
    if (isNaN(grade) || grade < 0 || grade > task.totalMarks) {
      return res.status(400).json({ message: "Invalid grade value" });
    }

    task.grade = grade;
    await task.save();

    res.status(200).json({ message: "Task graded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/tasks/:id/submitFeedback", jwtAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const project = await Project.findById(task.projectId);

    if (!project.ownerId.equals(req.user._id)) {
      return res
        .status(401)
        .json({ message: "User is not authorized to grade this task" });
    }

    const feedback = req.body.feedback;
    if (!feedback) {
      return res.status(400).json({ message: "Missing feedback" });
    }

    task.feedback = feedback;
    await task.save();

    res.status(200).json({ message: "Task feedback saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/tasks/:id/submit", jwtAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const project = await Project.findById(task.projectId);

    if (!project.memberIds.includes(req.user._id.toString())) {
      return res
        .status(401)
        .json({ message: "User is not authorized to submit this task" });
    }

    const githubCommitId = req.body.githubCommitId;
    if (!githubCommitId) {
      return res.status(400).json({ message: "Missing GitHub commit ID" });
    }

    task.githubCommitId = githubCommitId;
    task.status = "Completed";
    await task.save();

    res.status(200).json({ message: "Task submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/tasks/:id", jwtAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const project = await Project.findById(task.projectId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (
      project.ownerId.toString() !== req.user._id.toString() &&
      task.assignedTo.toString() !== req.user._id.toString() &&
      !isAncestor(req.user._id, task.assignedTo)
    ) {
      res
        .status(403)
        .json({ message: "You are not authorized to access this task" });
      return;
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Multer configuration to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectId = req.query.projectId;
    // Check if projectId is valid
    if (!projectId) {
      return cb(new Error("Missing projectId"));
    }

    // Check if project exists and user is owner
    const project = Project.findOne({
      _id: projectId,
      ownerId: req.user._id,
    }).exec();

    if (!project) {
      return cb(new Error("Project does not exist or user is not owner"));
    }

    // create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Check if directory for projectId exists, create it if it doesn't
    const dirPath = path.join(__dirname, "../uploads", projectId);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    // Save file to directory for projectId
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploading = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

// Create a upload file, takes projectId and file
router.post("/uploadFile", jwtAuth, (req, res) => {
  uploading.single("file")(req, res, (err) => {
    console.log(req.query);
    console.log(req.file);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // Create a new file in the database
      const file = new File({
        projectId: req.query.projectId,
        name: req.file.filename,
        path: req.file.path,
      });

      file.save();

      res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
});

// Get all files for a project
router.get("/files/:projectId", jwtAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.ownerId.equals(req.user._id)) {
      return res
        .status(401)
        .json({ message: "User is not authorized to view this project" });
    }

    const files = await File.find({ projectId: req.params.projectId });

    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download a file
router.get("/downloadFile/:fileId", jwtAuth, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const project = await Project.findById(file.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.ownerId.equals(req.user._id)) {
      return res
        .status(401)
        .json({ message: "User is not authorized to view this project" });
    }

    res.download(file.path);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
