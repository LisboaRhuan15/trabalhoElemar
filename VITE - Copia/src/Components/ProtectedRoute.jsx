import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p>Verificando sessão...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}