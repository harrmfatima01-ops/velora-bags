import { createContext, useContext, useEffect, useMemo, useState } from "react";
import products from "../data/products";
import { calculateTotals, loadFromStorage, saveToStorage } from "../utils/helpers";

const CartContext = createContext(null);
const STORAGE_KEY = "velora-cart";

export function CartProvider({ children }) {
  // Cart is a list of { id, quantity }. It starts from LocalStorage.
  const [cartItems, setCartItems] = useState(() => loadFromStorage(STORAGE_KEY, []));

  // Save to LocalStorage whenever the cart changes.
  useEffect(() => {
    saveToStorage(STORAGE_KEY, cartItems);
  }, [cartItems]);

  // Join each cart entry with its product. Removed or unknown products are dropped.
  const detailedItems = useMemo(
    () =>
      cartItems
        .map((item) => ({
          product: products.find((product) => product.id === item.id),
          quantity: item.quantity,
        }))
        .filter((item) => item.product),
    [cartItems]
  );

  const totals = useMemo(() => calculateTotals(detailedItems), [detailedItems]);
  const cartCount = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Every action returns { success, message } so the caller can show a toast.
  function addToCart(product, quantity = 1) {
    if (product.stock === 0) {
      return { success: false, message: `${product.name} is out of stock.` };
    }

    const existing = cartItems.find((item) => item.id === product.id);
    const currentQuantity = existing ? existing.quantity : 0;

    if (currentQuantity + quantity > product.stock) {
      return {
        success: false,
        message: `Only ${product.stock} of ${product.name} available (you have ${currentQuantity} in your cart).`,
      };
    }

    setCartItems((current) =>
      existing
        ? current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...current, { id: product.id, quantity }]
    );
    return { success: true, message: `${product.name} added to cart.` };
  }

  // Quantity can never go below 1 or above the available stock.
  function updateQuantity(productId, newQuantity) {
    const product = products.find((item) => item.id === productId);
    if (!product) return { success: false, message: "Product not found." };
    if (newQuantity < 1) return { success: false, message: "Quantity must be at least 1." };
    if (newQuantity > product.stock) {
      return { success: false, message: `Only ${product.stock} in stock.` };
    }

    setCartItems((current) =>
      current.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
    return { success: true, message: "Quantity updated." };
  }

  function removeFromCart(productId) {
    setCartItems((current) => current.filter((item) => item.id !== productId));
    return { success: true, message: "Item removed from cart." };
  }

  function clearCart() {
    setCartItems([]);
    return { success: true, message: "Cart cleared." };
  }

  const value = {
    detailedItems,
    cartCount,
    ...totals, // subtotal, shipping, total
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}