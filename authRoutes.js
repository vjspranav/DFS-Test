const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const authKeys = require("../lib/authKeys");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");

const router = express.Router();

router.post("/signup", jwtAuth, (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    name: data.name,
    parentId: req.user._id,
    subIds: []
  });
  // Add the new user to the parent's subIds
  User.findById(req.user._id)
    .then((parent) => {
      parent.subIds.push(user._id);
      return parent.save();
    })
    .catch((err) => {
      return res.status(400).json(err);
    });

  user
    .save()
    .then(() => {
      return res.status(201).json({ message: "User created!" });
    })
    .catch((err) => {
      User.findById(req.user._id)
      .then((parent) => {
        parent.subIds.pop();
        return parent.save();
      })
      .catch((err) => {
        return res.status(400).json(err);
      });

      return res.status(400).json(err);
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      console.log(err, user, info);
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

router.get("/loggedInGet", jwtAuth, (req, res) => {
  res.send("You are authorized!");
});

module.exports = router;
