const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token; // Mengambil token dari cookies
    if (!token) return res.redirect("/auth/login"); // Jika token tidak ada, arahkan ke halaman login

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token menggunakan secret key
        req.user = decoded; // Simpan data pengguna yang ter-decode ke objek req
        next(); // Lanjutkan ke middleware atau route berikutnya
    } catch (error) {
        res.redirect("/auth/login"); // Jika verifikasi token gagal, arahkan ke halaman login
    }
};