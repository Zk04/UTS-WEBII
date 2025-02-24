const jwt = require("jsonwebtoken"); /// Mengimpor modul jsonwebtoken untuk membuat dan memverifikasi token JWT
require("dotenv").config(); // Memuat variabel lingkungan dari file .env

// Fungsi untuk membuat token JWT berdasarkan userId
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Fungsi untuk memverifikasi token JWT yang diterima
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken }; // Mengekspor fungsi agar dapat digunakan di file lain
