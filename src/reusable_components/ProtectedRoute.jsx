        import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function isLoggedIn() {
  return localStorage.getItem("explified") !== null;
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    // Redirect to login, preserve the requested path
    return <Navigate to="/flowsense/login" state={{ from: location }} replace />;
  }
  return children;
}
