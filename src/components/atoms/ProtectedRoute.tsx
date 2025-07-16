import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthRequiredMessage from "../molecules/AuthRequiredMessage";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <AuthRequiredMessage
        title="Inicio de sesión requerido"
        message="Necesitas iniciar sesión para realizar una reserva."
        actionText="Iniciar Sesión"
        actionLink={redirectTo}
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <AuthRequiredMessage
        title="Acceso denegado"
        message="Necesitas permisos de administrador para acceder a esta sección."
        actionText="Ir al inicio"
        actionLink="/"
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
