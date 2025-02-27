// script.js

$(document).ready(function () {
  // -------------------------------
  // 1. Filter Category
  // -------------------------------
  // When the filter dropdown changes, show only the tasks that match the selected category.
  $("#filterCategory").on("change", function () {
    var selectedCategory = $(this).val();

    if (selectedCategory === "Semua") {
      // Show all tasks if "Semua" (All) is selected.
      $("#taskTableBody tr").show();
    } else {
      // Loop through each task row and show/hide based on its data-category attribute.
      $("#taskTableBody tr").each(function () {
        var taskCategory = $(this).data("category");
        if (taskCategory === selectedCategory) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }
  });

  // -------------------------------
  // 2. Delete Task
  // -------------------------------
  // When a delete button is clicked, send an AJAX request to delete the task from the server.
  // On success, remove the task row from the table.
  $(document).on("click", ".delete-task", function () {
    // Use $(this) to reliably get the data-id from the clicked element
    const taskId = $(this).data("id");
    console.log("Task ID to delete:", taskId);
    
    if (!taskId) {
      console.error("Task ID not found on this element.");
      return;
    }
  
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      // Build the URL based on your route
      const url = `/tasks/hapus/${taskId}`;
      console.log("Sending DELETE request to:", url);
      
      $.ajax({
        url: url,
        type: "DELETE",
        dataType: "json", // Expecting JSON response
        success: function (response) {
          if (response.success) {
            // Remove the corresponding table row (assuming each row has data-id)
            $(`tr[data-id="${taskId}"]`).remove();
            console.log("Task deleted and removed from DOM.");
          } else {
            alert("Gagal menghapus tugas.");
          }
        },
        error: function (xhr, status, error) {
          console.error("Delete task error:", error);
          console.log("Response details:", xhr.responseText);
          alert("Terjadi kesalahan saat menghapus tugas.");
        },
      });
    }
  });

});
