const mongoose = require("mongoose"); // Mengimpor library Mongoose untuk menghubungkan aplikasi dengan MongoDB
require("dotenv").config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskDB"; // Mendapatkan URI MongoDB dari variabel lingkungan 


// Menghubungkan Mongoose ke database MongoDB
mongoose.connect(mongoURI, {
});

const db = mongoose.connection; // Menyimpan koneksi database dalam variabel db

// Event listener jika terjadi kesalahan koneksi dan keberhasilan koneksi
db.on("error", console.error.bind(console, "Koneksi database gagal!"));
db.once("open", () => console.log("Koneksi ke MongoDB berhasil!"));

module.exports = db; // Mengekspor objek koneksi database agar bisa digunakan di file lain
