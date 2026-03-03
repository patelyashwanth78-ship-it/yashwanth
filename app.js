const products = [
  {
    id: 1,
    name: "bruce lee tshirt",
    category: "Oversized",
    color: "Black",
    price: 499,
    popularity: 98,
    createdAt: "2026-02-24",
    image: "images/brucelee.jpeg",
    description: "Premium oversized silhouette with breathable cotton blend for all-day comfort.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8
  },
  {
    id: 2,
    name: "attack on titan ",
    category: "printed",
    color: "White",
    price: 499,
    popularity: 92,
    createdAt: "2026-02-19",
    image: "images/aot1.jpeg",
    description: "Sharp tailored fit with wrinkle-resistant finish, ideal for office and events.",
    sizes: ["M", "L", "XL"],
    rating: 4.7
  },
  {
    id: 3,
    name: "zoro nothing happened",
    category: "printed",
    color: "Blue",
    price: 499,
    popularity: 88,
    createdAt: "2026-01-30",
    image: "images/zoro2.jpeg",
    description: "Lightweight striped cotton shirt for effortless everyday style.",
    sizes: ["S", "M", "L"],
    rating: 4.5
  },
  {
    id: 4,
    name: "Graphite Printed Shirt",
    category: "Printed",
    color: "Black",
    price: 499,
    popularity: 95,
    createdAt: "2026-02-27",
    image: "images/zoro1.jpeg",
    description: "Contemporary print with premium drape and soft-touch fabric.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9
  },
  {
    id: 5,
    name: "monkey d luffy wanted or alive",
    category: "printed",
    color: "black",
    price: 499,
    popularity: 84,
    createdAt: "2026-01-12",
    image: "images/luffy3.jpeg",
    description: "Smart utility pockets with structured yet flexible fit.",
    sizes: ["M", "L", "XL"],
    rating: 4.4
  },
  {
    id: 6,
    name: "monkey d luffy art shirt",
    category: "printed t shirt",
    color: "Black",
    price: 499,
    popularity: 90,
    createdAt: "2026-02-06",
    image: "images/luffy2.jpeg",
    description: "Minimal design language with elevated details and slim modern fit.",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6
  },
  
  {
  id: 7,
  name: "monkey D Luffy",
  category: "printed",
  color: "Black",
  price: 499,
  popularity: 100,
  createdAt: "2026-03-03",
  image: "images/luffy1.jpeg",
  description: "Premium streetwear shirt.",
  sizes: ["M", "L", "XL"],
  rating: 10.0
}
];

const CART_KEY = "urbanthreads_cart";
let discount = 0;

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("#cartCount").forEach((el) => (el.textContent = count));
}

function addToCart(productId, size = "M") {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, size, qty: 1 });
  }
  saveCart(cart);
  alert("Added to cart");
}

function productCard(product) {
  return `
    <article class="product-card">
      <a href="product.html?id=${product.id}" class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="product-info">
        <h4>${product.name}</h4>
        <p class="product-meta">${product.category} | ${product.color}</p>
        <p><strong>Rs. ${product.price}</strong></p>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn btn-ghost">View</a>
          <button class="btn btn-primary" onclick="addToCart(${product.id})">Buy Now</button>
        </div>
      </div>
    </article>`;
}

function initHome() {
  const featured = document.getElementById("featuredGrid");
  if (featured) {
    featured.innerHTML = products.slice(0, 4).map(productCard).join("");
  }

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("newsletterMessage").textContent = "Thanks for subscribing to UrbanThreads.";
      newsletterForm.reset();
    });
  }
}

function sortAndFilterProducts() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const category = document.getElementById("filterCategory").value;
  const size = document.getElementById("filterSize").value;
  const color = document.getElementById("filterColor").value;
  const maxPrice = Number(document.getElementById("filterPrice").value);
  const sortBy = document.getElementById("sortProducts").value;

  let filtered = products.filter((p) => {
    const categoryMatch = category === "All" || p.category === category;
    const sizeMatch = size === "All" || p.sizes.includes(size);
    const colorMatch = color === "All" || p.color === color;
    const priceMatch = p.price <= maxPrice;
    return categoryMatch && sizeMatch && colorMatch && priceMatch;
  });

  if (sortBy === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "high-low") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === "popular") filtered.sort((a, b) => b.popularity - a.popularity);

  grid.innerHTML = filtered.map(productCard).join("") || "<p>No products match your filters.</p>";
  document.getElementById("productCount").textContent = `${filtered.length} products`;
}

