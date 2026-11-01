import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Add a shadow once the page has been scrolled a little.
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu and search row after every page change.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    setSearchTerm("");
    setSearchOpen(false);
  }

  function handleLogout() {
    logout();
    showToast("You have been logged out.", "info");
  }

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="VELORA BAGS home">
          VELORA <span>BAGS</span>
        </Link>

        <nav
          id="main-navigation"
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className="navbar__link"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__icon-btn"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            <Search size={22} aria-hidden="true" />
          </button>

          <Link
            to="/wishlist"
            className="navbar__icon-btn"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart size={22} aria-hidden="true" />
            {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
          </Link>

          <Link
            to="/cart"
            className="navbar__icon-btn"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag size={22} aria-hidden="true" />
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>

          {currentUser ? (
            <>
              <span className="navbar__greeting">Hi, {currentUser.fullName.split(" ")[0]}</span>
              <button
                type="button"
                className="navbar__icon-btn"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={22} aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__login">
              Log In
            </Link>
          )}

          <button
            type="button"
            className="navbar__icon-btn navbar__menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="navbar__search">
          <form className="container navbar__search-form" onSubmit={handleSearchSubmit} role="search">
            <label htmlFor="navbar-search" className="sr-only">
              Search products
            </label>
            <input
              id="navbar-search"
              type="search"
              placeholder="Search bags, categories..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn--small navbar__search-btn">
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Navbar;