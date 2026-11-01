// The starting values for the Shop page filters.
export const DEFAULT_FILTERS = {
  category: "All",
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
  onSaleOnly: false,
  sort: "featured",
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name: A to Z" },
];

// A product is on sale when it has an original price higher than its current price.
export function isOnSale(product) {
  return Boolean(product.originalPrice) && product.originalPrice > product.price;
}

// Example: originalPrice 11500, price 8900 gives 23 (percent).
export function getDiscountPercent(product) {
  if (!isOnSale(product)) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

// Turns a stock number into a readable label plus a level used for coloring.
export function getStockInfo(stock) {
  if (stock <= 0) return { text: "Out of stock", level: "out" };
  if (stock <= 5) return { text: `Only ${stock} left`, level: "low" };
  return { text: "In stock", level: "in" };
}

// Applies search + filters + sorting together, so they always work as one.
export function filterAndSortProducts(products, searchTerm, filters) {
  const term = searchTerm.trim().toLowerCase();

  // Empty or invalid price boxes mean "no limit".
  const parsedMin = Number(filters.minPrice);
  const parsedMax = Number(filters.maxPrice);
  const min = filters.minPrice === "" || Number.isNaN(parsedMin) ? 0 : parsedMin;
  const max = filters.maxPrice === "" || Number.isNaN(parsedMax) ? Infinity : parsedMax;

  const filtered = products.filter((product) => {
    if (term) {
      const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      if (!searchableText.includes(term)) return false;
    }
    if (filters.category !== "All" && product.category !== filters.category) return false;
    if (product.price < min || product.price > max) return false;
    if (filters.inStockOnly && product.stock === 0) return false;
    if (filters.onSaleOnly && !isOnSale(product)) return false;
    return true;
  });

  // Copy the array before sorting so the original data is never changed.
  const sorted = [...filtered];

  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn));
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default: // "featured": featured items first, then higher rated first
      sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating);
  }

  return sorted;
}