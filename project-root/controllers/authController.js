const bcrypt = require("bcrypt");// Library untuk hashing password
const User = require("../models/userModel");// Model pengguna dari database
const { generateToken } = require("../config/auth"); // Fungsi untuk membuat token JWT

const authController = {
   // Fungsi registrasi pengguna baru
  register: async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password sebelum disimpan
      const newUser = new User({ username, password: hashedPassword });// Buat user baru
      await newUser.save();// Simpan user ke database
      
      res.redirect("/login"); // Setelah registrasi sukses, arahkan ke halaman login
    } catch (err) {
      res.render("auth/register", { message: "Registration failed: " + err.message, token: null });
    }
  },

  // Fungsi login pengguna
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });// Cari user berdasarkan username
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render("auth/login", { message: "Invalid username or password", token: null });// Jika user tidak ditemukan atau password salah, kirim pesan error
      }
      const token = generateToken(user._id);// Buat token JWT untuk sesi pengguna
      console.log("Generated Token:", token);
      res.cookie("token", token, { httpOnly: true }); // Simpan token di cookie agar aman
      res.redirect("/tasks"); // Arahkan ke halaman tugas setelah login sukses
    } catch (err) {
      res.render("auth/login", { message: "Login failed: " + err.message, token: null });
    }
  },
  // Fungsi logout pengguna
  logout: (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
  },
};

module.exports = authController;// Ekspor controller untuk digunakan di file lain
