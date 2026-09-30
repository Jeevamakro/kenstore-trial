import './style.css';

let products = [];
let cart = {};



const inputSearch = document.querySelector('#search-input');
const filterSelect = document.querySelector('#filter-by');
const totalProductCount = document.querySelector('.total-product-count');
const productList = document.querySelector('#product-list');
const detailBox = document.querySelector('#product-detail');
const contrls = document.querySelector('.filter-controls');
const cartPage = document.querySelector('#cart-page');
const checkoutPage = document.querySelector('#checkout-page');
const cartCount = document.querySelector('#cart-count');
const pageHeader =  document.querySelector('.page-header');

let searchTimer;

const savedCart = localStorage.getItem('cart');
if (savedCart) {
  cart = JSON.parse(savedCart);
  console.log(cart);
}
updateCartCount();

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  // console.log(localStorage.getItem('cart'));
}

function updateCartCount() {
  const items = Object.values(cart);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQty;
}

function addToCart(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  if (cart[id]) {
    cart[id].quantity = cart[id].quantity + 1;
  } else {
    cart[id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1
    };
  }

  saveCart();
}
let currentView = { name: 'products', id: null };
function navigate(name, id = null) {
  currentView = { name, id };
  showCorrectView();
}


// Fetching Productw Using json end points 
function fecthProducts() {
  const query = inputSearch.value.trim();
  const sort = filterSelect.value;

  let url;
  if (query) {
    url = `https://dummyjson.com/products/search?q=${query}`;
  } else {
    url = 'https://dummyjson.com/products?limit=0';
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      products = data.products;

      if (sort === 'asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'discount') {
        products.sort((a, b) => b.discountPercentage - a.discountPercentage);
      } else if (sort === 'in-stock') {
        products = products.filter(
          (p) => p.availabilityStatus === 'In Stock' || p.availabilityStatus === 'Low Stock'
        );
      }

      totalProductCount.textContent = 'Showing ' + products.length + ' Products';

      if (products.length === 0) {
        productList.textContent = '';
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = 'No results for "' + query + '"';
        productList.appendChild(li);
      } else {
        renderProducts(products);
      }

      showCorrectView();
    });
}

function renderProducts(list) {
  productList.innerHTML = list
    .map((product) => `
      <li class="product-item">
        <a href="#" data-view="product" data-id="${product.id}" class="product-link">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <h2>${product.title}</h2>
          <p>Price: $${product.price.toFixed(2)}</p>
          <p>Discount: ${product.discountPercentage}%</p>
          <p>Rating: ${product.rating}</p>
          <p>Availability: ${product.availabilityStatus}</p>
        </a>
        <button class="add-btn" data-id="${product.id}">Add to cart</button>
      </li>`)
    .join('');
}


function renderProductDetail(id) {
  const product = products.find(p => p.id == id);

  if (!product) {
    detailBox.innerHTML = `
      <p>Product not found.</p>
      <a href="#" data-view="products">Back to products</a>
    `;
    return;
  }

  detailBox.innerHTML = `
    <a href="#" data-view="products" class="back-link">← Back to products</a>
    <div class="detail-layout">
      <img src="${product.thumbnail}" alt="${product.title}" />
      <div>
        <h1>${product.title}</h1>
        <p class="category">${product.category}</p>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p>Rating: ${product.rating}</p>
        <p>Availability: ${product.availabilityStatus}</p>
        <button class="add-btn" data-id="${product.id}">Add to cart</button>
      </div>
    </div>
  `;
}



function renderCartPage() {
  const items = Object.values(cart);

  if (items.length === 0) {
    cartPage.innerHTML = `
      <a href="#" data-view="products" class="back-link">← Back to products</a>
      <h1>Your Cart</h1>
      <p>Your cart is empty.</p>
    `;
    return;
  }

  let total = 0;
  const rows = items.map((item) => {
    total = total + item.price * item.quantity;
    return `
      <li class="cart-row">
        <span class="cart-title">${item.title}</span>
        <span class="cart-price">$${item.price.toFixed(2)}</span>
        <div class="cart-qty">
          <button class="qty-btn" data-dec="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-inc="${item.id}">+</button>
        </div>
        <span class="cart-line-total">$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-btn" data-remove="${item.id}">Remove</button>
      </li>
    `;
  }).join('');

  cartPage.innerHTML = `
    <a href="#" data-view="products" class="back-link">← Back to products</a>
    <h1>Your Cart</h1>
    <ul class="cart-list">${rows}</ul>
    <div class="cart-summary">
      <p class="cart-total">Total: $${total.toFixed(2)}</p>
      <button class="clear-cart" id="clear-cart">Clear cart</button>
    </div>
    <a href="#" data-view="checkout" class="checkout-btn">Proceed to Checkout</a>
  `;
}

