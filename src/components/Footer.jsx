import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import categories from "../data/categories";
import Newsletter from "./Newsletter";
import "./Footer.css";

// Change these links to your real social pages.
const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { name: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
];

const CUSTOMER_LINKS = [
  { label: "Contact Us", to: "/contact" },
  { label: "My Cart", to: "/cart" },
  { label: "My Wishlist", to: "/wishlist" },
  { label: "Checkout", to: "/checkout" },
];

// Small inline SVG logos (Lucide no longer ships brand icons).
function SocialIcon({ name }) {
  if (name === "instagram") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// showNewsletter lets the Home page hide the footer form (it has its own banner).
function Footer({ showNewsletter = true }) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            VELORA <span>BAGS</span>
          </Link>
          <p>
            Thoughtfully designed handbags for women who carry their confidence everywhere.
          </p>
          <div className="footer__social">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`VELORA BAGS on ${social.name}`}
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer__heading">Shop</h3>
          <ul className="footer__list">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/shop?category=${encodeURIComponent(category.name)}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer__heading">Customer Service</h3>
          <ul className="footer__list">
            {CUSTOMER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__list footer__contact">
            <li><MapPin size={16} aria-hidden="true" />Gulberg Town Lahore</li>
            <li><Phone size={16} aria-hidden="true" /> +92 3290399498</li>
            <li><Mail size={16} aria-hidden="true" /> velorabags@gmail.com</li>
          </ul>
        </div>
      </div>

      {showNewsletter && (
        <div className="container footer__newsletter">
          <Newsletter variant="compact" />
        </div>
      )}

      <div className="footer__bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} VELORA BAGS. All rights reserved. .</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;