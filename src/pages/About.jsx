import { Link } from "react-router-dom";
import { Gem, Leaf, HeartHandshake } from "lucide-react";
import { handleImageError } from "../utils/helpers";
import "./About.css";

const VALUES = [
  {
    icon: Gem,
    title: "Quality First",
    text: "Every stitch, zip and clasp is checked so your bag looks beautiful for years.",
  },
  {
    icon: Leaf,
    title: "Mindful Materials",
    text: "We favour durable, vegan-friendly materials and packaging that makes less waste.",
  },
  {
    icon: HeartHandshake,
    title: "Made for You",
    text: "Fair prices, honest descriptions and friendly support, because style should feel easy.",
  },
];

function About() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Our Story</h1>
          <p>Designed with confidence, carried with grace.</p>
        </div>
      </div>

      <section className="section">
        <div className="container about__story">
          <img
            src="/images/about/boutique-diplay.png"
            alt="A VELORA BAGS designer sketching a new handbag"
            className="about__image"
            onError={handleImageError}
          />
          <div>
            <h2>Where VELORA began</h2>
            <p>
              VELORA BAGS started with a simple idea: a beautiful handbag shouldn't feel out of
              reach. We wanted pieces that look like they belong in a boutique window and still
              survive a busy day of classes, work and everything after.
            </p>
            <p>
              Each design begins as a sketch, becomes a sample, and is tested for comfort, space
              and strength before it joins our collection.
            </p>
            <h3>Our mission</h3>
            <p>
              To help every woman carry her confidence with a bag that is elegant, practical and
              fairly priced.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tinted" aria-labelledby="values-title">
        <div className="container">
          <h2 id="values-title" className="section-title">What We Stand For</h2>
          <p className="section-subtitle">Three promises behind every bag.</p>
          <div className="about__values">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="about__value">
                <span className="about__value-icon"><Icon size={26} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about__cta">
        <div className="container">
          <h2>Ready to find yours?</h2>
          <Link to="/shop" className="btn btn--primary">Shop the Collection</Link>
        </div>
      </section>
    </>
  );
}

export default About;