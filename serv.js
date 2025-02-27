require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/plexiEmploye", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));



const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

const Employee = mongoose.model("Employee", employeeSchema);

app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/employees", async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/employees/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const Admin = mongoose.model("Admin", adminSchema);

//        Not completed  Middleware to Verify Token
// const verifyToken = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = verified;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Invalid Token" });
//   }
// };

// app.post("/auth/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new Admin({ email, password: hashedPassword });
//     await newAdmin.save();
//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post("/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(400).json({ message: "Admin not found" });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/admin/dashboard", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to the Admin Dashboard!" });
// });


// // //  Login





// const users = [
//   { email: "admin@example.com", password: "password123" },
// ];

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find((u) => u.email === email && u.password === password);

//   if (!user) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   res.json({ message: "Login Successful!" });
// });

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/authDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String, // In production, store hashed passwords!
});

const User = mongoose.model("User", userSchema);

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login Successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: String,
  priority: String,
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  assignedEmployee: String,
});

const Task = mongoose.model("Task", taskSchema);

app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
