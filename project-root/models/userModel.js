const mongoose = require("mongoose");// Import mongoose untuk mengelola database MongoDB

// Definisi skema (Schema) untuk koleksi "users" di MongoDB
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { versionKey: false }); // Menonaktifkan field "__v" yang biasanya ditambahkan oleh MongoDB

const User = mongoose.model("User", UserSchema);// Membuat model "User" berdasarkan skema yang telah didefinisikan

module.exports = User; // Mengekspor model agar bisa digunakan di file lain
 