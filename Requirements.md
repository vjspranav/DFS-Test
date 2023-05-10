# Data Foundation Systems

# Grading Management System

## 1. Overview

The grading management system is intended to simplify work assignments, grading, and feedback for instructors. It is a system where admins creates projects and several tasks have been created under that project. Admin assigns the project to a team, each member of the team gets linked to the project and all further tasks will be assigned to all of them. Each team member can view assigned tasks, complete assigned tasks and create commits. Later, the member manually pushes the code on GitHub and mark the task completed. The admin can review the code changes, add comments, provide feedback and grade the work. The admin can also view the commit history for each task.

## 2. System Architecture

The system will be built using a client-server architecture, where the server will be responsible for storing and processing data. At the same time, the client will be responsible for interacting with the user. The system will have three main components:

- **Client**: The client will be responsible for interacting with the user. The client will be a web application that will be built using React. It will be responsible for displaying the user interface and handling user input. The client will communicate with the server using HTTP requests.

- **Server**: The server will be responsible for storing and processing data. The server will be built using Node.js and Express. The server will be responsible for handling HTTP requests from the client and communicating with the database.will also enforce authentication and authorization to ensure that users only have access to the tasks they are authorized to view or modify.

- **Database**: The database will be responsible for storing data. The database will be built using MongoDB. The database will store user information, project information, task information, and commit information.The server will access the database to retrieve and update information.

## 3. Functional Requirements

### 3.1. User Roles

The system will have two user roles: admin and team member.

##### 3.1.1. Admin

The admin is responsible for creating projects, adding team members and allocating tasks. The admin is also responsible for reviewing commits, providing feedback to the team members and grade the project task wise.

##### 3.1.2. Team Member

Team members can view assigned tasks, create commits and mention commit id on the webapp marking the task to be completed.

### 3.2. Project Management

##### 3.2.1. Create Project

The admin can create a project by providing a project name and its description.

##### 3.2.2. Assign Project

The admin can assign a project to a team by adding the team members to the project

##### 3.2.3. View Project

The admin can view all projects assigned to a team.

### 3.3. Task Management

##### 3.3.1. Create Task

Admins can create tasks under a project by providing a task name, description, and deadline.

##### 3.3.2. View Task

The admin can view all tasks under a project.

##### 3.3.3. Task Completion

A team member can mark a task as completed by providing the commit id of the recent changes on the webapp

##### 3.3.4. Review Task

The admin can review a task from the dashboard, by previewing the changes done in that commit

### 3.4. Commit Management

Git commit is going to play a major role in the worklow:

- mentioning commit id for a particular task (to mark it complete)
- once the task is marked completed, we can preview the changes on the left through an iframe, and have a grader with a feedback section on the right
- we can also preview the file directly from github(if provided explicitly by the user)

## 4. Non-Functional Requirements

### 4.1. Security

The system will enforce authentication and authorization to ensure that users only have access to the tasks they are authorized to view or modify. The system will also use HTTPS to ensure that all data is encrypted when being transmitted over the network. APIs are secured with a layer of json web token which can be only provided upon logging in.

### 4.2. Performance

The system should respond to user requests quickly and efficiently. The system should be able to handle multiple users simultaneously. The system should be able to handle multiple projects and tasks.

### 4.3. Reliability

The system should be able to recover from failures and continue to function properly. The system should be able to handle unexpected inputs and errors.

### 4.4. Usability

The system should have an intuitive and easy-to-use interface. The system should provide clear and concise instructions to the users. The system should provide helpful error messages to the users.

### 4.5. Compatibility

The system should be able to integrate with other systems. The system should be able to integrate with GitHub in future.

## 5. Stakeholders

The stakeholders of the system are:

### 5.1. Admin

The grading management system will streamline the process of creating and assigning projects and tasks, grading and providing feedback, and tracking the progress of the teams and team members. It will save time and effort for admins, and provide a more efficient way of managing student projects.

### 5.2. Instructor

The system will provide a user-friendly interface to manage assignments and grading, leading to improved student satisfaction and outcomes.

### 5.3. Student

The system will provide clear guidance on task assignments and grading, enabling them to track their progress and receive timely feedback to improve their work.

### 5.4. IT department

IT department who will be responsible for setting up and maintaining the system

## 6. Use Cases

### 6.1. Create Project

##### Actor: Admin

##### Precondition: Admin is logged in and has the necessary permissions to create a project.

##### Postcondition: A new project is created.

##### Normal Flow:

1. The admin clicks on the create project button.
2. The admin enters the project name and description.
3. The admin clicks on the create button.
4. The system creates a new project and displays a success message.

### 6.2. Create Task

##### Actor: Admin

##### Precondition: Admin is logged in and has the necessary permissions to create a task.

##### Postcondition: A new task is created under the specified project.

##### Normal Flow:

1. The admin selects the project under which the task will be created.
2. The admin clicks on the create task button.
3. The admin enters the task name, description, and deadline.
4. The admin clicks on the create button.
5. The system creates a new task and displays a success message.

### 6.3. Assign Task

##### Actor: Admin

##### Precondition: Admin is logged in and has the necessary permissions to assign a task.

