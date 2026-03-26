import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role, redirectIfLoggedIn = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  /* ===== NOT LOGGED IN ===== */
  if (!token) {
    if (redirectIfLoggedIn) return children;
    return <Navigate to="/login" replace />;
  }

  /* ===== REDIRECT IF ALREADY LOGGED IN (LOGIN PAGE USE) ===== */
  if (redirectIfLoggedIn) {
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "seller") return <Navigate to="/seller" replace />;
    return <Navigate to="/" replace />;
  }

  /* ===== ROLE CHECK ===== */
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;