// THIRD PARTY
import { Navigate, Outlet } from "react-router-dom";

// API
import {
  getCurrentUser,
  isAuthenticated,
  isTokenExpired,
  logout,
} from "@/api/common.api";

export default function ProtectedRoute() {
  // Never logged in
  if (!isAuthenticated()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Session expired
  if (isTokenExpired()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (!user || user.status !== "ACTIVE") {
    logout();
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
