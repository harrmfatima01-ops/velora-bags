import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, handleImageError } from "../utils/helpers";
import "./CartItem.css";

// item looks like { product: {...}, quantity: 2 }
function CartItem({ item }) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const atMinimum = quantity <= 1;
  const atMaximum = quantity >= product.stock;

  function changeQuantity(newQuantity) {
    const result = updateQuantity(product.id, newQuantity);
    if (!result.success) showToast(result.message, "error");
  }

  function handleRemove() {
    const result = removeFromCart(product.id);
    showToast(`${product.name} removed from cart.`, "info");
    return result;
  }

  return (
    <li className="cart-item">
      <Link to={`/product/${product.id}`} className="cart-item__image-link">
        <img
          src={product.image}
          alt={product.name}
          className="cart-item__image"
          onError={handleImageError}
        />
      </Link>

      <div className="cart-item__info">
        <h3 className="cart-item__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="cart-item__category">{product.category}</p>
        <p className="cart-item__unit-price">{formatPrice(product.price)} each</p>
        {atMaximum && <p className="cart-item__limit">Maximum available quantity reached.</p>}
      </div>

      <div className="cart-item__quantity" role="group" aria-label={`Quantity for ${product.name}`}>
        <button
          type="button"
          onClick={() => changeQuantity(quantity - 1)}
          disabled={atMinimum}
          aria-label="Decrease quantity"
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          type="button"
          onClick={() => changeQuantity(quantity + 1)}
          disabled={atMaximum}
          aria-label="Increase quantity"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>

      <p className="cart-item__subtotal" aria-label="Item subtotal">
        {formatPrice(product.price * quantity)}
      </p>

      <button
        type="button"
        className="cart-item__remove"
        onClick={handleRemove}
        aria-label={`Remove ${product.name} from cart`}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </li>
  );
}

export default CartItem;