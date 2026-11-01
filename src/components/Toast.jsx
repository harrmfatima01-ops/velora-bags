import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

// Each notification type gets its own icon.
const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

function Toast({ toasts, onClose }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <Icon size={20} aria-hidden="true" />
            <p className="toast__message">{toast.message}</p>
            <button
              type="button"
              className="toast__close"
              onClick={() => onClose(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;