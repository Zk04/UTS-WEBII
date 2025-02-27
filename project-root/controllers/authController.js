const bcrypt = require("bcryptjs"); // Library untuk hashing password
const User = require("../models/userModel"); // Model pengguna dari database
const { generateToken } = require("../config/auth"); // Fungsi untuk membuat token JWT

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.render("auth/register", { error: "Username already taken" });

    // // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create and save new user
    const user = new User({ username, password});
    await user.save();

    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Handle user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.render("login", { error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { error: "Invalid " });

    // Generate JWT token & store in cookie
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    // res.status(201).json({ token }); //For Postman token

    res.redirect("/tasks");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Handle user logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};
