const { validateEmployee, Employee } = require("../model/employeeSchema");
const authenticate = require("../middleware/authenticate");

const mongoose = require("mongoose");
const router = require("express").Router();

// create employee
router.post("/employee", authenticate, async (req, res) => {
  const { error } = validateEmployee(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, email, phone, designation, course } = req.body;

  try {
    const newEmployee = new Employee({
      name,
      email,
      phone,
      designation,
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

// fetch employee
router.get("/myEmployees", authenticate, async (req, res) => {
  try {
    const myEmployees = await Employee.find({
      postedBy: req.user._id,
    }).populate("postedBy", "-password");

    return res.status(200).json({ contacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// update contact.
router.put("/employee", authenticate, async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const employee = await Employee.findOne({ _id: id });

    if (req.user._id.toString() !== employee.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't edit other admin's employees!" });

    const updatedData = { ...req.body, id: undefined };
    const result = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

// delete a contact.
router.delete("/delete/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });
  try {
    const employee = await Employee.findOne({ _id: id });
    if (!employee) return res.status(400).json({ error: "no employee found" });

    if (req.user._id.toString() !== employee.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other admin's employeelist!" });

    const result = await Employee.deleteOne({ _id: id });
    const myEmployees = await Employee.find({
      postedBy: req.user._id,
    }).populate("postedBy", "-password");

    return res
      .status(200)
      .json({ ...employee._doc, myEmployees: myEmployees.reverse() });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
