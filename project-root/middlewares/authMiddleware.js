const { verifyToken } = require("../config/auth");  // Import fungsi verifikasi token JWT
const User = require("../models/userModel"); // Import model User untuk database

// Middleware autentikasi pengguna berdasarkan token JWT
const authMiddleware = async (req, res, next) => {
  // Mengambil token dari cookies atau header Authorization (Bearer Token)
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  // Jika tidak ada token, kembalikan respon 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // Verifikasi token dan dapatkan data pengguna dari token
    const decoded = verifyToken(token);
    // Cari user di database berdasarkan ID dari token
    const user = await User.findById(decoded.id).select("username email"); // Ambil username & email saja
    // Jika user tidak ditemukan, kembalikan respon 404 (Not Found)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Simpan data user di req.user agar bisa digunakan di route selanjutnya
    req.user = user; 
    console.log("User yang login:", req.user);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
