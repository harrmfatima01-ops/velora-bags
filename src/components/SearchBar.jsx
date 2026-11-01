import { Search, X } from "lucide-react";
import "./SearchBar.css";

function SearchBar({ value, onChange, onClear, resultsCount, placeholder = "Search by name, category or description..." }) {
  const hasText = value.trim() !== "";

  return (
    <div className="search-bar">
      <div className="search-bar__field" role="search">
        <Search size={20} className="search-bar__icon" aria-hidden="true" />
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <input
          id="shop-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {hasText && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={onClear}
            aria-label="Clear search"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {hasText && resultsCount === 0 && (
        <p className="search-bar__empty" role="status">
          No bags match "{value.trim()}". Check the spelling, try a shorter word, or clear the
          search to see everything.
        </p>
      )}
    </div>
  );
}

export default SearchBar;