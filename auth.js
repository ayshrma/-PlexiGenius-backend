const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const router = express.Router();

// Dummy user for testing
const users = [{ username: "admin@example.com", password: "$2a$10$qeqwE3v2fKwX5K88h7OaPuH0G94Hl/nGkKtrb6T4viX3P8rL1J3Ma" }]; // Hashed password

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

module.exports = router;