const Employee = require("../model/employeeSchema");
const authenticate = require("../middleware/authenticate");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
require("../db/conn");
const express = require("express");
const router = express.Router();

//storage specification for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "" + file.originalname);
  },
});

let upload = multer({ storage: storage });

// create employee
router.post(
  "/employee",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    /*const { error } = validateEmployee(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }*/

    const { name, email, phone, designation, gender, course, image } =
      req.body || req.file.filename;

    try {
      const newEmployee = new Employee({
        name,
        email,
        phone,
        designation,
        gender,
        course,
        image,
        postedBy: req.userID,
      });
      const result = await newEmployee.save();

      if (result) {
        res.status(201).json({ message: "employee inserted successfully" });
      } else {
        res.status(500).json({ error: "Failed to insert" });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

//fetch employee
router.get("/myemployee", authenticate, async (req, res) => {
  try {
    const myEmployees = await Employee.find({
      postedBy: req.userID,
    }).populate("name", "email", "phone", "designation", "gender", "course");
    res.send(req.rootUser);

    return res.status(200).json({ employees: myEmployees.reverse() });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
