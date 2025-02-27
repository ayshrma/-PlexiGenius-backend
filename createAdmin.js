

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/userInformation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new Admin({ email: "admin@example.com", password: hashedPassword });

  await admin.save();
  console.log(" created successfully!");
  mongoose.connection.close();
}

createAdmin();
