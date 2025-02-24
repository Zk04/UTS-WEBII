# Panduan Penggunaan Aplikasi

## Koneksi ke Database
1. Buat koneksi baru di MongoDB, kemudian hubungkan.
2. Buat connection dengan nama `taskDB` dan buat 2 collection dengan nama `tasks` dan `users`

## Cara Menjalankan Proyek
1. Clone repository ini ke lokal Anda.
2. Jalankan perintah berikut untuk menginstal dependensi yang diperlukan:
   ```sh
   npm install express mongoose bcryptjs jsonwebtoken cookie-parser dotenv ejs socket.io method-override 
   ```
3. Pastikan Anda berada di direktori proyek yang benar.
4. Untuk menjalankan server, gunakan perintah berikut:
   ```sh
   npm run dev atau nodemon app.js
   ```

## Fitur yang Telah Diimplementasikan

### Autentikasi Pengguna
- Registrasi pengguna baru dengan hashing password menggunakan `bcryptjs`.
- Login dengan validasi username dan password.
- Menyimpan sesi pengguna menggunakan `jsonwebtoken` (JWT) dengan cookie.
- Logout untuk menghapus sesi pengguna.

### Manajemen Tugas
- Menambahkan tugas baru dengan **title, category, status**, dan **deadline**.
- Mengedit dan menghapus tugas dengan modal tanpa perlu refresh halaman (menggunakan AJAX).
- Filter tugas berdasarkan kategori.


