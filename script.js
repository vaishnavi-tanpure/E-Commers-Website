const STORAGE_KEYS = {
  cart: 'lumacart_cart',
  wishlist: 'lumacart_wishlist',
};

const products = [
  {
    product_id: 'p-101',
    name: 'Orbit Runner',
    category: 'fashion',
    price: 189,
    original_price: 249,
    discount: 24,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight everyday sneakers engineered for comfort, speed, and modern style.',
  },
  {
    product_id: 'p-102',
    name: 'Noir Accent Lamp',
    category: 'home',
    price: 84,
    original_price: 119,
    discount: 29,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'A sculptural lighting piece that brings warm ambient glow to bedrooms and lounges.',
  },
  {
    product_id: 'p-103',
    name: 'Halo Earbuds',
    category: 'tech',
    price: 139,
    original_price: 199,
    discount: 30,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    description: 'Immersive wireless audio with crisp sound, deep bass, and all-day battery life.',
  },
  {
    product_id: 'p-104',
    name: 'Pure Drift Bottle',
    category: 'wellness',
    price: 36,
    original_price: 49,
    discount: 27,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'A sleek insulated bottle for hydration rituals, gym days, and daily commuting.',
  },
  {
    product_id: 'p-105',
    name: 'Veloura Trench',
    category: 'fashion',
    price: 220,
    original_price: 310,
    discount: 29,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    description: 'A tailored outer layer designed for polished layering across all seasons.',
  },
  {
    product_id: 'p-106',
    name: 'Aster Smart Watch',
    category: 'tech',
    price: 249,
    original_price: 329,
    discount: 24,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    description: 'A premium hybrid smartwatch with wellness tracking, notifications, and daily insight.',
  },
  {
    product_id: 'p-107',
    name: 'Luna Throw',
    category: 'home',
    price: 72,
    original_price: 99,
    discount: 27,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    description: 'A soft woven throw in elevated neutrals designed for cozy, refined interiors.',
  },
  {
    product_id: 'p-108',
    name: 'Bloom Yoga Mat',
    category: 'wellness',
    price: 58,
    original_price: 78,
    discount: 26,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    description: 'A premium grip mat with extra cushioning for balance, recovery, and movement.',
  },
];

const state = {
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  cart: loadFromStorage(STORAGE_KEYS.cart, []),
  wishlist: loadFromStorage(STORAGE_KEYS.wishlist, []),
};

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');
const cartDrawer = document.getElementById('cartDrawer');
const headerSearch = document.getElementById('headerSearch');
const shopSearch = document.getElementById('shopSearch');
const categoryButtons = document.querySelectorAll('.filter-tab');
const sortSelect = document.getElementById('sortSelect');
const toast = document.getElementById('toast');

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage issues in restricted environments.
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function getProductById(productId) {
  return products.find((product) => product.product_id === productId);
}

function getCartQuantity(productId) {
  const item = state.cart.find((entry) => entry.product_id === productId);
  return item ? item.quantity : 0;
}

