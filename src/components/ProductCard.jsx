import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import useRequireLogin from "../hooks/useRequireLogin";
import { formatPrice, handleImageError } from "../utils/helpers";
import { getDiscountPercent, getStockInfo, isOnSale } from "../utils/productUtils";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const requireLogin = useRequireLogin();

  const saved = isInWishlist(product.id);
  const stockInfo = getStockInfo(product.stock);
  const onSale = isOnSale(product);
  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    // Visitors who are not logged in are sent to the login page instead.
    if (!requireLogin("Please log in or register first to add items to your cart.")) return;

    const result = addToCart(product, 1);
    showToast(result.message, result.success ? "success" : "error");
  }

  function handleWishlistClick() {
    const result = toggleWishlist(product);
    // "success" when added, "info" when removed.
    showToast(result.message, saved ? "info" : "success");
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            onError={handleImageError}
            className="product-card__image"
          />
        </Link>

        <div className="product-card__badges">
          {onSale && <span className="badge badge--sale">-{getDiscountPercent(product)}%</span>}
          {product.isNew && <span className="badge badge--new">New</span>}
        </div>

        <button
          type="button"
          className={`product-card__heart ${saved ? "product-card__heart--active" : ""}`}
          onClick={handleWishlistClick}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="product-card__rating" aria-label={`Rated ${product.rating} out of 5`}>
          <Star size={14} fill="currentColor" aria-hidden="true" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        <p className="product-card__price">
          <span className="product-card__price-now">{formatPrice(product.price)}</span>
          {onSale && <s className="product-card__price-old">{formatPrice(product.originalPrice)}</s>}
        </p>

        <p className={`product-card__stock product-card__stock--${stockInfo.level}`}>{stockInfo.text}</p>

        <div className="product-card__actions">
          <button
            type="button"
            className="btn btn--primary btn--small product-card__cart-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </button>
          <Link to={`/product/${product.id}`} className="product-card__details">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;