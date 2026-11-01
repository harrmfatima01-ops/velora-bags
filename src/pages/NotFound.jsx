import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <p className="not-found__code" aria-hidden="true">404</p>
        <h1>This page has wandered off</h1>
        <p>The page you're looking for doesn't exist or has moved. Let's get you back to something beautiful.</p>
        <Link to="/" className="btn btn--primary">Back to Homepage</Link>
      </div>
    </section>
  );
}

export default NotFound;