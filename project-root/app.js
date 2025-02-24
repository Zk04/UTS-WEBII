const express = require("express");
require("dotenv").config(); // Memuat variabel lingkungan dari .env
const methodOverride = require("method-override"); // Mendukung metode HTTP PUT/DELETE pada form
const cookieParser = require("cookie-parser"); // Middleware untuk menangani cookie
const taskRoutes = require("./routes/taskRoutes"); // Route tugas
const authRoutes = require("./routes/authRoutes"); // Route autentikasi
const auth = require("./middleware/authMiddleware"); // Middleware autentikasi
const authController = require("./controllers/authController"); // Controller autentikasi
require("./config/database"); // Koneksi ke database

const app = express();

app.use(express.static("public")); // Menyediakan folder untuk file statis
app.use(express.urlencoded({ extended: true })); // Menangani data dari form
app.use(express.json()); // Middleware untuk menangani request JSON
app.use(methodOverride("_method")); // Mendukung metode PUT/DELETE melalui query string
app.use(cookieParser()); // Middleware untuk cookie

app.set("view engine", "ejs"); // Menggunakan EJS sebagai template engine

// Middleware global untuk menyertakan user dalam response
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Menggunakan route untuk tugas dan autentikasi
app.use("/tasks", auth, taskRoutes);
app.use("/auth", authRoutes);

// Route utama mengarahkan ke halaman login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Route halaman login dan registrasi
app.get("/login", (req, res) => {
  res.render("auth/login", { message: null, token: null });
});

app.post("/login", authController.login);

app.get("/register", (req, res) => {
  res.render("auth/register", { message: null, token: null });
});

// Menjalankan server
app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
