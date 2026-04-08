import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role, redirectIfLoggedIn = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userStatus = localStorage.getItem("userStatus"); // ✅ NEW

  /* ===== NOT LOGGED IN ===== */
  if (!token) {
    if (redirectIfLoggedIn) return children;
    return <Navigate to="/login" replace />;
  }

  /* ===== BLOCK DEACTIVATED ===== 🔴 */
  if (userStatus === "deactivated") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Account Deactivated
        </h1>
        <p className="mt-4 text-gray-600">
          Your account has been permanently deactivated by admin.
        </p>
      </div>
    );
  }

  /* ===== BLOCK SUSPENDED ===== 🟡 */
  if (userStatus === "suspended") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-yellow-600">
          Account Suspended
        </h1>
        <p className="mt-4 text-gray-600">
          Your account is temporarily suspended.
        </p>
      </div>
    );
  }

  /* ===== REDIRECT IF ALREADY LOGGED IN ===== */
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