import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { loading, isAuthenticated, isAdmin } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