##### Postcondition: A task is assigned to a team member.

##### Normal Flow:

1. The admin selects the project under which the task will be assigned.
2. The admin selects the team member to whom the task will be assigned.
3. The admin clicks on the assign task button.
4. The system assigns the task to the team member and displays a success message.

### 6.4. View Task

##### Actor: Admin,Team Member

##### Precondition: Admin/Team Member is logged in and has the necessary permissions to view a task.

##### Postcondition: Task details are displayed to the actors.

##### Normal Flow:

1. The admin selects the project under which the task will be viewed.
2. The admin selects the task to be viewed.
3. The admin clicks on the view task button.

### 6.5. Complete Task

##### Actor: Team Member

##### Precondition: Team Member is logged in and has the necessary permissions to complete a task.

##### Postcondition: Task is marked as completed.

##### Normal Flow:

1. The team member selects the project under which the task will be completed.
2. The team member selects the task to be completed.
3. The team member enters the commit id.
4. The team member clicks on the complete task button.
5. The system marks the task as completed and displays a success message.

### 6.6. Review Task

##### Actor: Admin

##### Precondition: Admin is logged in and has the necessary permissions to review a task.

##### Postcondition: Task is reviewed and feedback is provided.

##### Normal Flow:

1. The admin selects the project under which the task will be reviewed.
2. The admin selects the task to be reviewed.
3. The admin clicks on the review task button.
4. The system displays the task details and commit history.
5. The admin provides feedback and clicks on the submit button.
6. The system marks the task as reviewed and displays a success message.

## System Design

The proposed architecture for the grading management system is a client-server architecture, which consists of a client, server,and database.

### 4.1. Data Model

The system will have the following data models:

- **User**: The user model will store user information such as name, email, and password.

- **Project**: The project model will store project information such as name, description, deadline, and team members.

- **Task**: The task model will store task information such as name, description, deadline, and commits.

### 4.2. DB Schema

The system will have the following database schemas:

- **User**:

```javascript
 {
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    parentId: {
      type: String
    },
    subIds: [{
        type: String,
    }],
  },
  { collation: { locale: "en" } }

```

- **Project**:

```javascript
{
    name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: String,
    required: true,
    enum: ["report", "model", "other"],
    default: "other",
  },
}
```

- **Task**:

```schema
{
    projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["In Progress", "Completed", "Overdue", "Cancelled"],
    default: "In Progress",
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
}

```

### 4.3. APIs

The system will have the following APIs:

- **User**: The user API will be responsible for creating, retrieving, updating, and deleting user information.

- **Project**: The project API will be responsible for creating, retrieving, updating, and deleting project information.

- **Task**: The task API will be responsible for creating, retrieving, updating, and deleting task information.

### 4.4. Database

The system will use MongoDB as the database. The database will store user information, project information, task information, and commit information. The server will access the database to retrieve and update information.

### 4.5. Client

The client will be a web application that will be built using React. The client will be responsible for displaying the user interface and handling user input. The client will communicate with the server using HTTP requests.

### 4.6. Server

The server will be built using Node.js and Express. The server will be responsible for handling HTTP requests from the client and communicating with the database. The server will also enforce authentication and authorization to ensure that users only have access to the tasks they are authorized to view or modify.

**This architecture is compliant with the requirements specified in the problem statement and the non-functional requirements as follows:**
_Functional Requirements_

1. User Roles: The client-server architecture allows for the implementation of user roles, which are a functional requirement of the system.The admin and team member roles can be implemented on the server, which will enforce authentication and authorization to ensure that users only have access to the tasks they are authorized to view or modify.
2. Project Management: The client-server architecture allows for the creation and assignment of projects, which are functional requirements of the system. The server will store project information in the database, and the client will display project information to the user by communicating with the server.
3. Task Management: The client-server architecture allows for the creation,viewing, completion, and review of tasks, which are functional requirements of the system. The server will store task information in the database, and the client will display task information to the user by communicating with the server.The completion of tasks will also be recorded on the server and the server will provide the necessary information for the admin to review the tasks.
4. Commit Management: The client-server architecture allows for the tracking and management of commits, which are functional requirements of the system. The server will store commit information in the database, and the client can communicate with the server to retrieve commit information for a task.
   _Non-Functional Requirements_
5. Security: The client-server architecture provides the necessary security measures to ensure that the system is secure. The server enforce authentication and authorization to ensure that users only have access to the tasks they are authorized to view or modify. The system also use HTTPS to ensure that all data is encrypted when being transmitted over the network. Additionally, APIs are secured with a layer of json web token which can be only provided upon logging in.
6. Performance: The client-server architecture provides the necessary performance measures to comply with the performance requirements of the system. The server is designed in such a way that it can handle multiple users simultaneously as well as multiple projects and tasks. The server is also designed to respond to user requests quickly and efficiently.
7. Reliability: The client-server architecture provides the necessary reliability measures to comply with the reliability requirements of the system. The server is designed in such a way that it can recover from failures and continue to function properly. The server is also designed to handle unexpected inputs and errors.
8. Usability: The client-server architecture provides the necessary usability measures to comply with the usability requirements of the system. The client is designed in such a way that it has an intuitive and easy-to-use interface. The client is also designed to provide clear and concise instructions to the users. The client is also designed to provide helpful error messages to the users.
9. Compatibility: The client-server architecture provides the necessary compatibility measures to comply with the compatibility requirements of the system. The server is designed in such a way that it can integrate with other systems. The server is also designed in such a way that it can integrate with GitHub in future to allow for seamless collaboration and code management.

