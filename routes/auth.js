console.log("🔥 AUTH FILE CONNECTED");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Load users from file
const loadUsers = () => {
  if (!fs.existsSync("users.json")) return [];
  return JSON.parse(fs.readFileSync("users.json"));
};

const saveUsers = (users) => {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
};

let users = loadUsers();

// ✅ TEST
router.get("/test", (req, res) => {
  res.send("API WORKING ✅");
});

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role: role || "User",
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    message: "Registered successfully",
    user: { id: newUser.id, name, email, role: newUser.role },
  });
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
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
