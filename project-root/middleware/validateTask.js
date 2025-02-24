//  Middleware untuk validasi input tugas sebelum disimpan ke database.
const validateTask = (req, res, next) => {
  const { title, category, deadline, status } = req.body;
  if (!title || !category || !deadline || !status) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }
  next();
};

module.exports = validateTask;

/*
* Memeriksa apakah semua field yang diperlukan (title, category, deadline, status) telah diisi.
* Jika ada yang kosong, akan mengembalikan response status 400 (Bad Request).
* Jika valid, lanjut ke middleware atau handler berikutnya dengan `next()`.
*/
