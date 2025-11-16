
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
const portfolioGrid = document.getElementById("portfolio-grid");

/* ---------------------------------------------------
   RENDER MENU ITEMS
--------------------------------------------------- */
function renderMenu(items) {
  menuGrid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("menu-card");

    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="menu-img">
      <h4>${item.name}</h4>
      <p class="price">₦${item.price}</p>

      <div class="qty-row">
        <div class="qty-buttons">
          <button class="minus">-</button>
          <span class="qty">0</span>
          <button class="plus">+</button>
        </div>
      </div>

      <button class="add-cart">Add to Cart</button>
    `;

    menuGrid.appendChild(card);

    let qty = 0;
    const qtySpan = card.querySelector(".qty");

    card.querySelector(".plus").addEventListener("click", () => {
      qty++;
      qtySpan.textContent = qty;
    });

    card.querySelector(".minus").addEventListener("click", () => {
      if (qty > 0) qty--;
      qtySpan.textContent = qty;
    });

    card.querySelector(".add-cart").addEventListener("click", () => {
      if (qty === 0) return;

      const existing = cart.find(c => c.id === item.id);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ ...item, qty });
      }

      qty = 0;
      qtySpan.textContent = 0;

      updateCart();
      showNotification("Item added to cart!");
    });
  });
}

function updateCart() {
  cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.qty} — ₦${item.price * item.qty}`;
    cartList.appendChild(li);
  });

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  totalAmount.textContent = total;
  cartCount.textContent = cart.length;
}


document.querySelectorAll(".menu-filters button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".menu-filters .active")?.classList.remove("active");
    button.classList.add("active");

    const category = button.dataset.category;
    if (category === "all") renderMenu(menuItems);
    else renderMenu(menuItems.filter(item => item.category === category));
  });
});

orderButton.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "Hello, I would like to place an order:\n\n";
  cart.forEach(item => {
    message += `${item.name} x${item.qty} = ₦${item.qty * item.price}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  message += `\nTotal: ₦${total}`;

  const whatsappURL = `https://wa.me/2348103140192?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  await db.collection("orders").add({
    order: cart,
    total,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  cart = [];
  updateCart();
  showNotification("Order sent successfully!");
});


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

const menuIcon = document.getElementById("menu-icon");
const navMenu = document.getElementById("navMenu");

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

document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("fade-in");
    navMenu.classList.add("fade-out");

    setTimeout(() => {
      navMenu.style.display = "none";
    }, 300);
  });
});


function showNotification(text) {
  const note = document.getElementById("notification");
  note.textContent = text;
  note.style.display = "block";

  setTimeout(() => {
    note.style.display = "none";
  }, 2500);
}

renderMenu(menuItems);
renderPortfolio();
updateCart();
