const products = [
  { image: "images/image-product-1.jpg", alt: "A pair of white and orange sneakers, front view" },
  { image: "images/image-product-2.jpg", alt: "A pair of white and orange sneakers, side view" },
  { image: "images/image-product-3.jpg", alt: "A pair of white and orange sneakers, alternate view" },
  { image: "images/image-product-4.jpg", alt: "A pair of white and orange sneakers, top view" }
];

const state = { imageIndex: 0, quantity: 0, cartQuantity: 0, cartOpen: false, quickViewOpen: false, checkoutOpen: false };
const price = 9375;
const formatPrice = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const heroImage = $("[data-hero-image]");
const lightboxImage = $("[data-lightbox-image]");
const quantityOutput = $("[data-quantity]");
const cartPanel = $("[data-cart-panel]");
const cartContent = $("[data-cart-content]");
const cartBadge = $("[data-cart-count]");
const overlay = $("[data-overlay]");
const menuPanel = $("[data-menu-panel]");
const menuOpen = $("[data-menu-open]");
const lightbox = $("[data-lightbox]");
const quickView = $("[data-quick-view]");
const quickViewImage = $("[data-quick-view-image]");
const checkoutModal = $("[data-checkout-modal]");
const checkoutOrder = $("[data-checkout-order]");
const checkoutForm = $("[data-checkout-form]");
const checkoutSuccess = $("[data-checkout-success]");
const differentAddressToggle = $("[data-different-address]");
const altAddressField = $("[data-alt-address-field]");
const altAddressInput = $("[data-alt-address]");
const repeatOrderDifferentAddressToggle = $("[data-order-again-different-address]");
const repeatOrderAddressField = $("[data-order-again-address-field]");
const repeatOrderAddressInput = $("[data-order-again-address]");
let lastFocusedElement;

function updateDifferentAddressState() {
  const isDifferentAddress = differentAddressToggle.checked;
  altAddressField.hidden = !isDifferentAddress;
  if (!isDifferentAddress) altAddressInput.value = "";
}

function updateRepeatOrderState() {
  const isRepeatDifferentAddress = repeatOrderDifferentAddressToggle.checked;
  repeatOrderAddressField.hidden = !isRepeatDifferentAddress;
  if (!isRepeatDifferentAddress) repeatOrderAddressInput.value = "";
}

function setImage(index) {
  state.imageIndex = (index + products.length) % products.length;
  const product = products[state.imageIndex];
  heroImage.src = product.image;
  heroImage.alt = product.alt;
  lightboxImage.src = product.image;
  lightboxImage.alt = product.alt;
  quickViewImage.src = product.image;
  quickViewImage.alt = product.alt;
  $$('[data-image-index]').forEach((thumbnail) => {
    const active = Number(thumbnail.dataset.imageIndex) === state.imageIndex;
    thumbnail.classList.toggle("active", active);
    thumbnail.setAttribute("aria-pressed", String(active));
  });
  $$('[data-lightbox-index]').forEach((thumbnail) => {
    const active = Number(thumbnail.dataset.lightboxIndex) === state.imageIndex;
    thumbnail.classList.toggle("active", active);
    thumbnail.setAttribute("aria-pressed", String(active));
  });
}

function updateQuantity(amount) {
  state.quantity = Math.max(0, state.quantity + amount);
  quantityOutput.value = state.quantity;
  quantityOutput.textContent = state.quantity;
}

function renderCart() {
  cartBadge.hidden = state.cartQuantity === 0;
  cartBadge.textContent = state.cartQuantity;
  if (state.cartQuantity === 0) {
    cartContent.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    return;
  }
  const total = price * state.cartQuantity;
  renderCheckoutOrder(total);
  cartContent.innerHTML = `
    <div class="cart-item">
      <img class="cart-item-thumb" src="images/image-product-1-thumbnail.jpg" alt="Fall Limited Edition Sneakers">
      <p class="cart-item-details">Fall Limited Edition Sneakers<br>${formatPrice(price)} × ${state.cartQuantity} <strong class="cart-item-total">${formatPrice(total)}</strong></p>
      <button class="remove-button" type="button" aria-label="Remove item from cart" data-remove-cart><img src="images/icon-delete.svg" alt=""></button>
    </div>
    <button class="checkout-button" type="button">Checkout</button>`;
}

function renderCheckoutOrder(total = price * state.cartQuantity) {
  checkoutOrder.innerHTML = `<span>${state.cartQuantity} pair${state.cartQuantity === 1 ? "" : "s"} of sneakers</span><strong>${formatPrice(total)}</strong>`;
}

function setCartOpen(open) {
  state.cartOpen = open;
  cartPanel.hidden = !open;
  $("[data-cart-toggle]").setAttribute("aria-expanded", String(open));
}

function setMenuOpen(open) {
  menuPanel.classList.toggle("is-open", open);
  menuOpen.setAttribute("aria-expanded", String(open));
  overlay.hidden = !open;
  if (open) $("[data-menu-close]").focus();
}

