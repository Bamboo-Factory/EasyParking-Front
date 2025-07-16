import { Link } from 'react-router-dom';

interface AuthRequiredMessageProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
}

const AuthRequiredMessage = ({ 
  title = "Inicio de sesión requerido",
  message = "Necesitas iniciar sesión para continuar con esta acción.",
  actionText = "Iniciar Sesión",
  actionLink = "/login"
}: AuthRequiredMessageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to={actionLink}
            className="btn btn-primary w-fit mx-auto"
          >
            {actionText}
          </Link>
          
          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-primary-600 hover:text-primary-500 block"
            >
              ¿No tienes una cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredMessage; 