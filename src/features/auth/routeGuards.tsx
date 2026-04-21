import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";

type RouteGuardProps = {
  children: ReactElement;
};

export function ProtectedRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading session...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
