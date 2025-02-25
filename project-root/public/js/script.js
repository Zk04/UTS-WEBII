document.addEventListener("DOMContentLoaded", () => {

  //Event listener untuk menghapus tugas
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-task")) {
      const taskId = event.target.getAttribute("data-id");
      if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
        const response = await fetch(`/tasks/hapus/${taskId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          event.target.closest("tr").remove();
        } else {
          const error = await response.text();
          alert("Gagal menghapus tugas: " + error);
        }
      }
    }
  });

  const socket = io();
  socket.on("newTask", (task) => {
    alert(`Tugas baru ditambahkan: ${task.title}`);
  });

  socket.on("taskAdded", (task) => {
    alert(`Tugas baru ditambahkan: ${task.title}`);
  });

  socket.on("taskUpdated", (task) => {
    alert(`Tugas diperbarui: ${task.title}`);
  });

  socket.on("taskDeleted", (task) => {
    alert(`Tugas dihapus: ${task.title}`);
  });
});
// AJAX digunakan untuk manipulasi data tanpa reload halaman
$(document).ready(function () {
    // Tambah tugas dengan AJAX
    $('#taskForm').on('submit', function (e) {
        e.preventDefault(); // Mencegah reload halaman
        let taskData = {
            title: $('#title').val(),
            category: $('#category').val(),
            deadline: $('#deadline').val(),
            status: $('#status').val()
        };

        $.ajax({
            url: "/tasks",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(taskData),
            success: function (response) {
                alert("Tugas berhasil ditambahkan!");
                window.location.href = "/tasks"; // Refresh halaman utama
            },
            error: function (xhr) {
                alert("Gagal menambahkan tugas: " + xhr.responseText);
            }
        });
    });

    // Edit tugas dengan AJAX
    $('#editTaskForm').on('submit', function (e) {
      e.preventDefault();
      let taskId = $(this).data("id");  // Ambil ID tugas yang akan diedit

      let taskData = {
          title: $('#editTitle').val(),
          category: $('#editCategory').val(),
          deadline: $('#editDeadline').val(),
          status: $('#editStatus').val()
      };

      $.ajax({
          url: "/tasks/" + taskId,
          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify(taskData),
          success: function (response) {
              alert("Tugas berhasil diperbarui!");
              window.location.href = "/";
          },
          error: function (xhr) {
              alert("Gagal memperbarui tugas: " + xhr.responseText);
          }
      });
    });

    //Event listener untuk perubahan pada dropdown kategori
    $('#filterCategory').on('change', function () {
      let selectedCategory = $(this).val(); // Ambil nilai kategori yang dipilih
      
      $.ajax({
          url: `/tasks/filter?category=${selectedCategory}`, // Kirim permintaan ke server
          type: "GET",
          success: function (tasks) {
              let taskTableBody = $('#taskTableBody');
              taskTableBody.empty(); // Kosongkan tabel sebelum menampilkan data baru
              
              if (tasks.length === 0) {
                  taskTableBody.append('<tr><td colspan="5">Tidak ada tugas dalam kategori ini.</td></tr>');
              } else {
                  tasks.forEach(task => {
                      let row = `<tr>
                          <td>${task.title}</td>
                          <td>${task.description}</td>
                          <td>${task.category}</td>
                          <td>${new Date(task.deadline).toISOString().split('T')[0]}</td>
                          <td>${task.status}</td>
                              <td>
                                <a href="/tasks/edit/${task._id}" class="btn btn-warning btn-sm">Edit</a>
                                <button class="btn btn-danger btn-sm delete-task" data-id="${task._id}">Hapus</button>
                              </td>
                          </tr>`;
                      taskTableBody.append(row);
                  });
              }
          },
          error: function (xhr) {
              alert("Gagal mengambil data tugas: " + xhr.responseText);
          }
      });
  });

    // $("#confirmDeleteTask").click(function () {
    //     let taskId = $("#deleteTaskId").val();

    //     $.ajax({
    //         url: `/tasks/hapus/${taskId}`,
    //         type: "DELETE",
    //         success: function (response) {
    //             if (response.success) {
    //                 $(`#task-${taskId}`).remove();
    //                 $("#deleteTaskModal").modal("hide");
    //             }
    //         },
    //         error: function () {
    //             alert("Error deleting task");
    //         }
    //     });
    // });
});
