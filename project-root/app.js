const express = require("express");
require("dotenv").config(); // Memuat variabel lingkungan dari .env
const methodOverride = require("method-override"); // Mendukung metode HTTP PUT/DELETE pada form
const cookieParser = require("cookie-parser"); // Middleware untuk menangani cookie


const taskRoutes = require("./routes/taskRoutes"); // Route tugas
const authRoutes = require("./routes/authRoutes"); // Route autentikasi
const auth = require("./middleware/authMiddleware"); // Middleware autentikasi

require("./config/database"); // Koneksi ke database

// Inisialisasi Express
const app = express();

// Middleware & konfigurasi
app.use(express.static("public")); // Menyediakan folder untuk file statis
app.use(express.urlencoded({ extended: true })); // Menangani data dari form
app.use(express.json()); // Middleware untuk menangani request JSON
app.use(methodOverride("_method")); // Mendukung metode PUT/DELETE melalui query string
app.use(cookieParser()); // Middleware untuk cookie

app.set("view engine", "ejs"); // Menggunakan EJS sebagai template engine

// Use routes
app.use(authRoutes);


// Middleware global untuk menyertakan user ke dalam response (untuk akses di tampilan)
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Gunakan route untuk autentikasi dan tugas
app.use("/tasks", auth, taskRoutes);
app.use("/auth", authRoutes);

// Route utama mengarahkan ke halaman login
app.get("/", (req, res) => {
  res.redirect("auth/login");
});


app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));

