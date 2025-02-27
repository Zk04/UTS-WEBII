# Panduan Penggunaan Aplikasi

## Koneksi ke Database
1. Buat connection dengan nama `taskDB` dan buat 2 collection dengan nama `tasks` dan `users`. kemudian hubungkan.

## Cara Menjalankan Proyek
1. Clone repository ini ke lokal Anda.
2. Jalankan perintah
   ```sh
   npm  init -y
   ```
3. Jalankan juga perintah berikut untuk menginstal modul yang diperlukan:
   ```sh
   npm install express mongoose bcryptjs jsonwebtoken cookie-parser dotenv ejs socket.io body-parser nodemon
   ```
4. Pastikan Anda berada di direktori proyek yang benar. kemudian pada bagian package.json masukkan pada bagian scripts``` "node app.js",
    "dev": "nodemon app.js ```
5. Untuk menjalankan server, gunakan perintah berikut:
   ```sh
   npm run dev 
   ```

## Fitur yang Telah Diimplementasikan

### Autentikasi Pengguna
- Registrasi pengguna baru dengan hashing password menggunakan `bcryptjs`.
- Login dengan validasi username dan password.
- Menyimpan sesi pengguna menggunakan `jsonwebtoken` (JWT) dengan cookie.
- Logout untuk menghapus sesi pengguna.

### Manajemen Tugas (CRUD)
- Menambahkan tugas baru dengan **title, description, category, status**, dan **deadline**.
- Mengedit dan menghapus tugas dengan modal tanpa perlu refresh halaman.
- Filter tugas berdasarkan kategori. (menggunakan AJAX)

### LINK GITHUB
-  https://github.com/Zk04/UTS-WEBII/tree/main
