import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/helpers";
import "./Checkout.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{10,15}$/;
const POSTAL_PATTERN = /^[0-9]{4,6}$/;

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "cod",
};

// Returns an object like { email: "Please enter a valid email." }. Empty object = all good.
function validateForm(values) {
  const errors = {};
  if (values.fullName.trim().length < 3) errors.fullName = "Please enter your full name (at least 3 characters).";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email, like name@example.com.";
  if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = "Enter a valid phone number (10 to 15 digits), e.g. 0300 0000000.";
  if (values.address.trim().length < 8) errors.address = "Please enter your full shipping address.";
  if (values.city.trim().length < 2) errors.city = "Please enter your city.";
  if (!POSTAL_PATTERN.test(values.postalCode.trim())) errors.postalCode = "Enter a postal code with 4 to 6 digits.";
  if (values.paymentMethod !== "cod") errors.paymentMethod = "Please choose Cash on Delivery.";
  return errors;
}

function Checkout() {
  const { detailedItems, subtotal, shipping, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null); // filled after a successful demo order

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // Clear that field's error as soon as the shopper starts fixing it.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const foundErrors = validateForm(values);
    setErrors(foundErrors);

    const firstInvalidField = Object.keys(foundErrors)[0];
    if (firstInvalidField) {
      showToast("Please fix the highlighted fields.", "error");
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    // Save a copy of the order, then empty the cart.
    setOrder({
      orderNumber: `VB-${Date.now().toString().slice(-6)}`,
      customer: { ...values },
      items: detailedItems,
      subtotal,
      shipping,
      total,
    });
    clearCart();
    showToast("Demo order placed successfully!", "success");
    window.scrollTo(0, 0);
  }

  // ---- Order confirmation screen ----
  if (order) {
    return (
      <section className="section">
        <div className="container checkout__confirmation">
          <CheckCircle2 size={56} className="checkout__confirmation-icon" aria-hidden="true" />
          <h1>Thank you, {order.customer.fullName.split(" ")[0]}!</h1>
          <p className="checkout__order-number">Demo order number: <strong>{order.orderNumber}</strong></p>
          

          <div className="summary-card checkout__confirmation-card">
            <h2>Order Details</h2>
            <ul>
              {order.items.map((item) => (
                <li key={item.product.id} className="summary-row">
                  <span>{item.product.name} &times; {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
            <div className="summary-row summary-row--total"><span>Total (Cash on Delivery)</span><span>{formatPrice(order.total)}</span></div>
            <p className="checkout__ship-to">
              <strong>Ship to:</strong> {order.customer.address}, {order.customer.city} {order.customer.postalCode}
            </p>
          </div>

          <Link to="/shop" className="btn btn--primary">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  // ---- Empty cart ----
  if (detailedItems.length === 0) {
    return (
      <section className="section">
        <div className="empty-state">
          <div className="empty-state__icon"><ShoppingBag size={42} aria-hidden="true" /></div>
          <h1>Nothing to check out</h1>
          <p>Your cart is empty. Add a bag or two first.</p>
          <Link to="/shop" className="btn btn--primary">Browse Bags</Link>
        </div>
      </section>
    );
  }

  // Small helper so each field's props stay short.
  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] ? (
      <span id={`${name}-error`} className="field-error" role="alert">{errors[name]}</span>
    ) : null;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Demo checkout: no real payment is processed.</p>
        </div>
      </div>

      <section className="section">
        <div className="container checkout__layout">
          <form className="checkout__form" onSubmit={handleSubmit} noValidate>
            <h2>Shipping Details</h2>

            <div className="form-field">
              <label htmlFor="fullName">Full name</label>
              <input type="text" autoComplete="name" {...fieldProps("fullName")} />
              {renderError("fullName")}
            </div>

            <div className="checkout__row">
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="email" autoComplete="email" {...fieldProps("email")} />
                {renderError("email")}
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone number</label>
                <input type="tel" autoComplete="tel" placeholder="0300 0000000" {...fieldProps("phone")} />
                {renderError("phone")}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="address">Shipping address</label>
              <input type="text" autoComplete="street-address" {...fieldProps("address")} />
              {renderError("address")}
            </div>

            <div className="checkout__row">
              <div className="form-field">
                <label htmlFor="city">City</label>
                <input type="text" autoComplete="address-level2" {...fieldProps("city")} />
                {renderError("city")}
              </div>
              <div className="form-field">
                <label htmlFor="postalCode">Postal code</label>
                <input type="text" inputMode="numeric" autoComplete="postal-code" {...fieldProps("postalCode")} />
                {renderError("postalCode")}
              </div>
            </div>

            <fieldset className="checkout__payment">
              <legend>Payment method</legend>
              <label className="checkout__payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={values.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                <span>Cash on Delivery <em>(demo)</em></span>
              </label>
              <label className="checkout__payment-option checkout__payment-option--disabled">
                <input type="radio" name="paymentMethod" value="card" disabled />
                <span>Credit / Debit Card <em>(not available in this demo)</em></span>
              </label>
              {renderError("paymentMethod")}
            </fieldset>

            <p className="checkout__note">
              This frontend-only demo does not collect card details or process real payments. A
              real store would send the order to a secure backend and use a payment gateway
              (such as Stripe, or a local Pakistani provider), so card data goes directly to the
              gateway and never touches this site.
            </p>

            <button type="submit" className="btn btn--primary checkout__submit">
              Place Demo Order
            </button>
          </form>

          <aside className="summary-card" aria-label="Order summary">
            <h2>Order Summary</h2>
            <ul>
              {detailedItems.map((item) => (
                <li key={item.product.id} className="summary-row">
                  <span>{item.product.name} &times; {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="summary-row summary-row--total"><span>Total</span><span>{formatPrice(total)}</span></div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Checkout;