function getCartTotal() {
  return state.cart.reduce((total, item) => {
    const product = getProductById(item.product_id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function getCartItemCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCounters() {
  cartCount.textContent = String(getCartItemCount());
  wishlistCount.textContent = String(state.wishlist.length);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function getFilteredProducts() {
  const query = state.searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory = state.selectedCategory === 'all' || product.category === state.selectedCategory;
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  const sorted = [...filtered];

  switch (state.sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      sorted.sort((a, b) => b.discount - a.discount);
      break;
    default:
      break;
  }

  return sorted;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>
          <h3>No products match your search</h3>
          <p>Try a different category or keyword.</p>
        </div>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map((product) => {
      const inWishlist = state.wishlist.includes(product.product_id);
      const productPrice = formatCurrency(product.price);
      const originalPrice = formatCurrency(product.original_price);

      return `
        <article class="product-card" data-product-id="${product.product_id}">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" />
            <button
              class="wishlist-btn ${inWishlist ? 'is-active' : ''}"
              type="button"
              data-wishlist-id="${product.product_id}"
              aria-label="Toggle wishlist for ${product.name}"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 016.5 4c1.74 0 3.41.81 4.5 2.09A6.14 6.14 0 0115.5 4 4.5 4.5 0 0120 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35z"/>
              </svg>
            </button>
            <span class="product-badge">-${product.discount}%</span>
          </div>

          <div class="product-content">
            <div class="product-meta">
              <span>${product.category}</span>
              <span class="rating">★ ${product.rating}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>

            <div class="price-row">
              <span class="product-price">${productPrice}</span>
              <span class="product-old-price">${originalPrice}</span>
            </div>

            <div class="card-actions">
              <button class="btn btn-primary add-to-cart" type="button" data-product-id="${product.product_id}">
                Add to cart
              </button>
              <button class="btn btn-ghost quick-view" type="button" data-product-id="${product.product_id}">
                Quick view
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>Your cart is empty</h3>
          <p>Add a few favorites to get started.</p>
        </div>
      </div>
    `;
    cartSubtotal.textContent = formatCurrency(0);
    updateCounters();
    return;
  }

  cartItems.innerHTML = state.cart
    .map((item) => {
      const product = getProductById(item.product_id);
      if (!product) {
        return '';
      }

      return `
        <div class="cart-item" data-product-id="${product.product_id}">
          <img src="${product.image}" alt="${product.name}" />
          <div class="cart-detail">
            <h3>${product.name}</h3>
            <div class="cart-price">${formatCurrency(product.price)}</div>
            <div class="cart-controls">
              <div class="qty-toggle">
                <button class="qty-button" type="button" data-action="decrease" data-product-id="${product.product_id}" aria-label="Decrease quantity">−</button>
                <span>${item.quantity}</span>
                <button class="qty-button" type="button" data-action="increase" data-product-id="${product.product_id}" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove-item" type="button" data-action="remove" data-product-id="${product.product_id}">Remove</button>
            </div>
          </div>
          <div class="cart-line-total">${formatCurrency(product.price * item.quantity)}</div>
        </div>
      `;
    })
    .join('');

  cartSubtotal.textContent = formatCurrency(getCartTotal());
  updateCounters();
}

function addToCart(productId) {
  const existingItem = state.cart.find((item) => item.product_id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ product_id: productId, quantity: 1 });
  }

  saveToStorage(STORAGE_KEYS.cart, state.cart);
  renderCart();
  openCart();
  showToast('Added to cart');
}

function adjustCartQuantity(productId, delta) {
  const item = state.cart.find((entry) => entry.product_id === productId);
  if (!item) {
    return;
  }

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.product_id !== productId);
  }

  saveToStorage(STORAGE_KEYS.cart, state.cart);
  renderCart();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter((item) => item.product_id !== productId);
  saveToStorage(STORAGE_KEYS.cart, state.cart);
  renderCart();
  showToast('Removed from cart');
}

function toggleWishlist(productId) {
  const exists = state.wishlist.includes(productId);

  if (exists) {
    state.wishlist = state.wishlist.filter((id) => id !== productId);
    showToast('Removed from wishlist');
  } else {
    state.wishlist.push(productId);
    showToast('Added to wishlist');
  }

  saveToStorage(STORAGE_KEYS.wishlist, state.wishlist);
  renderProducts();
  updateCounters();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function syncSearchInputs(value) {
  state.searchQuery = value;
  headerSearch.value = value;
  shopSearch.value = value;
  renderProducts();
}

function bindEvents() {
  headerSearch.addEventListener('input', (event) => {
    syncSearchInputs(event.target.value);
  });

  shopSearch.addEventListener('input', (event) => {
    syncSearchInputs(event.target.value);
  });

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedCategory = button.dataset.category;
      categoryButtons.forEach((filterButton) => {
        filterButton.classList.toggle('active', filterButton === button);
      });
      renderProducts();
    });
  });

  sortSelect.addEventListener('change', (event) => {
    state.sortBy = event.target.value;
    renderProducts();
  });

  document.getElementById('cartButton').addEventListener('click', openCart);
  document.getElementById('closeCart').addEventListener('click', closeCart);

  document.getElementById('wishlistButton').addEventListener('click', () => {
    const favorites = state.wishlist.length ? state.wishlist : [];
    showToast(favorites.length ? `Wishlist: ${favorites.length} saved` : 'Wishlist is empty');
  });

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.add-to-cart');
    const quickViewButton = event.target.closest('.quick-view');
    const wishlistButton = event.target.closest('.wishlist-btn');

    if (button) {
      addToCart(button.dataset.productId);
      return;
    }

    if (quickViewButton) {
      const product = getProductById(quickViewButton.dataset.productId);
      if (product) {
        showToast(`${product.name} — ${formatCurrency(product.price)}`);
      }
      return;
    }

    if (wishlistButton) {
      toggleWishlist(wishlistButton.dataset.wishlistId);
    }
  });

  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) {
      return;
    }

    const productId = button.dataset.productId;
    const action = button.dataset.action;

    if (action === 'increase') {
      adjustCartQuantity(productId, 1);
      return;
    }

    if (action === 'decrease') {
      adjustCartQuantity(productId, -1);
      return;
    }

    if (action === 'remove') {
      removeCartItem(productId);
    }
  });

  document.querySelector('.newsletter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = event.currentTarget.querySelector('input');
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address');
      emailInput.focus();
      return;
    }

    emailInput.value = '';
    showToast('Thanks for subscribing!');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cartDrawer.classList.contains('open')) {
      closeCart();
    }
  });
}

function init() {
  bindEvents();
  renderProducts();
  renderCart();
  updateCounters();
  sortSelect.value = state.sortBy;
}

init();