function setLightboxOpen(open) {
  lightbox.hidden = !open;
  if (open) {
    lastFocusedElement = document.activeElement;
    $("[data-lightbox-close]").focus();
  } else if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function setQuickViewOpen(open) {
  state.quickViewOpen = open;
  quickView.hidden = !open;
  if (open) {
    lastFocusedElement = document.activeElement;
    $("[data-quick-view-close]").focus();
  } else if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function setCheckoutOpen(open) {
  state.checkoutOpen = open;
  checkoutModal.hidden = !open;
  if (open) {
    renderCheckoutOrder();
    lastFocusedElement = document.activeElement;
    $("[data-checkout-close]").focus();
  } else if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function trapFocus(event, container) {
  if (event.key !== "Tab") return;
  const focusable = $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', container).filter((element) => !element.hidden);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

$$('[data-image-index]').forEach((thumbnail) => thumbnail.addEventListener("click", () => setImage(Number(thumbnail.dataset.imageIndex))));
$$('[data-lightbox-index]').forEach((thumbnail) => thumbnail.addEventListener("click", () => setImage(Number(thumbnail.dataset.lightboxIndex))));
$$('[data-gallery-prev], [data-lightbox-prev]').forEach((button) => button.addEventListener("click", () => setImage(state.imageIndex - 1)));
$$('[data-gallery-next], [data-lightbox-next]').forEach((button) => button.addEventListener("click", () => setImage(state.imageIndex + 1)));
$("[data-lightbox-open]").addEventListener("click", () => setLightboxOpen(true));
$("[data-lightbox-close]").addEventListener("click", () => setLightboxOpen(false));
$("[data-quick-view-open]").addEventListener("click", () => setQuickViewOpen(true));
$("[data-quick-view-close]").addEventListener("click", () => setQuickViewOpen(false));
$("[data-quick-view-add]").addEventListener("click", () => {
  state.cartQuantity += 1;
  renderCart();
  setQuickViewOpen(false);
  setCartOpen(true);
});
$("[data-quantity-decrease]").addEventListener("click", () => updateQuantity(-1));
$("[data-quantity-increase]").addEventListener("click", () => updateQuantity(1));
$("[data-add-to-cart]").addEventListener("click", () => {
  if (state.quantity > 0) {
    state.cartQuantity += state.quantity;
    state.quantity = 0;
    quantityOutput.value = 0;
    quantityOutput.textContent = 0;
    renderCart();
    setCartOpen(true);
  }
});
$("[data-cart-toggle]").addEventListener("click", () => setCartOpen(!state.cartOpen));
$("[data-remove-cart]")?.addEventListener("click", () => { state.cartQuantity = 0; renderCart(); });
$("[data-menu-open]").addEventListener("click", () => setMenuOpen(true));
$("[data-menu-close]").addEventListener("click", () => setMenuOpen(false));
overlay.addEventListener("click", () => setMenuOpen(false));
menuPanel.addEventListener("click", (event) => { if (event.target.matches(".nav-link")) setMenuOpen(false); });
cartContent.addEventListener("click", (event) => {
  if (event.target.closest("[data-remove-cart]")) {
    state.cartQuantity = 0;
    renderCart();
  }
  if (event.target.closest(".checkout-button")) setCheckoutOpen(true);
});
$("[data-checkout-close]").addEventListener("click", () => setCheckoutOpen(false));
$('[data-checkout-done]').addEventListener("click", () => {
  const repeatOrderWithDifferentAddress = repeatOrderDifferentAddressToggle.checked;
  checkoutForm.reset();
  differentAddressToggle.checked = repeatOrderWithDifferentAddress;
  updateDifferentAddressState();
  repeatOrderDifferentAddressToggle.checked = false;
  updateRepeatOrderState();
  checkoutSuccess.hidden = true;
  checkoutForm.hidden = false;

  if (!repeatOrderWithDifferentAddress) {
    setCheckoutOpen(false);
    return;
  }

  altAddressField.hidden = false;
  altAddressInput.value = repeatOrderAddressInput.value || "";
  differentAddressToggle.checked = true;
  updateDifferentAddressState();
  checkoutForm.scrollIntoView({ behavior: "smooth", block: "start" });
});
differentAddressToggle.addEventListener("change", updateDifferentAddressState);
repeatOrderDifferentAddressToggle.addEventListener("change", updateRepeatOrderState);
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkoutForm.hidden = true;
  checkoutSuccess.hidden = false;
  repeatOrderDifferentAddressToggle.checked = false;
  updateRepeatOrderState();
  state.cartQuantity = 0;
  renderCart();
});
document.addEventListener("click", (event) => {
  if (state.cartOpen && !event.target.closest(".cart-wrap") && !event.target.closest("[data-add-to-cart]") && !event.target.closest("[data-quick-view-add]")) setCartOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setCartOpen(false);
    setMenuOpen(false);
    setLightboxOpen(false);
    setQuickViewOpen(false);
    setCheckoutOpen(false);
  }
  if (!lightbox.hidden) trapFocus(event, lightbox);
  if (!quickView.hidden) trapFocus(event, quickView);
  if (!checkoutModal.hidden) trapFocus(event, checkoutModal);
  if (menuPanel.classList.contains("is-open")) trapFocus(event, menuPanel);
});

renderCart();
updateQuantity(0);
updateDifferentAddressState();
updateRepeatOrderState();
