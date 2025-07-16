import { Link } from "react-router-dom";
import {
  MapPinIcon,
  PlusCircleIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPinIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">EasyParking</span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Inicio</span>
            </Link>
            <Link
              to="/parkings"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
            >
              <MapPinIcon className="h-5 w-5" />
              <span>Estacionamientos</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/register-parking"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Registrar</span>
                </Link>
                <Link
                  to="/reservations"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
                >
                  <span>Reservas</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                    <UserIcon className="h-5 w-5" />
                    <span>
                      {JSON.parse(localStorage.getItem("user") || "{}").email ||
                        ""}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
              >
                <UserIcon className="h-5 w-5" />
                <span>Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
