const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

require("../db/conn");

const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello world from server router js");
});

router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(422).json({ error: "You need to fill required fields" });
  }
  //res.json({ message: req.body });

  try {
    const userExist = await User.findOne({ name: name });

    if (userExist) {
      return res.status(422).json({ error: "Already existing user" });
    }

    const user = new User({ name, password });

    //hashing password with bcrypt

    const userRegister = await user.save();

    if (userRegister) {
      res.status(201).json({ message: "user registered successfully" });
    } else {
      res.status(500).json({ error: "Failed to register" });
    }
  } catch (err) {
    console.log(err);
  }
});

//login route
//no path should be empty
//email and password should be matched with the data entered during registration

router.post("/login", async (req, res) => {
  //console.log(req.body);
  //res.json({ message: "awesome" });
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: "Need to fill the required field" });
    }

    const userLogin = await User.findOne({ name: name });

    //console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtToken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        res.json({ message: "user signin successful" });
      }
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//employee page

router.get("/employee", authenticate, (req, res) => {
  console.log("middleware executed");
  res.send(req.rootUser);
});

router.get("/getData", authenticate, (req, res) => {
  console.log("All data stored here");
  res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
  console.log("It is the logout page");
  res.clearCookie("jwtToken", { path: "/" });
  res.status(200).send("User logout");
});

module.exports = router;
