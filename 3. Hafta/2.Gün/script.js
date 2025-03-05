$(document).ready(function () {
  const apiKey = "bL0bhCIhT3uZ19mi5UEtuIa6fKduXxnJZdVjuzS0";
  let isLoading = false;

  function fetchAPODImages(count = 5) {
    if (isLoading) return;

    isLoading = true;
    $("#loading").show();

    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
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
        console.error("Error fetching APOD:", error);
        $("#apod-container").append(
          "<p>Error loading NASA images. Please try again later.</p>"
        );
      },
      complete: function () {
        isLoading = false;
        $("#loading").hide();
      },
    });
  }

  fetchAPODImages(5);

  $(window).scroll(function () {
    if (
      $(window).scrollTop() + $(window).height() >
      $(document).height() - 100
    ) {
      fetchAPODImages(5);
    }
  });
});
