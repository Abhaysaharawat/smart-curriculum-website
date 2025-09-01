const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // change this later

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Smart Curriculum & Attendance Backend is running 🚀");
});

// Register User
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role || "student"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User registered successfully ✅" });
    }
  );
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful ✅", token });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
