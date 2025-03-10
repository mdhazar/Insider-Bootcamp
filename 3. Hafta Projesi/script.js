$(document).ready(function () {
  let allProducts = [];
  let displayedProducts = [];
  let visibleProductCount = 5;
  const productGrid = $(".product-grid");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  $(".sort-controls").prepend(`
    <div class="search-container">
      <input type="text" id="searchProducts" placeholder="Search products...">
    </div>
  `);

  fetchProducts();

  $("#darkMode").click(toggleDarkMode);

  $("#searchProducts").on("input", function () {
    filterProducts();
  });

  $("#sortBy").change(function () {
    sortProducts($(this).val());
    renderProducts();
  });

  $("#applyFilters").click(function () {
    filterProducts();
  });

  $("#resetFilters").click(function () {
    $('input[name="category"]').prop("checked", false);
    $("#searchProducts").val("");
    filterProducts();
  });

  function setupLoadMoreButton() {
    if (
      $("#loadMoreBtn").length === 0 &&
      displayedProducts.length > visibleProductCount
    ) {
      productGrid.after(
        '<button id="loadMoreBtn" class="load-more-btn">Load More</button>'
      );
      $("#loadMoreBtn").click(loadMoreProducts);
    } else if (displayedProducts.length <= visibleProductCount) {
      $("#loadMoreBtn").remove();
    }
  }

  function loadMoreProducts() {
    visibleProductCount += 5;
    if (visibleProductCount >= displayedProducts.length) {
      $("#loadMoreBtn").remove();
    }
    renderProducts();
  }

  function fetchProducts() {
    $.ajax({
      url: "https://fakestoreapi.com/products",
      method: "GET",
      success: function (data) {
        allProducts = data;
        displayedProducts = [...allProducts];
        renderProducts();
        setupLoadMoreButton();
      },
      error: function (error) {
        console.error("Error fetching products:", error);
        productGrid.html(
          "<p>Error loading products. Please try again later.</p>"
        );
      },
    });
  }

  function filterProducts() {
    const searchTerm = $("#searchProducts").val().toLowerCase();
    const selectedCategories = $('input[name="category"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();

    displayedProducts = allProducts.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => {
          if (cat === "men") return product.category.includes("men's");
          if (cat === "women") return product.category.includes("women's");
          return product.category.includes(cat);
        });

      return matchesSearch && matchesCategory;
    });

    visibleProductCount = 5;
    renderProducts();
    setupLoadMoreButton();
  }

  function sortProducts(sortBy) {
    switch (sortBy) {
      case "price-low":
        displayedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        displayedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        displayedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "popularity":
        displayedProducts.sort((a, b) => b.rating.count - a.rating.count);
        break;
      default:
        displayedProducts.sort((a, b) => b.rating.count - a.rating.count);
    }
  }

  function renderProducts() {
    productGrid.empty();

    const productsToShow = displayedProducts.slice(0, visibleProductCount);

    if (productsToShow.length === 0) {
      productGrid.html("<p>No products found matching your criteria.</p>");
      return;
    }

    productsToShow.forEach((product) => {
      const productCard = $(`
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="product-info">
            <h3>${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <a href="#" class="add-to-cart" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Add to cart
            </a>
            <a href="#" class="add-to-favorites" data-id="${product.id}">
              <i class="${
                favorites.some((f) => f.id === product.id) ? "fas" : "far"
              } fa-heart"></i>
            </a>
          </div>
          <a href="#product-modal-${
            product.id
          }" class="view-details" data-fancybox>View Details</a>
          
          <div id="product-modal-${
            product.id
          }" style="display:none;" class="product-modal">
            <div class="product-modal-content">
              <div class="product-modal-image">
                <img src="${product.image}" alt="${product.title}">
              </div>
              <div class="product-modal-info">
                <h2>${product.title}</h2>
                <p class="product-modal-price">$${product.price.toFixed(2)}</p>
                <p class="product-modal-category">Category: ${
                  product.category
                }</p>
                <div class="product-modal-rating">
                  Rating: ${product.rating.rate}/5 (${
        product.rating.count
      } reviews)
                </div>
                <p class="product-modal-description">${product.description}</p>
                <div class="product-modal-actions">
                  <a href="#" class="add-to-cart-modal" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to cart
                  </a>
                  <a href="#" class="add-to-favorites-modal" data-id="${
                    product.id
                  }">
                    <i class="far fa-heart"></i> Add to favorites
                  </a>
                </div>
              </div>x
            </div>
          </div>
        </div>
      `);

      productGrid.append(productCard);
    });

    $(".add-to-cart, .add-to-cart-modal").click(function (e) {
      e.preventDefault();
      addToCart($(this).data("id"));
    });

    $(".add-to-favorites, .add-to-favorites-modal").click(function (e) {
      e.preventDefault();
      toggleFavorite($(this).data("id"));
    });
  }

  function addToCart(productId) {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
      const productElement = $(`.product-card[data-id="${productId}"]`);
      productElement.effect("shake", { times: 3, distance: 5 }, 300);
    }
  }

  function toggleFavorite(productId) {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    const index = favorites.findIndex((f) => f.id === productId);
    const icons = $(
      `.add-to-favorites[data-id="${productId}"] i, .add-to-favorites-modal[data-id="${productId}"] i`
    );

    if (index === -1) {
      favorites.push(product);
      icons.removeClass("far").addClass("fas");
      alert(`${product.title} added to favorites!`);
    } else {
      favorites.splice(index, 1);
      icons.removeClass("fas").addClass("far");
      alert(`${product.title} removed from favorites!`);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesDisplay();
  }

  function updateFavoritesDisplay() {
    const favoritesList = $(".favorites-list");
    favoritesList.empty();

    if (favorites.length === 0) {
      favoritesList.html("<p>No favorites yet!</p>");
      return;
    }

    favorites.forEach((product) => {
      const favoriteCard = $(`
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="product-info">
            <h3>${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="remove-favorite" data-id="${product.id}">
              <i class="fas fa-heart"></i> Remove from Favorites
            </button>
            <button class="add-to-cart" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      `);
      favoritesList.append(favoriteCard);
    });
  }

  function updateCartDisplay() {
    const cartContainer = $(".cart-container");
    const orderSummary = $(".order-summary");

    cartContainer.find(".cart-items").remove();
    const cartItemsContainer = $('<div class="cart-items"></div>');

    let total = 0;
    cart.forEach((product) => {
      total += product.price;
      const cartItem = $(`
        <div class="cart-item" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <div class="cart-item-details">
            <h4>${product.title}</h4>
            <p>$${product.price.toFixed(2)}</p>
          </div>
          <button class="remove-from-cart" data-id="${product.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `);
      cartItemsContainer.append(cartItem);
    });

    cartContainer.prepend(cartItemsContainer);

    orderSummary.find(".total").remove();
    orderSummary.prepend(`
      <div class="total">
        <h4>Total: $${total.toFixed(2)}</h4>
      </div>
    `);
  }

  $(document).on("click", ".remove-favorite", function (e) {
    e.preventDefault();
    toggleFavorite($(this).data("id"));
  });

  $(document).on("click", ".remove-from-cart", function (e) {
    e.preventDefault();
    const productId = $(this).data("id");
    const index = cart.findIndex((item) => item.id === productId);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
    }
  });

  $("#clearCart").click(function () {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  });

  updateFavoritesDisplay();
  updateCartDisplay();

  const originalRenderProducts = renderProducts;
  renderProducts = function () {
    originalRenderProducts();

    favorites.forEach((favorite) => {
      $(`.add-to-favorites[data-id="${favorite.id}"] i`)
        .removeClass("far")
        .addClass("fas");
    });
  };

  function toggleDarkMode() {
    $("body").toggleClass("dark-mode");
    const isDarkMode = $("body").hasClass("dark-mode");
    $("#darkMode").text(isDarkMode ? "Light mode" : "Dark mode");
  }
});
