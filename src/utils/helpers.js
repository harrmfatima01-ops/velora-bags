// Shipping rule for the demo store: free shipping above this subtotal.
export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FEE = 350;

// Turns 4500 into "Rs. 4,500" (used everywhere so prices look consistent).
export function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

// A simple SVG placeholder shown when a product image fails to load.
export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#F4E8D8"/>
      <path d="M200 260h200l24 200H176z" fill="#C98791"/>
      <path d="M240 260v-30a60 60 0 0 1 120 0v30" fill="none" stroke="#39243A" stroke-width="14" stroke-linecap="round"/>
      <text x="300" y="520" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#39243A">VELORA BAGS</text>
    </svg>`
  );

// Use on any <img>: onError={handleImageError}
// It swaps in the fallback once (the guard stops an infinite error loop).
export function handleImageError(event) {
  if (event.currentTarget.src !== FALLBACK_IMAGE) {
    event.currentTarget.src = FALLBACK_IMAGE;
  }
}

// Calculates subtotal, shipping and total from a list of { product, quantity }.
// Nothing is hardcoded: totals are always derived from the cart.
export function calculateTotals(detailedItems) {
  const subtotal = detailedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

// Reads JSON from LocalStorage safely (corrupt or blocked storage returns the fallback).
export function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Could not read "${key}" from LocalStorage`, error);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save "${key}" to LocalStorage`, error);
  }
}

// Maps color names used in products.js to a real color for the swatch dot.
const COLOR_HEX = {
  "Dusty Rose": "#C98791",
  Ivory: "#FFFCF8",
  Black: "#28252A",
  Plum: "#39243A",
  Champagne: "#F4E8D8",
  Cocoa: "#6B4A3A",
  Sage: "#A6B49B",
  Blush: "#F2C9CF",
  Mulberry: "#7A2E4F",
  Natural: "#E6D9C0",
  Mocha: "#8B6B5A",
  Sand: "#D8C3A5",
  Olive: "#6F7550",
  Gold: "#C9A24A",
  "Rose Floral": "#E3A1AC",
  "Sage Floral": "#B7C4AC",
};

// Unknown color names get a neutral beige dot.
export function getColorHex(colorName) {
  return COLOR_HEX[colorName] || "#D9CFC0";
}