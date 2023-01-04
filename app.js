const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true); //to remove deprecation as mentioned in console

dotenv.config({ path: "./config.env" });

require("./db/conn");

app.use(express.json());
app.use(require("./router/auth"));
app.use(require("./router/employee"));

const PORT = process.env.PORT;

//app.get("/", (req, res) => {
//res.send("Hello world from server");
//});

//app.get("/register", (req, res) => {
//res.send("Hello register world from server");
//});

//app.get("/login", (req, res) => {
//res.send("Hello world login from server");
//});

//app.get("/employeelist", middleware, (req, res) => {
//res.send("Hello world employee from server");
//});

app.listen(PORT, () => {
  console.log(`server is running at port number ${PORT}`);
});
