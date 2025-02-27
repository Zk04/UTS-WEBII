const mongoose = require("mongoose"); // Import mongoose untuk mengelola database MongoDB

// Definisi skema (Schema) untuk koleksi "tasks" di MongoDB
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tipe data ObjectId yang merujuk ke user
  title: { type: String, required: true },
  category: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, required: true },
}, { versionKey: false });

const Task = mongoose.model("Task", TaskSchema); // Membuat model "Task" berdasarkan skema yang telah didefinisikan

module.exports = Task;





