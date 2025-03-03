const Task = require("../models/taskModel"); // Mengimpor model Task untuk berinteraksi dengan database
const { io } = require("../server"); // Mengimpor WebSocket (Socket.IO) untuk komunikasi secara real-time

// Menampilkan semua tugas pengguna yang sedang login
exports.index = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Mengecek apakah user sudah login
    const userName = req.user ? req.user.username : "Guest"; // Mengambil nama pengguna
    const tasks = await Task.find({ userId }); // Mengambil semua tugas berdasarkan userId
    res.render("tasks/index", {
      tasks, // Mengirim data tugas ke view
      user: req.user || { username: "Guest" }, // Mengirim data user ke view
      message: null, // Pesan notifikasi (jika ada)
      token: req.query.token, // Token autentikasi yang dikirim melalui query parameter
    });
  } catch (error) {
    res.status(500).send(error.message); // Menampilkan error jika terjadi kesalahan
  }
};

// Menampilkan form tambah tugas
exports.tambah = (req, res) => {
  res.render("tasks/tambah", {
    user: req.user, // Mengirim data user ke view
    message: null, // Pesan notifikasi (jika ada)
    token: req.query.token, // Token autentikasi
  });
};

// Menyimpan tugas baru ke database
exports.simpan = async (req, res) => {
  try {
    const { title, category, deadline, status } = req.body; // Mengambil data dari form
    const userId = req.user ? req.user.id : null; // Mengecek apakah user sudah login

    // Membuat tugas baru berdasarkan input user
    const newTask = new Task({
      userId,
      title,
      category,
      deadline,
      status,
    });
    await newTask.save(); // Menyimpan tugas ke database

    // Mengirim event ke semua client menggunakan WebSocket (Socket.IO)
    io.emit("taskAdded", {
      message: `Tugas baru: ${title} ditambahkan!`,
      task: newTask,
    });

    res.redirect("/tasks"); // Redirect ke halaman daftar tugas setelah berhasil
  } catch (error) {
    res.render("tasks/tambah", {
      user: req.user,
      message: "Gagal menambahkan tugas!", // Pesan error jika terjadi kegagalan
      token: req.query.token,
    });
  }
};

// Menampilkan form edit tugas berdasarkan ID
exports.edit = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // Mencari tugas berdasarkan ID
    if (!task) {
      return res.status(404).send("Tugas tidak ditemukan."); // Jika tugas tidak ditemukan
    }
    res.render("tasks/edit", {
      task, // Mengirim data tugas ke view
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
    const { title, description, category, deadline, status } = req.body; // Mengambil data dari form
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        deadline,
        status,
      },
      { new: true } // Opsi ini untuk memastikan mendapatkan data terbaru setelah di-update
    );

    // Mengirim event ke semua client jika tugas berhasil diupdate
    io.emit("taskUpdated", {
      message: `Tugas: ${title} diperbarui!`,
      task: updatedTask,
    });

    res.redirect("/tasks"); // Redirect ke halaman daftar tugas
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Menghapus tugas berdasarkan ID
exports.hapus = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id }); // Menghapus tugas dari database
    io.emit("taskDeleted", { message: "Tugas dihapus" }); // Mengirim event ke semua client

    res.json({ success: true, id: req.params.id }); // Mengirim respons JSON ke client
    // res.redirect("/tasks"); // Jika ingin redirect ke halaman daftar tugas
  } catch (error) {
    res.status(500).send(error.message);
  }
};
