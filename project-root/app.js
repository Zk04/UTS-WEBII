const express = require("express");
require("dotenv").config(); // Add this line to load environment variables
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser"); // Add this line
const taskRoutes = require("./routes/taskRoutes");
const auth = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const authController = require("./controllers/authController"); // Add this line
require("./config/database"); // Koneksi ke database

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser()); // Add this line
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/tasks", auth, taskRoutes); // Ensure this line is correct
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("auth/login", { message: null, token: null });
});

app.post("/login", authController.login); // Add this line to handle POST requests to /login

app.get("/register", (req, res) => {
  res.render("auth/register", { message: null, token: null });
});

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
