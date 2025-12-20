console.log("🔥 AUTH FILE CONNECTED");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// ✅ Load JWT Secret FIRST
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

// ✅ Temporary in-memory DB
let users = [];

// ✅ Test Route
router.get("/test", (req, res) => {
  res.send("API WORKING ✅");
});

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: role || "User",
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name,
      email,
      role: newUser.role,
    },
  });
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;
