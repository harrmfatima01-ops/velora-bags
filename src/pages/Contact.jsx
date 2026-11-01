import { useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useToast } from "../context/ToastContext";
import "./Contact.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

function validateForm(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email, like name@example.com.";
  if (values.subject.trim().length < 3) errors.subject = "Please add a short subject.";
  if (values.message.trim().length < 10) errors.message = "Your message should be at least 10 characters.";
  return errors;
}

function Contact() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const foundErrors = validateForm(values);
    setErrors(foundErrors);

    const firstInvalidField = Object.keys(foundErrors)[0];
    if (firstInvalidField) {
      showToast("Please fix the highlighted fields.", "error");
      document.getElementById(`contact-${firstInvalidField}`)?.focus();
      return;
    }

    // Demo only: nothing is sent anywhere.
    setSubmitted(true);
    setValues(EMPTY_FORM);
    showToast("Message form validated successfully (demo).", "success");
  }

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] ? (
      <span id={`contact-${name}-error`} className="field-error" role="alert">{errors[name]}</span>
    ) : null;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions about an order or a bag? We'd love to hear from you.</p>
        </div>
      </div>

      <section className="section">
        <div className="container contact__layout">
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input type="text" autoComplete="name" {...fieldProps("name")} />
              {renderError("name")}
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input type="email" autoComplete="email" {...fieldProps("email")} />
              {renderError("email")}
            </div>
            <div className="form-field">
              <label htmlFor="contact-subject">Subject</label>
              <input type="text" {...fieldProps("subject")} />
              {renderError("subject")}
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">Message</label>
              <textarea rows="6" {...fieldProps("message")} />
              {renderError("message")}
            </div>

            <button type="submit" className="btn btn--primary">Send Message</button>

            {submitted && (
              <p className="contact__success" role="status">
                Thank you! Your message passed validation. Demo note: this frontend does not send
                messages anywhere, because real delivery needs a backend or a form service.
              </p>
            )}
          </form>

          <aside className="contact__details">
            <h2>Get in touch</h2>
            <ul>
              <li><MapPin size={20} aria-hidden="true" /><span> Gulberg Town Lahore</span></li>
              <li><Phone size={20} aria-hidden="true" /><span>+92 3390399498</span></li>
              <li><Mail size={20} aria-hidden="true" /><span>velorabags@gmail.com</span></li>
              <li><Clock size={20} aria-hidden="true" /><span>Mon to Sat, 10am to 7pm</span></li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Contact;