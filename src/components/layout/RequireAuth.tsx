import { Navigate } from "react-router-dom";
import { getToken } from "@/lib/api";

export function RequireAuth({ children }: { children: JSX.Element }) {
  if (!getToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
