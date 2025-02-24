const Task = require("../models/taskModel");// Mengimpor model Task dari database
const { io } = require("../server"); // Mengimpor WebSocket (Socket.IO) untuk komunikasi real-tim

// Menampilkan semua tugas pengguna yang sedang login
exports.index = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Pastikan req.user tersedia
    const userName = req.user ? req.user.username : "Guest";
    const tasks = await Task.find({ userId });// Ambil semua tugas milik user tersebut
    res.render("tasks/index", { tasks, user: req.user, message: null, token: req.query.token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Menampilkan form tambah tugas
exports.tambah = (req, res) => {
  res.render("tasks/tambah", { user: req.user, message: null, token: req.query.token });
};

// Menyimpan tugas baru ke database
exports.simpan = async (req, res) => {
  try {
    const { title, description, category, deadline, status } = req.body;
    const userId = req.user ? req.user.id : null; // Pastikan req.user ada

    const newTask = new Task({
      userId,
      title,
      description,
      category,
      deadline,
      status,
    });
    await newTask.save();// Simpan tugas ke database
    io.emit("taskAdded", newTask); // Emit WebSocket event

    res.redirect("/tasks"); // Redirect setelah sukses menambahkan tugas
  } catch (error) {
    res.render("tasks/tambah", {
      user: req.user,
      message: "Gagal menambahkan tugas!",
      token: req.query.token,
    });
  }
};

// Menampilkan form edit tugas berdasarkan ID
exports.edit = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);// Cari tugas berdasarkan ID
    if (!task) {
      return res.status(404).send("Tugas tidak ditemukan.");
    }
    res.render("tasks/edit", { task, user: req.user, message: null, token: req.query.token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Memperbarui tugas berdasarkan ID
exports.update = async (req, res) => {
  try {
    const { title, description, category, deadline, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      deadline,
      status,
    }, { new: true }); // `new: true` agar mendapatkan data terbaru setelah update


    io.emit("taskUpdated", updatedTask); // Emit WebSocket event

    res.redirect("/tasks"); // Redirect setelah sukses update tugas
  } catch (error) {
    res.render("tasks/edit", {
      user: req.user,
      message: "Gagal memperbarui tugas!",
      task: req.body,
      token: req.query.token,
    });
  }
};

// Menghapus tugas berdasarkan ID
exports.hapus = async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log("Menghapus tugas dengan ID:", taskId); // Debugging

    const deletedTask = await Task.findByIdAndDelete(taskId);
    
    if (!deletedTask) {
      console.log("Tugas tidak ditemukan.");
      return res.status(404).json({ message: "Tugas tidak ditemukan" });
    }

    console.log("Tugas berhasil dihapus:", deletedTask);
    io.emit("taskDeleted", deletedTask); // Emit WebSocket event

    res.status(200).json({ message: "Tugas berhasil dihapus!" }); // Ensure this line is correct
  } catch (error) {
    res.status(500).json({ message: error.message }); // Ensure this line is correct
  }
};
// Filter tugas berdasarkan kategori
exports.filter = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const category = req.query.category;
    let tasks;
    if (category === "Semua") {
      tasks = await Task.find({ userId });
    } else {
      tasks = await Task.find({ userId, category });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
};