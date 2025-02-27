const express = require("express");
require("dotenv").config(); // Memuat variabel lingkungan dari .env
const cookieParser = require("cookie-parser"); // Middleware untuk menangani cookie
const bodyParser = require("body-parser");

const taskRoutes = require("./routes/taskRoutes"); // Route tugas
const authRoutes = require("./routes/authRoutes"); // Route autentikasi
const auth = require("./middleware/authMiddleware"); // Middleware autentikasi

require("./config/database"); // Koneksi ke database

// Inisialisasi Express
const app = express();

// Middleware & konfigurasi
app.use(express.static("public")); // Menyediakan folder untuk file statis
app.use(bodyParser.urlencoded({ extended: true })); // Menangani data dari form
app.use(bodyParser.json()); // Middleware untuk menangani request JSON
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
  res.redirect("/tasks");
});


app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));

