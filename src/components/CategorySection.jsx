import { Link } from "react-router-dom";
import categories from "../data/categories";
import { handleImageError } from "../utils/helpers";
import "./CategorySection.css";

function CategorySection() {
  return (
    <section className="section categories" aria-labelledby="categories-title">
      <div className="container">
        <h2 id="categories-title" className="section-title">Shop by Category</h2>
        <p className="section-subtitle">
          Find the shape that suits your day, from roomy totes to dainty minis.
        </p>

        <div className="categories__grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <img
                src={category.image}
                alt={`${category.name} collection`}
                loading="lazy"
                onError={handleImageError}
              />
              <span className="category-card__title">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;