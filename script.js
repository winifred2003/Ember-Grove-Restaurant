
const firebaseConfig = {
  apiKey: "AIzaSyCcLPwqXrrOhqVstenezC7h8UmnFledLTU",
  authDomain: "embergroveorders.firebaseapp.com",
  projectId: "embergroveorders",
  storageBucket: "embergroveorders.firebasestorage.app",
  messagingSenderId: "264669787662",
  appId: "1:264669787662:web:112c1fe5274855cefeee5f",
  measurementId: "G-V89FKVEVB9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const menuItems = [
  { id: 1, name: "Egusi Soup", category: "soup", price: 5000, img: "images/egu.jpg" },
  { id: 2, name: "Efo Riro", category: "soup", price: 5000, img: "images/efo.jpg" },
  { id: 3, name: "Ogbono Soup", category: "soup", price: 5000, img: "images/ogbono.jpg" },
  { id: 4, name: "Jollof Rice", category: "rice", price: 6000, img: "images/jollof.jpg" },
  { id: 5, name: "Fried Rice", category: "rice", price: 6500, img: "images/fried.jpg" },
  { id: 6, name: "White Rice & Stew", category: "rice", price: 5000, img: "images/rice.jpg" },
  { id: 7, name: "Pounded Yam & Egusi", category: "soup", price: 5500, img: "images/egusi.jpg" },
  { id: 8, name: "Amala & Ewedu", category: "soup", price: 5500, img: "images/amala.jpg" },
  { id: 9, name: "Moi Moi", category: "side", price: 1500, img: "images/moi.jpg" },
  { id: 10, name: "Akara and Pap", category: "snack", price: 2500, img: "images/akara.jpg" },
  { id: 11, name: "Peppered Snails", category: "snack", price: 3000, img: "images/snail.jpg" },
  { id: 12, name: "Ofada Rice & Sauce", category: "rice", price: 3500, img: "images/ofada.jpg" },
  { id: 13, name: "Bitterleaf Soup", category: "soup", price: 5000, img: "images/leaf.jpg" },
  { id: 14, name: "Ogbono & Fufu", category: "soup", price: 5500, img: "images/ogb.jpg" },
  { id: 15, name: "Spicy Chicken", category: "side", price: 4000, img: "images/chick.jpg" },
  { id: 16, name: "Suya", category: "snack", price: 2200, img: "images/suya.jpg" },
  { id: 17, name: "Chin-Chin", category: "snack", price: 1500, img: "images/chin.jpg" },
  { id: 18, name: "Yam Porridge", category: "side", price: 2700, img: "images/yam.jpg" },
  { id: 19, name: "Okra Soup", category: "soup", price: 4300, img: "images/okra.jpg" },
  { id: 20, name: "Plantain Chips", category: "snack", price: 1800, img: "images/chips.jpg" }
];

let cart = [];

const menuGrid = document.getElementById("menu-grid");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const totalAmount = document.getElementById("totalAmount");
const orderButton = document.getElementById("orderButton");


function renderMenu(items) {
  menuGrid.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("menu-card");
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="menu-img">
      <h4>${item.name}</h4>
      <p>₦${item.price}</p>
      <div class="qty-buttons">
        <button class="minus">-</button>
        <span class="qty">0</span>
        <button class="plus">+</button>
      </div>
      <button class="add-cart">Add to Cart</button>
    `;
    menuGrid.appendChild(card);

    let qty = 0; 
    const qtySpan = card.querySelector(".qty");
    qtySpan.textContent = qty;

    card.querySelector(".plus").addEventListener("click", () => {
      qty++;
      qtySpan.textContent = qty;
    });
    card.querySelector(".minus").addEventListener("click", () => {
      if(qty > 0) qty--;
      qtySpan.textContent = qty;
    });

    card.querySelector(".add-cart").addEventListener("click", () => {
      if(qty === 0) return; 
      const existing = cart.find(c => c.id === item.id);
      if(existing) {
        existing.qty += qty;
      } else {
        cart.push({ ...item, qty });
      }
      updateCart();
      qty = 0; 
      qtySpan.textContent = qty;
    });
  });
}

function updateCart() {
  cartList.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.qty} = ₦${item.price*item.qty}`;
    cartList.appendChild(li);
  });
  const total = cart.reduce((acc, item) => acc + item.price*item.qty, 0);
  totalAmount.textContent = total;
  cartCount.textContent = cart.length;
}

const filterButtons = document.querySelectorAll(".menu-filters button");
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    if(category === "all") renderMenu(menuItems);
    else renderMenu(menuItems.filter(i => i.category === category));
  });
});

orderButton.addEventListener("click", () => {
    if(cart.length === 0) return alert("Your cart is empty!");

    let message = "Hello, I would like to place this order:\n";
    cart.forEach(item => {
        message += `${item.name} x${item.qty} = ₦${item.price*item.qty}\n`;
    });
    message += `Total: ₦${cart.reduce((acc,item)=>acc+item.price*item.qty,0)}`;

    const whatsappURL = `https://wa.me/2348103140192?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");

    db.collection("orders").add({
        order: cart,
        total: cart.reduce((acc,item)=>acc+item.price*item.qty,0),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    cart = [];
    updateCart();

    const notification = document.getElementById("notification");
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
});

const portfolioGrid = document.getElementById("portfolio-grid");
function renderPortfolio() {
  menuItems.forEach(item => {
    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;
    img.classList.add("portfolio-img");
    portfolioGrid.appendChild(img);

    img.addEventListener("click", () => {
      const lightbox = document.getElementById("lightbox");
      lightbox.style.display = "flex";
      lightbox.querySelector(".lightbox-img").src = item.img;
      lightbox.querySelector(".lightbox-caption").textContent = item.name;
    });
  });
}

document.querySelector(".lightbox .close").addEventListener("click", () => {
  document.getElementById("lightbox").style.display = "none";
});

renderMenu(menuItems);
renderPortfolio();
updateCart();
// === NAV MENU TOGGLE WITH FADE EFFECT ===
const menuIcon = document.getElementById("menu-icon");
const navMenu = document.getElementById("navMenu");

// hide by default
navMenu.style.display = "none";

menuIcon.addEventListener("click", () => {
  if (navMenu.style.display === "none") {
    navMenu.style.display = "block";
    navMenu.classList.remove("fade-out");
    navMenu.classList.add("fade-in");
  } else {
    navMenu.classList.remove("fade-in");
    navMenu.classList.add("fade-out");

    setTimeout(() => {
      navMenu.style.display = "none";
    }, 300);
  }
});

// === FADE OUT AFTER LINK CLICK ===
document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("fade-in");
    navMenu.classList.add("fade-out");

    setTimeout(() => {
      navMenu.style.display = "none";
    }, 300);
  });
});

