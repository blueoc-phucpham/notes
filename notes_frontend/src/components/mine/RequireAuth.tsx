import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/user";
import NotFound from "@/pages/NotFound";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user,isPending } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (isPending) return null;

  if (!user || !user.is_superuser) {
    return <NotFound></NotFound>
  }

  return children;
}

export function NonAuthenticateUserOnly({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
