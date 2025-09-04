// frontend/src/Components/JsCompo/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Guards a route. If not authenticated, opens login modal and
 * redirects to home (or previous). After login, you can navigate again.
 */
export default function ProtectedRoute({ children }) {
  const { user, requireLogin } = useAuth();
  const location = useLocation();

  if (!user) {
    // Open modal and block this render
    requireLogin(() => {
      // no-op here; user can navigate again after login
    });
    // You can also return a spinner or a small message
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
