import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

// loading: show placeholder cards while data is "loading".
function ProductGrid({
  products,
  loading = false,
  emptyTitle = "No products found",
  emptyMessage = "Try changing your filters or search.",
}) {
  if (loading) {
    return (
      <div className="product-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="product-grid__skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid__empty" role="status">
        <Search size={36} aria-hidden="true" />
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;