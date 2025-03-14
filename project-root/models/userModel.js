const mongoose = require("mongoose");// Import mongoose untuk mengelola database MongoDB
 const bcrypt = require("bcryptjs");
// Definisi skema (Schema) untuk koleksi "users" di MongoDB
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { versionKey: false }); // Menonaktifkan field "__v" yang biasanya ditambahkan oleh MongoDB

// Middleware sebelum menyimpan data user (pre-save hook)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Jika password tidak berubah, langsung lanjut
  this.password = await bcrypt.hash(this.password, 10); // Hash password sebelum disimpan
  next();
});

const User = mongoose.model("User", UserSchema);// Membuat model "User" berdasarkan skema yang telah didefinisikan

module.exports = User; // Mengekspor model agar bisa digunakan di file lain
 