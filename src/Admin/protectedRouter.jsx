import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ User logged in but NOT admin → go to home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin user → allow access
  return children;
};

export default ProtectedAdminRoute;