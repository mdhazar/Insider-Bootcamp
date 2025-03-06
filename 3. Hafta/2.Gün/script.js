$(document).ready(function () {
  const apiKey = "bL0bhCIhT3uZ19mi5UEtuIa6fKduXxnJZdVjuzS0";
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
  function fetchAPODImages(count = 5) {
    if (isLoading) return;

    isLoading = true;
    $("#loading").show();

    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      timeout: 5000,
      success: function (data) {
        data.forEach((apod) => {
          if (apod.media_type !== "image") return;

          const apodItemHtml = `
                            <div class="apod-item">
                                <img class="apod-image" src="${apod.url}" >
                                <div class="details">
                                    <p><strong>Title:</strong> ${apod.title}</p>
                                    <p><strong>Date:</strong> ${apod.date}</p>
                                    <p><strong>Copyright:</strong> ${
                                      apod.copyright || "Unknown"
                                    }</p>
                                    <p><strong>Explanation:</strong> ${
                                      apod.explanation
                                    }</p>
                                </div>
                            </div>
                        `;
          $("#apod-container").append(apodItemHtml);
        });
      },
      error: function (xhr, status, error) {
        console.error("APOD loading error:", error);

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
        $("#loading").hide();
      },
    });
  }

  fetchAPODImages(5);
  $("#retry-button").on("click", function () {
    hideError();
    fetchAPODImages(5);
  });

  let scrollTimeout;

  $(window).scroll(function () {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    showLoading();

    scrollTimeout = setTimeout(() => {
      if (
        $(window).scrollTop() + $(window).height() >
        $(document).height() - 100
      ) {
        fetchAPODImages(5);
      }
      hideLoading();
    }, 3000);
  });
});
