import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Returns a function: requireLogin(message).
// It returns true if the visitor is logged in. If not, it sends them to the login page
// (remembering the current page) and returns false.
function useRequireLogin() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  return function requireLogin(message = "Please log in or register first to continue.") {
    if (isLoggedIn) return true;

    showToast("Please log in or register first.", "info");
    navigate("/login", { state: { from: location, message } });
    return false;
  };
}

export default useRequireLogin;