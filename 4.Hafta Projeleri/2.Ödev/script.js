$(document).ready(function () {
  $("body").css({
    backgroundColor: "lightgray",
    margin: "0",
    padding: "0",
    color: "#333",
  });

  $(".ins-api-users").css({
    cursor: "pointer",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    margin: "20px auto",
    maxWidth: "800px",
    backgroundColor: "#e3e1e1",
  });

  const storedData = localStorage.getItem("userData");
  const storedTime = localStorage.getItem("userDataTimestamp");
  const isValid =
    storedData &&
    storedTime &&
    new Date().getTime() - parseInt(storedTime) < 24 * 60 * 60 * 1000;

  if (isValid) {
    displayUsers(JSON.parse(storedData));
    $(".ins-api-users").prepend(
      "<p><em>Data from localStorage. Click to refresh.</em></p>"
    );
  } else {
    $(".ins-api-users").html("<p>Click here to load users</p>");
  }

  $(".ins-api-users").click(function (e) {
    if ($(e.target).hasClass("delete-btn")) return;

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load data");
        return response.json();
      })
      .then((users) => {
        localStorage.setItem("userData", JSON.stringify(users));
        localStorage.setItem("userDataTimestamp", new Date().getTime());
        displayUsers(users);
      })
      .catch((error) => {
        $(".ins-api-users").html(
          `<p style="color:red">Error: ${error.message}</p><p>Click to retry</p>`
        );
      });
  });

  function displayUsers(users) {
    $(".ins-api-users").html("<p><em>Click to refresh data</em></p>");

    users.forEach((user) => {
      const card = $(`
        <div data-id="${user.id}">
          <h3>${user.name}</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
          <button class="delete-btn">Delete</button>
        </div>
      `);

      card.css({
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #eee",
        borderRadius: "3px",
      });

      card.find(".delete-btn").css({
        backgroundColor: "#ff5555",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
      });

      card.find(".delete-btn").click(function (e) {
        e.stopPropagation();
        const id = $(this).parent().data("id");
        const data = JSON.parse(localStorage.getItem("userData") || "[]");
        const updated = data.filter((user) => user.id !== id);
        localStorage.setItem("userData", JSON.stringify(updated));
        displayUsers(updated);
      });

      $(".ins-api-users").append(card);
    });
  }
});
