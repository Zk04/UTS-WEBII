const express = require("express"); // Mengimpor express
const router = express.Router(); // membuat instance router
const authController = require("../controllers/authController"); // mengimpor authController yang menangani logika auth

router.post("/register", authController.register); // Route untuk registrasi pengguna (POST)
router.post("/login", authController.login); // Route untuk login pengguna (POST)
router.get("/logout", authController.logout); // Route untuk logout pengguna (GET)

router.get("/register", (req, res) => {
  res.render("auth/register");
});
// Ketika pengguna mengunjungi /register, halaman registrasi akan ditampilkan
// `res.render("auth/register")` merender tampilan `views/auth/register.ejs` // `message: null` dan `token: null` digunakan untuk menangani pesan atau token di tampilan

router.get("/login", (req, res) => {
  res.render("auth/login");
});
// Ketika pengguna mengunjungi /login, halaman login akan ditampilkan // Sama seperti register, `message` dan `token` digunakan di tampilan untuk notifikasi


module.exports = router; // Mengekspor router agar bisa digunakan di file utama (misalnya app.js)
