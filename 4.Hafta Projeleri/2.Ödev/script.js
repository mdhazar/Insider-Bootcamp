$(document).ready(function () {
  const appendLocation = ".ins-api-users";
  $("body").css({
    backgroundColor: "lightgray",
    margin: "0",
    padding: "0",
    color: "#333",
  });
  $(appendLocation).css({
    cursor: "pointer",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    margin: "20px auto",
    maxWidth: "800px",
    backgroundColor: "#e3e1e1",
  });
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        const userCards = $(appendLocation).find("div[data-id]");
        if (
          userCards.length === 0 &&
          $(appendLocation).find(".reload-btn").length === 0
        ) {
          showReloadButton();
        }
      }
    });
  });

  observer.observe(document.querySelector(appendLocation), {
    childList: true,
    subtree: true,
  });

  function showReloadButton() {
    const buttonUsed = sessionStorage.getItem("reloadButtonUsed") === "true";

    const reloadBtn = $(`
      <button class="reload-btn" ${buttonUsed ? "disabled" : ""}>
        ${buttonUsed ? "Reload limit reached for this session" : "Reload Users"}
      </button>
    `);

    reloadBtn.css({
      backgroundColor: buttonUsed ? "#cccccc" : "#4CAF50",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "4px",
      cursor: buttonUsed ? "not-allowed" : "pointer",
      display: "block",
      margin: "20px auto",
    });

    if (!buttonUsed) {
      reloadBtn.click(function () {
        sessionStorage.setItem("reloadButtonUsed", "true");
        fetch("https://jsonplaceholder.typicode.com/users")
          .then((response) => {
            if (!response.ok) throw new Error("Failed to load data");
            return response.json();
          })
          .then((users) => {
            const dataStore = {
              data: users,
              timestamp: new Date().getTime(),
            };
            localStorage.setItem("userDataStore", JSON.stringify(dataStore));
            displayUsers(users);
          })
          .catch((error) => {
            $(appendLocation).html(
              `<p style="color:red">Error: ${error.message}</p><p>Click to retry</p>`
            );
          });
        $(this)
          .prop("disabled", true)
          .css({
            backgroundColor: "#cccccc",
            cursor: "not-allowed",
          })
          .text("Reload limit reached for this session");
      });
    }

    $(appendLocation).append(reloadBtn);
  }

  const storedDataObj = JSON.parse(
    localStorage.getItem("userDataStore") || "{}"
  );
  const storedData = storedDataObj.data;
  const storedTime = storedDataObj.timestamp;
  const isValid =
    storedData &&
    storedTime &&
    new Date().getTime() - parseInt(storedTime) < 24 * 60 * 60 * 1000;

  if (isValid) {
    displayUsers(storedData);
    $(appendLocation).prepend(
      "<p><em>Data from localStorage. Click to refresh.</em></p>"
    );
  } else {
    $(appendLocation).html("<p>Click here to load users</p>");
  }

  $(appendLocation).click(function (e) {
    if (
      $(e.target).hasClass("delete-btn") ||
      $(e.target).hasClass("reload-btn")
    )
      return;

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load data");
        return response.json();
      })
      .then((users) => {
        const dataStore = {
          data: users,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem("userDataStore", JSON.stringify(dataStore));
        displayUsers(users);
      })
      .catch((error) => {
        $(appendLocation).html(
          `<p style="color:red">Error: ${error.message}</p><p>Click to retry</p>`
        );
      });
  });

  function displayUsers(users) {
    $(appendLocation).html("<p><em>Click to refresh data</em></p>");
    if (!users || users.length === 0) {
      showReloadButton();
      return;
    }

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
        const dataStore = JSON.parse(
          localStorage.getItem("userDataStore") || "{}"
        );
        if (dataStore.data) {
          dataStore.data = dataStore.data.filter((user) => user.id !== id);
          localStorage.setItem("userDataStore", JSON.stringify(dataStore));
          displayUsers(dataStore.data);
        }
      });

      $(appendLocation).append(card);
    });
  }
});
