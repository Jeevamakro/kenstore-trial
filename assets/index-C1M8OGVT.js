(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t={},n=document.querySelector(`#search-input`),r=document.querySelector(`#filter-by`),i=document.querySelector(`.total-product-count`),a=document.querySelector(`#product-list`),o=document.querySelector(`#product-detail`),s=document.querySelector(`.filter-controls`),c=document.querySelector(`#cart-page`),l=document.querySelector(`#checkout-page`),u=document.querySelector(`#cart-count`),d=document.querySelector(`.page-header`),f,p=localStorage.getItem(`cart`);p&&(t=JSON.parse(p),console.log(t)),h();function m(){localStorage.setItem(`cart`,JSON.stringify(t)),h()}function h(){u.textContent=Object.values(t).reduce((e,t)=>e+t.quantity,0)}function g(n){let r=e.find(e=>e.id==n);r&&(t[n]?t[n].quantity=t[n].quantity+1:t[n]={id:r.id,title:r.title,price:r.price,quantity:1},m())}var _={name:`products`,id:null};function v(e,t=null){_={name:e,id:t},E()}function y(){let t=n.value.trim(),o=r.value,s;s=t?`https://dummyjson.com/products/search?q=${t}`:`https://dummyjson.com/products?limit=0`,fetch(s).then(e=>e.json()).then(n=>{if(e=n.products,o===`asc`?e.sort((e,t)=>e.price-t.price):o===`desc`?e.sort((e,t)=>t.price-e.price):o===`rating`?e.sort((e,t)=>t.rating-e.rating):o===`discount`?e.sort((e,t)=>t.discountPercentage-e.discountPercentage):o===`in-stock`&&(e=e.filter(e=>e.availabilityStatus===`In Stock`||e.availabilityStatus===`Low Stock`)),i.textContent=`Showing `+e.length+` Products`,e.length===0){a.textContent=``;let e=document.createElement(`li`);e.className=`empty`,e.textContent=`No results for "`+t+`"`,a.appendChild(e)}else b(e);E()})}function b(e){a.innerHTML=e.map(e=>`
      <li class="product-item">
        <a href="#" data-view="product" data-id="${e.id}" class="product-link">
          <img src="${e.thumbnail}" alt="${e.title}" />
          <h2>${e.title}</h2>
          <p>Price: $${e.price.toFixed(2)}</p>
          <p>Discount: ${e.discountPercentage}%</p>
          <p>Rating: ${e.rating}</p>
          <p>Availability: ${e.availabilityStatus}</p>
        </a>
        <button class="add-btn" data-id="${e.id}">Add to cart</button>
      </li>`).join(``)}function x(t){let n=e.find(e=>e.id==t);if(!n){o.innerHTML=`
      <p>Product not found.</p>
      <a href="#" data-view="products">Back to products</a>
    `;return}o.innerHTML=`
    <a href="#" data-view="products" class="back-link">← Back to products</a>
    <div class="detail-layout">
      <img src="${n.thumbnail}" alt="${n.title}" />
      <div>
        <h1>${n.title}</h1>
        <p class="category">${n.category}</p>
        <p>${n.description}</p>
        <p class="price">$${n.price.toFixed(2)}</p>
        <p>Rating: ${n.rating}</p>
        <p>Availability: ${n.availabilityStatus}</p>
        <button class="add-btn" data-id="${n.id}">Add to cart</button>
      </div>
    </div>
  `}function S(){let e=Object.values(t);if(e.length===0){c.innerHTML=`
      <a href="#" data-view="products" class="back-link">← Back to products</a>
      <h1>Your Cart</h1>
      <p>Your cart is empty.</p>
    `;return}let n=0;c.innerHTML=`
    <a href="#" data-view="products" class="back-link">← Back to products</a>
    <h1>Your Cart</h1>
    <ul class="cart-list">${e.map(e=>(n+=e.price*e.quantity,`
      <li class="cart-row">
        <span class="cart-title">${e.title}</span>
        <span class="cart-price">$${e.price.toFixed(2)}</span>
        <div class="cart-qty">
          <button class="qty-btn" data-dec="${e.id}">−</button>
          <span>${e.quantity}</span>
          <button class="qty-btn" data-inc="${e.id}">+</button>
        </div>
        <span class="cart-line-total">$${(e.price*e.quantity).toFixed(2)}</span>
        <button class="remove-btn" data-remove="${e.id}">Remove</button>
      </li>
    `)).join(``)}</ul>
    <div class="cart-summary">
      <p class="cart-total">Total: $${n.toFixed(2)}</p>
      <button class="clear-cart" id="clear-cart">Clear cart</button>
    </div>
    <a href="#" data-view="checkout" class="checkout-btn">Proceed to Checkout</a>
  `}function C(){let e=Object.values(t);if(e.length===0){l.innerHTML=`
      <a href="#" data-view="products" class="back-link">← Back to products</a>
      <h1>Checkout</h1>
      <p>Your cart is empty. Add something before checking out.</p>
    `;return}let n=0;e.forEach(e=>{n+=e.price*e.quantity}),l.innerHTML=`
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
      <p class="checkout-total">Total: $${n.toFixed(2)}</p>
      <button type="submit" class="checkout-btn">Place order</button>
    </form>
    <div id="order-success" hidden>
      <h2>Order placed!</h2>
      <p>Thanks for your order.</p>
      <a href="#" data-view="products" class="back-link">Continue shopping</a>
    </div>
  `,document.querySelector(`#checkout-form`).addEventListener(`submit`,w)}function w(e){e.preventDefault();let n=document.getElementById(`name`).value.trim(),r=document.getElementById(`email`).value.trim(),i=document.getElementById(`address`).value.trim(),a=document.getElementById(`card`).value.trim(),o=document.getElementById(`name-error`),s=document.getElementById(`email-error`),c=document.getElementById(`address-error`),l=document.getElementById(`card-error`);o.textContent=``,s.textContent=``,c.textContent=``,l.textContent=``;let u=!0;n.length<2&&(o.textContent=`Enter your full name.`,u=!1),(!r.includes(`@`)||!r.includes(`.`))&&(s.textContent=`Enter a valid email.`,u=!1),i.length<5&&(c.textContent=`Enter your address.`,u=!1),a.length<13&&(l.textContent=`Enter a valid card number.`,u=!1),u!==!1&&(document.getElementById(`checkout-form`).hidden=!0,document.getElementById(`order-success`).hidden=!1,t={},m())}function T(){d.hidden=!0,a.hidden=!0,s.hidden=!0,i.hidden=!0,o.hidden=!0,c.hidden=!0,l.hidden=!0}function E(){T(),_.name===`cart`?(c.hidden=!1,S()):_.name===`checkout`?(l.hidden=!1,C()):_.name===`product`?(o.hidden=!1,x(_.id)):(a.hidden=!1,s.hidden=!1,i.hidden=!1,d.hidden=!1)}document.addEventListener(`click`,function(e){let n=e.target.closest(`a`);if(n){e.preventDefault(),v(n.dataset.view,n.dataset.id),console.log(n.dataset.view,n.dataset.id);return}if(e.target.classList.contains(`add-btn`)){let t=e.target.dataset.id;g(t),D(`Added to cart`,e);return}if(e.target.id===`clear-cart`){t={},m(),S();return}if(e.target.dataset.inc){t[e.target.dataset.inc].quantity+=1,m(),S();return}if(e.target.dataset.dec){let n=e.target.dataset.dec;--t[n].quantity,t[n].quantity<=0&&delete t[n],m(),S();return}e.target.dataset.remove&&(delete t[e.target.dataset.remove],m(),S())});function D(e,t){let n=t.target.closest(`.add-btn`);n.classList.add(`cart-success`),n.textContent=e,clearTimeout(D.timer),D.timer=setTimeout(()=>{n.textContent=`Add to cart`,n.classList.remove(`cart-success`)},500)}n.addEventListener(`input`,()=>{clearTimeout(f),f=setTimeout(y,300)}),r.addEventListener(`change`,y),y();