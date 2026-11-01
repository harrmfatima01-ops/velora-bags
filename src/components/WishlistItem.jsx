import { Link } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, handleImageError } from "../utils/helpers";
import { getStockInfo, isOnSale } from "../utils/productUtils";
import "./WishlistItem.css";
import useRequireLogin from "../hooks/useRequireLogin";
function WishlistItem({ product }) {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const requireLogin = useRequireLogin();
  const stockInfo = getStockInfo(product.stock);
  const outOfStock = product.stock === 0;

    function handleMoveToCart() {
    if (!requireLogin("Please log in or register first to add items to your cart.")) return;
    const result = addToCart(product, 1);
    if (result.success) {
      removeFromWishlist(product.id); // only remove when the cart add worked
      showToast(`${product.name} moved to your cart.`, "success");
    } else {
      showToast(result.message, "error");
    }
  }

  function handleRemove() {
    removeFromWishlist(product.id);
    showToast(`${product.name} removed from wishlist.`, "info");
  }

  return (
    <li className="wishlist-item">
      <Link to={`/product/${product.id}`} className="wishlist-item__image-link">
        <img
          src={product.image}
          alt={product.name}
          className="wishlist-item__image"
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      <div className="wishlist-item__body">
        <h3 className="wishlist-item__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="wishlist-item__price">
          {formatPrice(product.price)}
          {isOnSale(product) && <s>{formatPrice(product.originalPrice)}</s>}
        </p>
        <p className={`wishlist-item__stock wishlist-item__stock--${stockInfo.level}`}>{stockInfo.text}</p>

        <div className="wishlist-item__actions">
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={handleMoveToCart}
            disabled={outOfStock}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            Move to Cart
          </button>
          <Link to={`/product/${product.id}`} className="btn btn--outline btn--small">
            View Details
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="wishlist-item__remove"
        onClick={handleRemove}
        aria-label={`Remove ${product.name} from wishlist`}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </li>
  );
}

export default WishlistItem;