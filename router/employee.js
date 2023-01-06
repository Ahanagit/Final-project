const Employee = require("../model/employeeSchema");
const authenticate = require("../middleware/authenticate");

const mongoose = require("mongoose");
require("../db/conn");
const express = require("express");
const router = express.Router();

// create employee
router.post("/employee", async (req, res) => {
  /*const { error } = validateEmployee(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }*/

  const { name, email, phone, designation, gender, course } = req.body;

  try {
    const newEmployee = new Employee({
      name,
      email,
      phone,
      designation,
      gender,
      course,
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
});

module.exports = router;
