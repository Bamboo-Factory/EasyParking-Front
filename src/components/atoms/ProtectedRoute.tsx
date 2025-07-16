import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequiredMessage from '../molecules/AuthRequiredMessage';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
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

  return <>{children}</>;
};

export default ProtectedRoute; 