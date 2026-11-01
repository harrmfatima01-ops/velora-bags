import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "../context/ToastContext";
import "./Newsletter.css";

// A simple pattern: something@something.something
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// variant "banner" = big section on the Home page, "compact" = small form in the Footer.
function Newsletter({ variant = "banner" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const { showToast } = useToast();

  const inputId = `newsletter-email-${variant}`;
  const statusId = `newsletter-status-${variant}`;

  function handleSubmit(event) {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setStatus({ type: "error", message: "Please enter a valid email, like name@example.com." });
      return;
    }

    // This is a frontend-only demo, so nothing is sent or stored anywhere.
    setStatus({
      type: "success",
      message: "Thank you for subscribing! This is a demo, so your email was not saved.",
    });
    showToast("Newsletter form validated successfully (demo).", "success");
    setEmail("");
  }

  return (
    <section className={`newsletter newsletter--${variant}`} aria-labelledby={`newsletter-title-${variant}`}>
      <div className={variant === "banner" ? "container newsletter__inner" : "newsletter__inner"}>
        <div className="newsletter__text">
          {variant === "banner" && <Mail size={32} aria-hidden="true" />}
          <h2 id={`newsletter-title-${variant}`} className="newsletter__title">
            {variant === "banner" ? "Join the Velora Circle" : "Newsletter"}
          </h2>
          <p>
            {variant === "banner"
              ? "Be the first to hear about new arrivals, private sales and styling ideas."
              : "New arrivals and offers, straight to your inbox."}
          </p>
        </div>

        <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={status.type === "error"}
            aria-describedby={statusId}
          />
          <button type="submit" className="btn btn--small newsletter__btn">
            Subscribe
          </button>

          <p
            id={statusId}
            className={`newsletter__status ${status.type ? `newsletter__status--${status.type}` : ""}`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>

          <p className="newsletter__note">
            Demo note: this frontend does not store subscriptions on a real server. A backend or
            email service must be connected for that.
          </p>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;