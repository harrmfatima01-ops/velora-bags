import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { EMAIL_PATTERN, isStrongPassword } from "../utils/authUtils";
import "./Auth.css";

const EMPTY_FORM = { fullName: "", email: "", password: "", confirmPassword: "" };

function validateForm(values) {
  const errors = {};
  if (values.fullName.trim().length < 3) errors.fullName = "Please enter your full name (at least 3 characters).";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email, like name@example.com.";
  if (!isStrongPassword(values.password)) errors.password = "Use at least 8 characters, with at least one letter and one number.";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "The passwords do not match.";
  return errors;
}

function Register() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    setFormMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const foundErrors = validateForm(values);
    setErrors(foundErrors);

    const firstInvalidField = Object.keys(foundErrors)[0];
    if (firstInvalidField) {
      document.getElementById(`register-${firstInvalidField}`)?.focus();
      return;
    }

    setSubmitting(true);
    const result = await register(values);
    setSubmitting(false);

    if (!result.success) {
      setFormMessage(result.message);
      return;
    }

    showToast(result.message, "success");
    navigate("/login", { replace: true, state: { message: result.message, email: values.email.trim() } });
  }

  const fieldProps = (name) => ({
    id: `register-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    disabled: submitting,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `register-${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] ? (
      <span id={`register-${name}-error`} className="field-error" role="alert">{errors[name]}</span>
    ) : null;

  return (
    <main className="auth">
      <div className="auth__card">
        <p className="auth__brand">VELORA <span>BAGS</span></p>
        <h1>Create your account</h1>
        <p className="auth__subtitle">Register to browse the collection, save favorites and place orders.</p>

        {formMessage && (
          <div className="auth__alert auth__alert--error" role="alert">
            {formMessage} <Link to="/login">Go to login</Link>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="register-fullName">Full name</label>
            <input type="text" autoComplete="name" {...fieldProps("fullName")} />
            {renderError("fullName")}
          </div>

          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input type="email" autoComplete="email" {...fieldProps("email")} />
            {renderError("email")}
          </div>

          <div className="form-field">
            <label htmlFor="register-password">Password</label>
            <div className="auth__password">
              <input type={showPassword ? "text" : "password"} autoComplete="new-password" {...fieldProps("password")} />
              <button
                type="button"
                className="auth__toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {renderError("password")}
          </div>

          <div className="form-field">
            <label htmlFor="register-confirmPassword">Confirm password</label>
            <input type={showPassword ? "text" : "password"} autoComplete="new-password" {...fieldProps("confirmPassword")} />
            {renderError("confirmPassword")}
          </div>

          <button type="submit" className="btn btn--primary auth__submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth__switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
        <p className="auth__note">
          Demo note: accounts are saved only in this browser. A real store needs a secure backend.
        </p>
      </div>
    </main>
  );
}

export default Register;