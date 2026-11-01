import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import Newsletter from "../components/Newsletter";
import products from "../data/products";
import "./Home.css";

// These lists never change while the app runs, so they are built once.
const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);
const newArrivals = products.filter((product) => product.isNew).slice(0, 4);

function Home() {
  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <h2 id="featured-title" className="section-title">Featured Bags</h2>
          <p className="section-subtitle">Our most loved pieces, chosen for quality and style.</p>
          <ProductGrid products={featuredProducts} />
          <div className="home__more">
            <Link to="/shop" className="btn btn--outline">View All Bags</Link>
          </div>
        </div>
      </section>

      <CategorySection />

      <section className="home__promo" aria-labelledby="promo-title">
        <div className="container home__promo-inner">
          <div>
            <p className="home__promo-eyebrow">Limited Time</p>
            <h2 id="promo-title">Seasonal Sale: Up to 25% Off</h2>
            <p>Beautiful bags at softer prices. Selected styles only, while stock lasts.</p>
          </div>
          <Link to="/shop?sale=true" className="btn home__promo-btn">Shop the Sale</Link>
        </div>
      </section>

      <section className="section section--tinted" aria-labelledby="new-title">
        <div className="container">
          <h2 id="new-title" className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Fresh styles that just landed.</p>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      <Newsletter variant="banner" />
    </>
  );
}

export default Home;