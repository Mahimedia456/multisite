// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession } from "../lib/auth";

export default function ProtectedRoute() {
  const session = getSession();
  const location = useLocation();

  const token =
    session?.token ||
    session?.access_token ||
    session?.jwt ||
    session?.data?.access_token;

  if (!token) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
