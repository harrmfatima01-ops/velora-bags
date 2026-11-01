import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import WishlistItem from "../components/WishlistItem";
import { useWishlist } from "../context/WishlistContext";
import "./Wishlist.css";

function Wishlist() {
  const { wishlistItems, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <section className="section">
        <div className="empty-state">
          <div className="empty-state__icon"><Heart size={42} aria-hidden="true" /></div>
          <h1>Your wishlist is empty</h1>
          <p>Tap the heart on any bag you love and it will wait for you here.</p>
          <Link to="/shop" className="btn btn--primary">Discover Bags</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Your Wishlist</h1>
          <p>{wishlistCount} saved {wishlistCount === 1 ? "bag" : "bags"}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <ul className="wishlist__list">
            {wishlistItems.map((product) => (
              <WishlistItem key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default Wishlist;