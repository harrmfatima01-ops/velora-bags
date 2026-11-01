import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "../utils/helpers";
import "./Cart.css";

function Cart() {
  const { detailedItems, cartCount, subtotal, shipping, total, clearCart } = useCart();
  const { showToast } = useToast();

  function handleClearCart() {
    // Ask first so a shopper doesn't lose their cart by accident.
    if (window.confirm("Remove all items from your cart?")) {
      clearCart();
      showToast("Your cart has been cleared.", "info");
    }
  }

  if (detailedItems.length === 0) {
    return (
      <section className="section">
        <div className="empty-state">
          <div className="empty-state__icon"><ShoppingBag size={42} aria-hidden="true" /></div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't picked a favorite yet. Our newest bags are waiting for you.</p>
          <Link to="/shop" className="btn btn--primary">Start Shopping</Link>
        </div>
      </section>
    );
  }

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Your Cart</h1>
          <p>{cartCount} {cartCount === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <section className="section cart">
        <div className="container cart__layout">
          <div>
            <ul className="cart__list">
              {detailedItems.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </ul>

            <div className="cart__footer-actions">
              <Link to="/shop" className="btn btn--outline btn--small">
                <ArrowLeft size={16} aria-hidden="true" /> Continue Shopping
              </Link>
              <button type="button" className="btn btn--small cart__clear" onClick={handleClearCart}>
                <Trash2 size={16} aria-hidden="true" /> Clear Cart
              </button>
            </div>
          </div>

          <aside className="summary-card" aria-label="Order summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="summary-row summary-row--total"><span>Total</span><span>{formatPrice(total)}</span></div>

            {remainingForFreeShipping > 0 && (
              <p className="cart__shipping-hint">
                Add {formatPrice(remainingForFreeShipping)} more for free shipping.
              </p>
            )}

            <Link to="/checkout" className="btn btn--primary cart__checkout">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Cart;