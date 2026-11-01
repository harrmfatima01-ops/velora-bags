import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";
import categories from "../data/categories";
import { DEFAULT_FILTERS, filterAndSortProducts } from "../utils/productUtils";
import "./Shop.css";

// Turns URL values like ?category=Tote%20Bags&sale=true into starting filters.
function getFiltersFromUrl(params) {
  const categoryParam = params.get("category");
  const categoryIsValid = categories.some((category) => category.name === categoryParam);
  return {
    ...DEFAULT_FILTERS,
    category: categoryIsValid ? categoryParam : "All",
    onSaleOnly: params.get("sale") === "true",
  };
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState(() => getFiltersFromUrl(searchParams));
  const [loading, setLoading] = useState(true);

  // When the URL changes (Navbar search, category card, footer link), update the page.
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setFilters((current) => ({
      ...current,
      category: getFiltersFromUrl(searchParams).category,
      onSaleOnly: getFiltersFromUrl(searchParams).onSaleOnly,
    }));
  }, [searchParams]);

  // Short demo delay so the loading skeleton is visible.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate only when the search text or filters change.
  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, searchTerm, filters),
    [searchTerm, filters]
  );

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm("");
    setSearchParams({}); // also clears ?category=... from the address bar
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Shop All Bags</h1>
          <p>Totes, shoulder bags, crossbodies, clutches and minis.</p>
        </div>
      </div>

      <section className="section shop">
        <div className="container shop__layout">
          <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

          <div className="shop__content">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm("")}
              resultsCount={visibleProducts.length}
            />

            <p className="shop__count" role="status">
              {loading
                ? "Loading bags..."
                : `Showing ${visibleProducts.length} of ${products.length} bags`}
            </p>

            <ProductGrid
              products={visibleProducts}
              loading={loading}
              emptyTitle="No bags found"
              emptyMessage="Try removing a filter or widening the price range."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Shop;