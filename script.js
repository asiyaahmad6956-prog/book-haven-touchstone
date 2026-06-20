
const CART_KEY = "bookHavenCart";
const CONTACT_KEY = "bookHavenContactRequests";
const FEEDBACK_KEY = "bookHavenReaderFeedback";
const SUBSCRIBER_KEY = "bookHavenSubscriber";

function cleanInput(value) {
  return String(value || "").trim().replace(/[<>]/g, "");
}
function getCart() {
  try { return JSON.parse(sessionStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function setCart(items) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}
function getStoredList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function setStoredList(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupNavigation() {
  const current = document.body.dataset.page;
  document.querySelectorAll(".main-nav a").forEach(link => {
    if (link.getAttribute("href").includes(current) || (current === "home" && link.getAttribute("href") === "index.html")) {
      link.classList.add("active");
    }
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

function setupSubscribe() {
  const form = document.querySelector("#subscribeForm");
  const msg = document.querySelector("#subscribeMessage");
  if (!form || !msg) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = cleanInput(document.querySelector("#subscribeEmail").value);
    if (!validEmail(email)) {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "#9b2226";
      return;
    }
    localStorage.setItem(SUBSCRIBER_KEY, email);
    msg.style.color = "#2f5d50";
    msg.textContent = "Thank you for joining the Book Haven reading list.";
    form.reset();
  });
}

function setupCart() {
  document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
      const item = {
        title: cleanInput(button.dataset.title),
        price: cleanInput(button.dataset.price),
        addedAt: new Date().toLocaleString()
      };
      const cart = getCart();
      cart.push(item);
      setCart(cart);
      button.textContent = "Added";
      setTimeout(() => (button.textContent = "Add to Cart"), 900);
    });
  });
  const viewBtn = document.querySelector("#viewCartBtn");
  const closeBtn = document.querySelector("#closeCartBtn");
  const clearBtn = document.querySelector("#clearCartBtn");
  const processBtn = document.querySelector("#processOrderBtn");
  if (viewBtn) viewBtn.addEventListener("click", showCart);
  if (closeBtn) closeBtn.addEventListener("click", hideCart);
  if (clearBtn) clearBtn.addEventListener("click", () => {
    sessionStorage.removeItem(CART_KEY);
    showCart();
  });
  if (processBtn) processBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert("Thank you. Your pickup list has been processed for this demo.");
    sessionStorage.removeItem(CART_KEY);
    showCart();
  });
}
function showCart() {
  const modal = document.querySelector("#cartModal");
  const list = document.querySelector("#cartList");
  const empty = document.querySelector("#cartEmpty");
  if (!modal || !list || !empty) return;
  const cart = getCart();
  list.innerHTML = "";
  if (cart.length === 0) {
    empty.textContent = "Your cart is empty.";
  } else {
    empty.textContent = `${cart.length} item(s) saved in sessionStorage.`;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.title} - ${item.price}`;
      list.appendChild(li);
    });
  }
  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");
}
function hideCart() {
  const modal = document.querySelector("#cartModal");
  if (modal) {
    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
  }
}

function setupRequestForm() {
  const form = document.querySelector("#requestForm");
  const msg = document.querySelector("#requestMessage");
  if (!form || !msg) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = cleanInput(document.querySelector("#customerName").value);
    const email = cleanInput(document.querySelector("#customerEmail").value);
    const details = cleanInput(document.querySelector("#requestDetails").value);
    if (!name || !validEmail(email) || !details) {
      msg.textContent = "Please enter your name, a valid email, and a message.";
      msg.style.color = "#9b2226";
      return;
    }
    const request = {
      name,
      email,
      phone: cleanInput(document.querySelector("#phone").value),
      type: cleanInput(document.querySelector("#requestType").value),
      customOrder: document.querySelector("#customOrder").checked,
      details,
      submittedAt: new Date().toLocaleString()
    };
    const requests = getStoredList(CONTACT_KEY);
    requests.push(request);
    setStoredList(CONTACT_KEY, requests);
    msg.style.color = "#2f5d50";
    msg.textContent = `Thank you, ${name}. Your request was saved locally for this demo.`;
    form.reset();
  });
}

function setupFeedbackForm() {
  const form = document.querySelector("#feedbackForm");
  const msg = document.querySelector("#feedbackMessage");
  if (!form || !msg) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = cleanInput(document.querySelector("#feedbackName").value);
    const text = cleanInput(document.querySelector("#feedbackText").value);
    if (!name || !text) {
      msg.textContent = "Please enter your name and feedback.";
      msg.style.color = "#9b2226";
      return;
    }
    const feedback = {
      name,
      favoriteGenre: cleanInput(document.querySelector("#favoriteGenre").value),
      text,
      submittedAt: new Date().toLocaleString()
    };
    const feedbackList = getStoredList(FEEDBACK_KEY);
    feedbackList.push(feedback);
    setStoredList(FEEDBACK_KEY, feedbackList);
    msg.style.color = "#2f5d50";
    msg.textContent = "Feedback saved in localStorage for this demo.";
    form.reset();
  });
}

function runDemoStates() {
  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo");
  if (demo === "subscribe") {
    localStorage.setItem(SUBSCRIBER_KEY, "reader@example.com");
    const msg = document.querySelector("#subscribeMessage");
    if (msg) msg.textContent = "Demo: subscriber email saved in localStorage.";
  }
  if (demo === "cart") {
    setCart([
      { title: "Quiet Moon", price: "$18.00", addedAt: "Demo" },
      { title: "Journal Set", price: "$12.00", addedAt: "Demo" }
    ]);
    setTimeout(showCart, 500);
  }
  if (demo === "contact") {
    const msg = document.querySelector("#requestMessage");
    setStoredList(CONTACT_KEY, [{ name: "Demo Reader", email: "reader@example.com", type: "Special book order", submittedAt: "Demo" }]);
    if (msg) msg.textContent = "Demo: contact/custom order request saved in localStorage.";
  }
  if (demo === "feedback") {
    const msg = document.querySelector("#feedbackMessage");
    setStoredList(FEEDBACK_KEY, [{ name: "Demo Reader", favoriteGenre: "Mystery", text: "Host a mystery night.", submittedAt: "Demo" }]);
    if (msg) msg.textContent = "Demo: customer feedback saved in localStorage.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSubscribe();
  setupCart();
  setupRequestForm();
  setupFeedbackForm();
  runDemoStates();
});