function initShop() {
  if (!document.getElementById("shopGrid")) return;

  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  if (categoryParam) {
    document.getElementById("filterCategory").value = categoryParam;
  }

  const priceInput = document.getElementById("filterPrice");
  const priceLabel = document.getElementById("priceValue");
  priceInput.addEventListener("input", () => {
    priceLabel.textContent = `Up to Rs. ${priceInput.value}`;
    sortAndFilterProducts();
  });

  ["filterCategory", "filterSize", "filterColor", "sortProducts"].forEach((id) => {
    document.getElementById(id).addEventListener("change", sortAndFilterProducts);
  });

  sortAndFilterProducts();
}

function initProductPage() {
  const wrap = document.getElementById("productDetail");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = products.find((p) => p.id === id) || products[0];

  wrap.innerHTML = `
    <div class="product-main-img" id="zoomBox">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div>
      <h1>${product.name}</h1>
      <p class="product-meta">${product.category} | ${product.color}</p>
      <p class="rating">${"★".repeat(Math.round(product.rating))} (${product.rating})</p>
      <p>${product.description}</p>
      <h3 style="margin-top:12px;">Rs. ${product.price}</h3>
      <p style="margin-top:14px; font-weight:700;">Select Size</p>
      <div class="size-options" id="sizeOptions">
        ${["S", "M", "L", "XL"].map((s) => `<button class="size-btn ${product.sizes.includes(s) ? "" : "disabled"}" data-size="${s}" ${product.sizes.includes(s) ? "" : "disabled"}>${s}</button>`).join("")}
      </div>
      <button id="addProductToCart" class="btn btn-primary">Add to Cart</button>
      <section style="margin-top:22px;">
        <h3>Ratings & Reviews</h3>
        <p>"Amazing fit and premium feel."</p>
        <p>"Stylish and worth the price."</p>
      </section>
    </div>
  `;

  let selectedSize = product.sizes[0] || "M";
  document.querySelectorAll(".size-btn:not([disabled])").forEach((btn) => {
    if (btn.dataset.size === selectedSize) btn.classList.add("active");
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  document.getElementById("addProductToCart").addEventListener("click", () => addToCart(product.id, selectedSize));
  document.getElementById("zoomBox").addEventListener("click", (e) => e.currentTarget.classList.toggle("zoom"));
}

function renderCart() {
  const cartWrap = document.getElementById("cartItems");
  if (!cartWrap) return;

  const cart = getCart();
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...item, ...product };
  }).filter((item) => item.id);

  if (!items.length) {
    cartWrap.innerHTML = "<p>Your cart is empty. <a class='text-link' href='shop.html'>Continue shopping</a></p>";
    document.getElementById("cartSubtotal").textContent = "Rs. 0";
    document.getElementById("cartTotal").textContent = "Rs. 0";
    return;
  }

  cartWrap.innerHTML = items.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div>
        <h4>${item.name}</h4>
        <p class="product-meta">Size: ${item.size}</p>
        <p>Rs. ${item.price}</p>
      </div>
      <div>
        <div class="qty-wrap">
          <button onclick="changeQty(${item.id}, '${item.size}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, '${item.size}', 1)">+</button>
        </div>
      </div>
    </article>
  `).join("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, Math.round(subtotal * (1 - discount)));
  document.getElementById("cartSubtotal").textContent = `Rs. ${subtotal}`;
  document.getElementById("cartTotal").textContent = `Rs. ${total}`;
}

function changeQty(productId, size, delta) {
  const cart = getCart();
  const item = cart.find((c) => c.id === productId && c.size === size);
  if (!item) return;
  item.qty += delta;
  const next = cart.filter((c) => c.qty > 0);
  saveCart(next);
  renderCart();
}

function initCheckout() {
  if (!document.getElementById("checkoutForm")) return;

  renderCart();

  document.getElementById("applyCoupon").addEventListener("click", () => {
    const code = document.getElementById("couponCode").value.trim().toUpperCase();
    const msg = document.getElementById("couponMessage");
    if (code === "SAVE10") {
      discount = 0.1;
      msg.textContent = "Coupon applied: 10% off";
    } else if (code === "SAVE20") {
      discount = 0.2;
      msg.textContent = "Coupon applied: 20% off";
    } else {
      discount = 0;
      msg.textContent = "Invalid coupon code";
    }
    renderCart();
  });

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!getCart().length) {
      document.getElementById("checkoutMessage").textContent = "Cart is empty.";
      return;
    }
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    renderCart();
    e.target.reset();
    document.getElementById("checkoutMessage").textContent = "Order placed successfully. Thank you for shopping with UrbanThreads.";
  });
}

function initContact() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("contactMessage").textContent = "Thanks! We will get back to you soon.";
    form.reset();
  });
}

function initMenu() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("show"));
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

initMenu();
initReveal();
initHome();
initShop();
initProductPage();
initCheckout();
initContact();
updateCartCount();
