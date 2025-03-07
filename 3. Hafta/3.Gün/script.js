$(document).ready(function () {
  let isLoading = false;

  function showLoading() {
    $("#loading").show();
  }

  function hideLoading() {
    $("#loading").hide();
  }

  function showError(message) {
    $("#error-message p").text(message || "Error. Please try again later.");
    $("#error-message").show();
    hideLoading();
  }

  function hideError() {
    $("#error-message").hide();
  }

  function fetchRandomUsers(count) {
    if (isLoading) return;

    isLoading = true;
    showLoading();

    const apiUrl = `https://randomuser.me/api/?results=${count}`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      timeout: 5000,
      success: function (data) {
        $("#user-container").empty();
        const sliderDiv = $('<div class="slider"></div>');

        data.results.forEach((user) => {
          const modalId = `user-modal-${user.login.uuid}`;

          const userItemHtml = `
            <div class="user-item">
              <a href="#${modalId}" data-fancybox>
                <img class="user-image" src="${user.picture.large}">
                <div class="details">
                  <p><strong>Name:</strong> ${user.name.first} ${user.name.last}</p>
                  <p><strong>Age:</strong> ${user.dob.age}</p>
                  <p><strong>Country:</strong> ${user.location.country}</p>
                </div>
              </a>
            </div>
          `;

          const modalContent = `
            <div id="${modalId}" style="display: none; max-width: 600px">
              <div class="modal-content">
                <img src="${
                  user.picture.large
                }" style="max-width: 200px; float: left; margin-right: 20px">
                <h3>${user.name.title} ${user.name.first} ${user.name.last}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> 
                  ${user.location.street.number} ${
            user.location.street.name
          },<br>
                  ${user.location.city}, ${user.location.state},<br>
                  ${user.location.country}, ${user.location.postcode}
                </p>
                <p><strong>Registered:</strong> ${new Date(
                  user.registered.date
                ).toLocaleDateString()}</p>
              </div>
            </div>
          `;

          sliderDiv.append(userItemHtml);
          $("body").append(modalContent);
        });

        $("#user-container").append(sliderDiv);

        $(".slider").slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
        });

        Fancybox.bind("[data-fancybox]", {});
      },
      error: function (xhr, status, error) {
        console.error("User loading error:", error);
        let errorMessage = "An unknown error occurred";

        if (status === "timeout") {
          errorMessage = "Request timed out. Please check your connection.";
        } else if (xhr.status === 0) {
          errorMessage =
            "Could not connect to server. Please check your internet connection.";
        } else if (xhr.status === 404) {
          errorMessage = "Requested resource not found.";
        } else if (xhr.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        }
        showError(errorMessage);
      },
      complete: function () {
        isLoading = false;
        hideLoading();
      },
    });
  }

  let initialCount = parseInt($("#user-count").val()) || 20;
  fetchRandomUsers(initialCount);

  $("#fetch-button").on("click", function () {
    let userCount = parseInt($("#user-count").val());
    if (userCount > 0 && userCount <= 50) {
      hideError();
      fetchRandomUsers(userCount);
    } else {
      alert("Please enter a number between 1 and 50.");
    }
  });
});
