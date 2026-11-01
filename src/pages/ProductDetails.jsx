import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingBag, Star, PackageX } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import useRequireLogin from "../hooks/useRequireLogin";
import { formatPrice, handleImageError, getColorHex } from "../utils/helpers";
import { getDiscountPercent, getStockInfo, isOnSale } from "../utils/productUtils";
import "./ProductDetails.css";

function ProductView({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const requireLogin = useRequireLogin();

  const stockInfo = getStockInfo(product.stock);
  const outOfStock = product.stock === 0;
  const saved = isInWishlist(product.id);
  const onSale = isOnSale(product);

  // Related products: same category, but not the product being viewed.
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  function handleAddToCart() {
    // Visitors who are not logged in are sent to the login page instead.
    if (!requireLogin("Please log in or register first to add items to your cart.")) return;

    const result = addToCart(product, quantity);
    showToast(result.message, result.success ? "success" : "error");
  }

  function handleWishlist() {
    const result = toggleWishlist(product);
    showToast(result.message, saved ? "info" : "success");
  }

  return (
    <>
      <section className="section product-details">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{" "}
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> /{" "}
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className="product-details__layout">
            <div className="product-details__gallery">
              <img
                src={product.gallery[selectedImage]}
                alt={`${product.name}, view ${selectedImage + 1}`}
                className="product-details__main-image"
                onError={handleImageError}
              />
              <div className="product-details__thumbs">
                {product.gallery.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    className={`product-details__thumb ${index === selectedImage ? "product-details__thumb--active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Show view ${index + 1} of ${product.name}`}
                    aria-pressed={index === selectedImage}
                  >
                    <img src={imageUrl} alt="" onError={handleImageError} />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-details__info">
              <p className="product-details__category">{product.category}</p>
              <h1>{product.name}</h1>

              <div className="product-details__rating" aria-label={`Rated ${product.rating} out of 5`}>
                <Star size={16} fill="currentColor" aria-hidden="true" /> {product.rating.toFixed(1)}
              </div>

              <p className="product-details__price">
                <span>{formatPrice(product.price)}</span>
                {onSale && (
                  <>
                    <s>{formatPrice(product.originalPrice)}</s>
                    <em>Save {getDiscountPercent(product)}%</em>
                  </>
                )}
              </p>

              <p className="product-details__description">{product.description}</p>

              {product.colors?.length > 0 && (
                <div className="product-details__colors">
                  <p>
                    Color: <strong>{selectedColor}</strong>
                  </p>
                  <div className="product-details__color-list">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`product-details__color ${color === selectedColor ? "product-details__color--active" : ""}`}
                        onClick={() => setSelectedColor(color)}
                        aria-pressed={color === selectedColor}
                      >
                        <span
                          className="product-details__swatch"
                          style={{ background: getColorHex(color) }}
                          aria-hidden="true"
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className={`product-details__stock product-details__stock--${stockInfo.level}`}>
                {stockInfo.text}
              </p>

              {!outOfStock && (
                <div className="product-details__quantity" role="group" aria-label="Choose quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="product-details__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  {outOfStock ? "Currently Unavailable" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={handleWishlist}
                  aria-pressed={saved}
                >
                  <Heart size={18} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
                  {saved ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section section--tinted" aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className="section-title">You May Also Like</h2>
            <p className="section-subtitle">More from {product.category}.</p>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));

  // Invalid or missing ID: show a friendly message instead of crashing.
  if (!product) {
    return (
      <section className="section">
        <div className="empty-state">
          <div className="empty-state__icon"><PackageX size={40} aria-hidden="true" /></div>
          <h1>Product not found</h1>
          <p>We couldn't find a bag with that ID. It may have been removed, or the link may be wrong.</p>
          <Link to="/shop" className="btn btn--primary">Back to Shop</Link>
        </div>
      </section>
    );
  }

  // The key makes React reset the page state when the product changes.
  return <ProductView key={product.id} product={product} />;
}

export default ProductDetails;