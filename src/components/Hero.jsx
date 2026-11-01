import { Link } from "react-router-dom";
import { handleImageError } from "../utils/helpers";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">New Season Collection</p>
          <h1 className="hero__title">Carry Your Confidence.</h1>
          <p className="hero__text">
            VELORA BAGS brings you elegant totes, shoulder bags, crossbodies and clutches,
            made to move with you from morning meetings to evening plans.
          </p>
          <div className="hero__buttons">
            <Link to="/shop" className="btn btn--primary">
              Shop Collection
            </Link>
            <Link to="/about" className="btn btn--outline">
              Explore Our Story
            </Link>
          </div>
        </div>

        <div className="hero__image-wrap">
          <img
            src="/images/hero/images.jpeg"
            alt="Woman holding an elegant dusty rose handbag"
            className="hero__image"
            onError={handleImageError}
          />
          <span className="hero__badge">Up to 25% off selected styles</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;