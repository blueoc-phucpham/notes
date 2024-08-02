import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth || !auth.user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
