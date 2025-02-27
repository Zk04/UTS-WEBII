const Task = require("../models/taskModel"); // Mengimpor model Task dari database
const { io } = require("../server"); // Mengimpor WebSocket (Socket.IO) untuk komunikasi real-tim

// Menampilkan semua tugas pengguna yang sedang login
exports.index = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Pastikan req.user tersedia
    const userName = req.user ? req.user.username : "Guest";
    const tasks = await Task.find({ userId }); // Ambil semua tugas milik user tersebut
    res.render("tasks/index", {
      tasks,
      user: req.user || { username: "Guest" },
      message: null,
      token: req.query.token,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Menampilkan form tambah tugas
exports.tambah = (req, res) => {
  res.render("tasks/tambah", {
    user: req.user,
    message: null,
    token: req.query.token,
  });
};

// Menyimpan tugas baru ke database
exports.simpan = async (req, res) => {
  try {
    const { title, category, deadline, status } = req.body;
    const userId = req.user ? req.user.id : null; // Pastikan req.user ada

    const newTask = new Task({
      userId,
      title,
      category,
      deadline,
      status,
    });
    await newTask.save(); // Simpan tugas ke database
    // Kirim event WebSocket ke semua client
    io.emit("taskAdded", {
      message: `Tugas baru: ${title} ditambahkan!`,
      task: newTask,
    });

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
    const task = await Task.findById(req.params.id); // Cari tugas berdasarkan ID
    if (!task) {
      return res.status(404).send("Tugas tidak ditemukan.");
    }
    res.render("tasks/edit", {
      task,
      user: req.user,
      message: null,
      token: req.query.token,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Memperbarui tugas berdasarkan ID
exports.update = async (req, res) => {
  try {
    const { title, description, category, deadline, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        deadline,
        status,
      },
      { new: true }
    ); // `new: true` agar mendapatkan data terbaru setelah update

    // Kirim event WebSocket ke semua client
    io.emit("taskUpdated", {
      message: `Tugas: ${title} diperbarui!`,
      task: updatedTask,
    });

    res.redirect("/tasks"); // Redirect setelah sukses update tugas
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Menghapus tugas berdasarkan ID
exports.hapus = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id });
    io.emit("taskDeleted", { message: "task dihapus" });
    res.json({ success: true, id: req.params.id });
    // res.redirect("/tasks"); // Redirect instead of sending JSON
  } catch (error) {
    res.status(500).send(error.message);
  }
};
