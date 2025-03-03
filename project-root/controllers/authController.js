const bcrypt = require("bcryptjs"); // Library untuk hashing password
const User = require("../models/userModel"); // Model pengguna dari database
const { generateToken } = require("../config/auth"); // Fungsi untuk membuat token JWT

// Fungsi untuk registrasi pengguna baru
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body; // Mengambil data username dan password dari request body

    // Mengecek apakah username sudah ada di database
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.render("auth/register", { error: "Username already taken" });

    // Membuat pengguna baru tanpa hashing password (HARUS diperbaiki agar lebih aman)
    const user = new User({ username, password });
    await user.save(); // Menyimpan pengguna ke database

    // Redirect ke halaman login setelah berhasil registrasi
    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).send(error.message); // Menangani error jika terjadi kesalahan dalam proses registrasi
  }
};

// Fungsi untuk login pengguna
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // Mengambil data username dan password dari request body

    // Mencari pengguna berdasarkan username di database
    const user = await User.findOne({ username });
    if (!user) return res.render("login", { error: "User not found" });

    // Memeriksa apakah password yang dimasukkan sesuai dengan password di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { error: "Invalid " });

    // Jika password cocok, buat token JWT dan simpan di cookie
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true }); // Menyimpan token di cookie agar lebih aman

    // Redirect ke halaman tasks setelah berhasil login
    res.redirect("/tasks");
  } catch (error) {
    res.status(500).send(error.message); // Menangani error jika terjadi kesalahan dalam proses login
  }
};

// Fungsi untuk logout pengguna
exports.logout = (req, res) => {
  res.clearCookie("token"); // Menghapus token dari cookie agar sesi logout berhasil
  res.redirect("/auth/login"); // Redirect ke halaman login setelah logout
};
