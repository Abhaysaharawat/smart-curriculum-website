// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // replace with your MySQL username
  password: "newpassword",       // replace with your MySQL password
  database: "smart_curriculum"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

module.exports = db;
