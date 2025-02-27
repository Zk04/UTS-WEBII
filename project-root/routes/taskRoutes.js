const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validateTask");

const router = express.Router();
router.use(authMiddleware);

router.get("/", authMiddleware, taskController.index); // Menampilkan daftar tugas
router.get("/tambah", authMiddleware, taskController.tambah); // Menampilkan halaman tambah tugas
router.post("/simpan", authMiddleware, validateTask, taskController.simpan); // Menyimpan tugas baru
router.get("/edit/:id", authMiddleware, taskController.edit); // Menampilkan halaman edit tugas
router.post("/update/:id", authMiddleware, validateTask, taskController.update); // Menyimpan perubahan pada tugas yang telah diedit
router.delete("/hapus/:id", authMiddleware, taskController.hapus); // Menghapus tugas berdasarkan ID

module.exports = router; // Mengekspor router agar bisa digunakan di `app.js`
