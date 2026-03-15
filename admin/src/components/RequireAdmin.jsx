import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";

export default function RequireAdmin({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
