document.addEventListener("DOMContentLoaded", function () {
  const favButton = document.getElementById("favButton");
  const heartIcon = favButton.querySelector("i");

  favButton.addEventListener("click", function () {
    heartIcon.classList.toggle("active");
  });
});
