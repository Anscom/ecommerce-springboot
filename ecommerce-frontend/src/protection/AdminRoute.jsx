// components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }



  // Check if roles array includes "ROLE_ADMIN"
  if (!user.roles || !user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
