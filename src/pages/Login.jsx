import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { EMAIL_PATTERN } from "../utils/authUtils";
import "./Auth.css";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  // Information passed from other pages (redirect message, email after registering).
  const notice = location.state?.message || "";
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/";

  const [values, setValues] = useState({ email: location.state?.email || "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState({ message: "", notRegistered: false });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError({ message: "", notRegistered: false });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const foundErrors = {};
    if (!EMAIL_PATTERN.test(values.email.trim())) foundErrors.email = "Please enter a valid email, like name@example.com.";
    if (values.password === "") foundErrors.password = "Please enter your password.";
    setErrors(foundErrors);

    const firstInvalidField = Object.keys(foundErrors)[0];
    if (firstInvalidField) {
      document.getElementById(`login-${firstInvalidField}`)?.focus();
      return;
    }

    setSubmitting(true);
    const result = await login(values);
    setSubmitting(false);

    if (!result.success) {
      setFormError({ message: result.message, notRegistered: Boolean(result.notRegistered) });
      return;
    }

    showToast(result.message, "success");
    navigate(redirectTo, { replace: true });
  }

  const fieldProps = (name) => ({
    id: `login-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    disabled: submitting,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `login-${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] ? (
      <span id={`login-${name}-error`} className="field-error" role="alert">{errors[name]}</span>
    ) : null;

  return (
    <main className="auth">
      <div className="auth__card">
        <p className="auth__brand">VELORA <span>BAGS</span></p>
        <h1>Welcome back</h1>
        <p className="auth__subtitle">Log in to continue shopping.</p>

        {notice && !formError.message && (
          <div className="auth__alert auth__alert--info" role="status">{notice}</div>
        )}

        {formError.message && (
          <div className="auth__alert auth__alert--error" role="alert">
            {formError.message}{" "}
            {formError.notRegistered && <Link to="/register">Register now</Link>}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input type="email" autoComplete="email" {...fieldProps("email")} />
            {renderError("email")}
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth__password">
              <input type={showPassword ? "text" : "password"} autoComplete="current-password" {...fieldProps("password")} />
              <button
                type="button"
                className="auth__toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {renderError("password")}
          </div>

          <button type="submit" className="btn btn--primary auth__submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth__switch">
          New to VELORA BAGS? <Link to="/register">Register first</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;