## 5. System Workflow

The system will have the following workflow:

1. The admin creates a project and its associated tasks.

2. The admin assigns the project to a team, which includes linking each team member to the project.

3. Once the project is assigned to a team, the team members can view the project and its associated tasks.

4. Upon finishing a task, the team member provides a commit id to the webapp and then the task is marked complete. (Also we are not generating any commit id from our end, its the git which does it for us, we are just uploading it on the webapp)

5. The team member can manually push the code to GitHub using the commit ID, or update the commit ID if needed.

6. The admin can view recent commits, leave feedback on tasks, review tasks, and grade tasks.

7. Once all tasks are complete, and graded by the admin, then the project is marked complete.

## 6. Code

### 6.1. Structure

### 6.2. Code Quality

### 6.3. Readability

The code structure presented above is well-organized and follows best practices for readability. It uses consistent indentation, meaningful variable names, and descriptive comments to explain the purpose of each function/section of code.

## 7. Traceability Matrix

The traceability matrix maps the requirements to the use cases and the system components. The traceability matrix is shown below:

| Requirement           | Design                                                 | Code                                     | Test                              | Solution Feature                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------ | ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1.1 Admin           | Server- User Authentication & Authorization            | Server- User API endpoints               | Unit Testing, Integration Testing | Admin can create projects, add team members, and allocate tasks                                                                                                                                                     |
| 3.1.2 Team Member     | Server- User Authentication & Authorization            | Server- User API endpoints               | Unit Testing, Integration Testing | Team members can view assigned tasks, complete assigned tasks, and create commits and mark tasks as completed                                                                                                       |
| 3.2.1 Create Project  | Server- Project Management API                         | Server- Project Management API endpoints | Unit Testing, Integration Testing | Admin can create a project by providing a project name and its description                                                                                                                                          |
| 3.2.2 Assign Project  | Server- Project Management API                         | Server- Project Management API endpoints | Unit Testing, Integration Testing | Admin can assign a project to a team by adding the team members to the project                                                                                                                                      |
| 3.2.3 View Project    | Server- Project Management API                         | Server- Project Management API endpoints | Unit Testing, Integration Testing | Admin can view all projects assigned to a team                                                                                                                                                                      |
| 3.3.1 Create Task     | Server- Task Management API                            | Server- Task Management API endpoints    | Unit Testing, Integration Testing | Admin can create tasks under a project by providing a task name, description, and deadline                                                                                                                          |
| 3.3.2 View Task       | Server- Task Management API                            | Server- Task Management API endpoints    | Unit Testing, Integration Testing | Admin can view all tasks under a project                                                                                                                                                                            |
| 3.3.3 Task Completion | Server- Task Management API                            | Server- Task Management API endpoints    | Unit Testing, Integration Testing | A team member can mark a task as completed by providing the commit id of the recent changes on the webapp                                                                                                           |
| 3.3.4 Review Task     | Server- Task Management API                            | Server- Task Management API endpoints    | Unit Testing, Integration Testing | Admin can review a task from the dashboard, by previewing the changes done in that commit                                                                                                                           |
| 4.1 Security          | Server- User Authentication & Authorization Middleware | Server- Secure API endpoints             | Integration Testing               | The system enforces authentication and authorization to ensure that users only have access to the tasks they are authorized to view or modify and uses HTTPs to encrypt all data being transmitted over the network |
| 4.2 Performance       | Server-Scalable Architecture                           | Server- Optimised Database Queries       | Performance Testing               | The system responds to user requests quickly and efficiently and can handle multiple users,projects and tasks simultaneously                                                                                        |
| 4.3 Reliability       | Server- Error Handling Middleware                      | Server- Error Logging                    | Integration Testing               | The system recovers from failures and continues to function properly and handles unexpected inputs and errors                                                                                                       |
| 4.4 Usability         | Client- Intuitive User Interface Design                | Client- User Experience                  | Acceptance Testing                | The system has an intuitive and easy-to-use interface and provides clear and concise instructions to the users                                                                                                      |
| 4.5 Compatibility     | Server- GitHub Integration                             | Server- Third-Party API Integration      | Integration Testing               | The system integrates with GitHub to allow for seamless collaboration and code management                                                                                                                           |

## 8. UI Overview

### 8.1. Login Page

![Imgur Image](https://i.imgur.com/2txraAe.jpeg)

### 8.2. Dashboard

![info](https://i.imgur.com/3XzWLNp.jpeg)

### 8.3. Assign team members

![info](https://i.imgur.com/RdPKJam.jpeg)

### 8.4. Task Page

![info](https://i.imgur.com/5NojhmW.jpeg)

### 8.5. Commits

![info](https://i.imgur.com/CBvXK9r.jpeg)
