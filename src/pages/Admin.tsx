import { Navigate } from "react-router-dom";

// /admin route alias → redirects to the existing dashboard
export default function Admin() {
  return <Navigate to="/dashboard" replace />;
}
