$("#darkMode").on("click", function () {
  $("body").toggleClass("dark-mode");
  $("#darkMode").toggleClass("dark-mode");
  $(this).css({ transition: "background-color 0.5s", cursor: "pointer" });
});

$(document).ready(updateTable);
