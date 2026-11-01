import { createContext, useContext, useEffect, useMemo, useState } from "react";
import products from "../data/products";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const WishlistContext = createContext(null);
const STORAGE_KEY = "velora-wishlist";

export function WishlistProvider({ children }) {
  // The wishlist is just a list of product IDs.
  const [wishlistIds, setWishlistIds] = useState(() => loadFromStorage(STORAGE_KEY, []));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, wishlistIds);
  }, [wishlistIds]);

  const wishlistItems = useMemo(
    () => wishlistIds.map((id) => products.find((product) => product.id === id)).filter(Boolean),
    [wishlistIds]
  );

  function isInWishlist(productId) {
    return wishlistIds.includes(productId);
  }

  // One button adds the product if it's missing and removes it if it's there.
  function toggleWishlist(product) {
    if (isInWishlist(product.id)) {
      setWishlistIds((current) => current.filter((id) => id !== product.id));
      return { success: true, message: `${product.name} removed from wishlist.` };
    }
    setWishlistIds((current) => [...current, product.id]);
    return { success: true, message: `${product.name} added to wishlist.` };
  }

  function removeFromWishlist(productId) {
    setWishlistIds((current) => current.filter((id) => id !== productId));
    return { success: true, message: "Removed from wishlist." };
  }

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}