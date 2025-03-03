// script.js

$(document).ready(function () {
  // -------------------------------
  // 1. Filter Category (Filter berdasarkan kategori tugas)
  // -------------------------------
  $("#filterCategory").on("change", function () {
    var selectedCategory = $(this).val(); // Ambil kategori yang dipilih oleh pengguna

    if (selectedCategory === "Semua") {
      // Jika pengguna memilih "Semua", tampilkan semua tugas
      $("#taskTableBody tr").show();
    } else {
      // Loop melalui setiap baris tugas dan tampilkan/sembunyikan sesuai kategori
      $("#taskTableBody tr").each(function () {
        var taskCategory = $(this).data("category"); // Ambil kategori tugas dari atribut data-category
        if (taskCategory === selectedCategory) {
          $(this).show(); // Tampilkan jika kategori cocok
        } else {
          $(this).hide(); // Sembunyikan jika tidak cocok
        }
      });
    }
  });

  // -------------------------------
  // 2. Delete Task (Menghapus tugas)
  // -------------------------------
  // Saat tombol hapus ditekan, kirim permintaan AJAX untuk menghapus tugas dari server
  $(document).on("click", ".delete-task", function () {
    const taskId = $(this).data("id"); // Ambil ID tugas dari tombol yang diklik
    console.log("Task ID to delete:", taskId);

    if (!taskId) {
      console.error("Task ID tidak ditemukan pada elemen ini.");
      return;
    }

    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      const url = `/tasks/hapus/${taskId}`; // URL endpoint untuk menghapus tugas
      console.log("Mengirim permintaan DELETE ke:", url);

      $.ajax({
        url: url,
        type: "DELETE",
        dataType: "json", // Mengharapkan respons dalam format JSON
        success: function (response) {
          if (response.success) {
            // Jika penghapusan berhasil, hapus baris tugas dari tabel
            $(`tr[data-id="${taskId}"]`).remove();
            console.log("Tugas berhasil dihapus dan dihapus dari DOM.");
          } else {
            alert("Gagal menghapus tugas.");
          }
        },
        error: function (xhr, status, error) {
          console.error("Kesalahan saat menghapus tugas:", error);
          console.log("Detail respons:", xhr.responseText);
          alert("Terjadi kesalahan saat menghapus tugas.");
        },
      });
    }
  });
});