function renderCheckoutPage() {
  const items = Object.values(cart);

  if (items.length === 0) {
    checkoutPage.innerHTML = `
      <a href="#" data-view="products" class="back-link">← Back to products</a>
      <h1>Checkout</h1>
      <p>Your cart is empty. Add something before checking out.</p>
    `;
    return;
  }

  let total = 0;
  items.forEach((item) => { total += item.price * item.quantity; });

  checkoutPage.innerHTML = `
    <a href="#" data-view="cart" class="back-link">← Back to cart</a>
    <h1>Checkout</h1>
    <form id="checkout-form" novalidate>
      <div class="field">
        <label for="name">Full name</label>
        <input id="name" name="name" />
        <p class="error" id="name-error"></p>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" />
        <p class="error" id="email-error"></p>
      </div>
      <div class="field">
        <label for="address">Address</label>
        <input id="address" name="address" />
        <p class="error" id="address-error"></p>
      </div>
      <div class="field">
        <label for="card">Card number</label>
        <input id="card" name="card" />
        <p class="error" id="card-error"></p>
      </div>
      <p class="checkout-total">Total: $${total.toFixed(2)}</p>
      <button type="submit" class="checkout-btn">Place order</button>
    </form>
    <div id="order-success" hidden>
      <h2>Order placed!</h2>
      <p>Thanks for your order.</p>
      <a href="#" data-view="products" class="back-link">Continue shopping</a>
    </div>
  `;

  document.querySelector('#checkout-form').addEventListener('submit', orderSubmit);
}

function orderSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const card = document.getElementById('card').value.trim();
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const addressError = document.getElementById('address-error');
  const cardError = document.getElementById('card-error');

  nameError.textContent = '';
  emailError.textContent = '';
  addressError.textContent = '';
  cardError.textContent = '';

  let isValid = true;

  if (name.length < 2) {
    nameError.textContent = 'Enter your full name.';
    isValid = false;
  }

  if (!email.includes('@') || !email.includes('.')) {
    emailError.textContent = 'Enter a valid email.';
    isValid = false;
  }
  if (address.length < 5) {
    addressError.textContent = 'Enter your address.';
    isValid = false;
  }
  if (card.length < 13) {
    cardError.textContent = 'Enter a valid card number.';
    isValid = false;
  }

  if (isValid === false) {
    return;
  }
  document.getElementById('checkout-form').hidden = true;
  document.getElementById('order-success').hidden = false;
  cart = {};
  saveCart();
}


function hideAllPages() {
  pageHeader.hidden = true;
  productList.hidden = true;
  contrls.hidden = true;
  totalProductCount.hidden = true;
  detailBox.hidden = true;
  cartPage.hidden = true;
  checkoutPage.hidden = true;
}

function showCorrectView() {
  hideAllPages();

  if (currentView.name === 'cart') {
    cartPage.hidden = false;
    renderCartPage();
  } else if (currentView.name === 'checkout') {
    checkoutPage.hidden = false;
    renderCheckoutPage();
  } else if (currentView.name === 'product') {
    detailBox.hidden = false;
    renderProductDetail(currentView.id);
  } else {
    productList.hidden = false;
    contrls.hidden = false;
    totalProductCount.hidden = false;
    pageHeader.hidden = false;
  }
}


document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      navigate(link.dataset.view, link.dataset.id);
      console.log(link.dataset.view, link.dataset.id);
      return;
    }

  if (e.target.classList.contains('add-btn')) {
    const id = e.target.dataset.id;
    addToCart(id);
    cartSuccessInfo('Added to cart', e);
    return;
  }

  if (e.target.id === 'clear-cart') {
    cart = {};
    saveCart();
    renderCartPage();
    return;
  }

  if (e.target.dataset.inc) {
    cart[e.target.dataset.inc].quantity += 1;
    saveCart();
    renderCartPage();
    return;
  }

  if (e.target.dataset.dec) {
    const id = e.target.dataset.dec;
    cart[id].quantity -= 1;
    if (cart[id].quantity <= 0) {
      delete cart[id];
    }
    saveCart();
    renderCartPage();
    return;
  }

  if (e.target.dataset.remove) {
    delete cart[e.target.dataset.remove];
    saveCart();
    renderCartPage();
  }
});


function cartSuccessInfo(message, e) {
  const btn = e.target.closest('.add-btn');
  btn.classList.add('cart-success');
  btn.textContent = message;
  clearTimeout(cartSuccessInfo.timer);
  cartSuccessInfo.timer = setTimeout(() => {
    btn.textContent = 'Add to cart';
    btn.classList.remove('cart-success');
  }, 500);
}

inputSearch.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(fecthProducts, 300);
});

filterSelect.addEventListener('change', fecthProducts);

fecthProducts();