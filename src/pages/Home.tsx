import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Encuentra tu estacionamiento ideal
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Reserva tu espacio de estacionamiento de manera rápida y segura. 
          Encuentra el lugar perfecto cerca de tu destino.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/parkings" className="btn btn-primary">
            Buscar Estacionamientos
          </Link>
          <Link to="/register-parking" className="btn btn-secondary">
            Registrar Estacionamiento
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <MapPinIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ubicación Precisa</h3>
          <p className="text-gray-600">
            Encuentra estacionamientos cercanos a tu ubicación actual
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <ClockIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Reserva Instantánea</h3>
          <p className="text-gray-600">
            Reserva tu espacio en segundos y evita perder tiempo buscando
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Seguridad Garantizada</h3>
          <p className="text-gray-600">
            Estacionamientos verificados y seguros para tu vehículo
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          ¿Tienes un espacio de estacionamiento disponible?
        </h2>
        <p className="mb-6">
          Regístralo y comienza a generar ingresos extra
        </p>
        <Link to="/register-parking" className="btn bg-white text-primary-600 hover:bg-gray-100">
          Registrar mi Estacionamiento
        </Link>
      </section>
    </div>
  );
};

export default Home; 