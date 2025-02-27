const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/plexiAdmin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateAdmin() {
  const newEmail = "plexigenius@gmail.com"; 
  const newPassword = "Sharma**"; 

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedAdmin = await Admin.findOneAndUpdate(
      {}, 
      { email: newEmail, password: hashedPassword },
      { new: true, upsert: true } 
    );

    console.log(" Admin credentials updated successfully!");
  } catch (error) {
    console.error(" Error updating admin:", error.message);
  } finally {
    mongoose.connection.close();
  }
}
updateAdmin();
