import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import categories from "../data/categories";
import { SORT_OPTIONS } from "../utils/productUtils";
import "./FilterSidebar.css";

function FilterSidebar({ filters, onChange, onReset }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Warn the shopper if the minimum is higher than the maximum.
  const priceRangeInvalid =
    filters.minPrice !== "" &&
    filters.maxPrice !== "" &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  return (
    <aside className="filter-sidebar" aria-label="Product filters">
      <button
        type="button"
        className="filter-sidebar__toggle btn btn--outline"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-controls="filter-panel"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        {mobileOpen ? "Hide Filters & Sort" : "Show Filters & Sort"}
      </button>

      <div
        id="filter-panel"
        className={`filter-sidebar__panel ${mobileOpen ? "filter-sidebar__panel--open" : ""}`}
      >
        <div className="form-field">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(event) => onChange("sort", event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="filter-group">
          <legend>Category</legend>
          {["All", ...categories.map((category) => category.name)].map((name) => (
            <label key={name} className="filter-option">
              <input
                type="radio"
                name="category"
                value={name}
                checked={filters.category === name}
                onChange={() => onChange("category", name)}
              />
              <span>{name === "All" ? "All Bags" : name}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Price (Rs.)</legend>
          <div className="filter-price">
            <div className="form-field">
              <label htmlFor="min-price">Min</label>
              <input
                id="min-price"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="0"
                value={filters.minPrice}
                onChange={(event) => onChange("minPrice", event.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="max-price">Max</label>
              <input
                id="max-price"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Any"
                value={filters.maxPrice}
                onChange={(event) => onChange("maxPrice", event.target.value)}
              />
            </div>
          </div>
          {priceRangeInvalid && (
            <p className="field-error" role="alert">
              The minimum price is higher than the maximum.
            </p>
          )}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Availability &amp; Offers</legend>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(event) => onChange("inStockOnly", event.target.checked)}
            />
            <span>In stock only</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(event) => onChange("onSaleOnly", event.target.checked)}
            />
            <span>Discounted products</span>
          </label>
        </fieldset>

        <button type="button" className="btn btn--outline btn--small filter-sidebar__reset" onClick={onReset}>
          Reset All Filters
        </button>
      </div>
    </aside>
  );
}

export default FilterSidebar;