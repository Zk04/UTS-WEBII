const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validateTask");

router.get("/", authMiddleware, taskController.index); // Menampilkan daftar tugas
router.get("/tambah", authMiddleware, taskController.tambah); // Menampilkan halaman tambah tugas
router.post("/simpan", authMiddleware, validateTask, taskController.simpan); // Menyimpan tugas baru
router.get("/edit/:id", authMiddleware, taskController.edit); // Menampilkan halaman edit tugas
router.post("/update/:id", authMiddleware, validateTask, taskController.update); // Menyimpan perubahan pada tugas yang telah diedit
router.delete("/hapus/:id", authMiddleware, taskController.hapus); // Menghapus tugas berdasarkan ID
router.get("/filter", authMiddleware, taskController.filter); // Filter tugas berdasarkan kategori

// Route tambahan untuk menampilkan halaman utama dengan daftar tugas
// router.get("/", authMiddleware, async (req, res) => {
//     try {
//       const tasks = await Task.find(); // Mengambil semua tugas dari database
//       res.render("index", { user: req.user, tasks }); // Kirim user ke template
//     } catch (error) {
//       res.status(500).send("Terjadi kesalahan server");
//     }
//   });
module.exports = router; // Mengekspor router agar bisa digunakan di `app.js`
