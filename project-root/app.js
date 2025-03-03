const express = require("express"); // Import framework Express.js
require("dotenv").config(); // Memuat variabel lingkungan dari file .env
const cookieParser = require("cookie-parser"); // Middleware untuk menangani cookie
const bodyParser = require("body-parser"); // Middleware untuk memproses request body

// Import rute-rute aplikasi
const taskRoutes = require("./routes/taskRoutes"); // Rute untuk tugas
const authRoutes = require("./routes/authRoutes"); // Rute untuk autentikasi
const auth = require("./middleware/authMiddleware"); // Middleware untuk proteksi rute

require("./config/database"); // Menghubungkan aplikasi ke database

// Inisialisasi Express
const app = express();

// Middleware & Konfigurasi
app.use(express.static("public")); // Menyediakan folder "public" untuk file statis (CSS, JS, dll.)
app.use(bodyParser.urlencoded({ extended: true })); // Menangani data dari form HTML
app.use(bodyParser.json()); // Menangani request dengan format JSON
app.use(cookieParser()); // Middleware untuk memproses cookie

app.set("view engine", "ejs"); // Menggunakan EJS sebagai template engine untuk tampilan frontend

// Rute Utama
app.use(authRoutes); // Memproses rute autentikasi (Login, Register, Logout)

// Middleware global untuk menyertakan informasi user ke dalam setiap response
app.use((req, res, next) => {
  res.locals.user = req.user; // Menjadikan user tersedia di semua halaman (EJS)
  next();
});

// Gunakan rute dengan proteksi autentikasi
app.use("/tasks", auth, taskRoutes); // Rute untuk tugas hanya dapat diakses oleh pengguna yang login
app.use("/auth", authRoutes); // Rute autentikasi

// Route utama: mengarahkan user langsung ke halaman tugas jika sudah login
app.get("/", (req, res) => {
  res.redirect("/tasks");
});

// Menjalankan Server
app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
