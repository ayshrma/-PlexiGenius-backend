const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/plexiEmploye", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
});

const User = mongoose.model("User", userSchema);

async function createUser() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = new User({ email: "admin@example.com", password: hashedPassword });
  await user.save();
  console.log("User created successfully");
  mongoose.connection.close();
}

createUser();
