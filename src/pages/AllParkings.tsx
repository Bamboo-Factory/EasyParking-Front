import { useState, useEffect } from 'react';
import { parkingService } from '../services/api';
import type { Parking } from '../services/api';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import ErrorMessage from '../components/atoms/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AllParkings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const itemsPerPage = 10;

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!isAuthenticated || user?.role !== 'Admin') {
      navigate('/parkings');
      return;
    }

    const fetchAllParkings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener todos los estacionamientos (no solo los disponibles)
        const allParkings = await parkingService.getAllParkings();
        setParkings(allParkings);
      } catch (err) {
        setError('Error al cargar los estacionamientos');
      } finally {
        setLoading(false);
      }
    };

    fetchAllParkings();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Calcular paginación
  const totalPages = Math.ceil(parkings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParkings = parkings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Todos los Estacionamientos Registrados
          </h1>
          <div className="text-sm text-gray-600">
            Total: {parkings.length} estacionamientos
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${view === 'cards' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('cards')}
          >
            Vista Tarjetas
          </button>
          <button
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${view === 'table' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setView('table')}
          >
            Vista Tabla
          </button>
        </div>
      </div>

      {/* Vista de Tarjetas */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentParkings.map((parking) => (
            <div key={parking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {parking.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{parking.address}</p>
                  <p className="text-gray-500 text-sm">{parking.city}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Espacios: {parking.availableSpaces}/{parking.totalSpaces}</p>
                    <p>Lat: {parking.latitude.toFixed(4)}</p>
                    <p>Lng: {parking.longitude.toFixed(4)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-600 font-semibold">
                      S/ {parking.hourlyRate} x hora
                    </p>
                    <p className="text-sm text-gray-500">
                      S/ {parking.dailyRate} x día
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-xs text-gray-400">ID: {parking.id}</p>
                  <button
                    onClick={() => navigate(`/reservation/${parking.id}`)}
                    className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Tabla */}
      {view === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Dirección</th>
                <th className="px-4 py-2 border-b">Ciudad</th>
                <th className="px-4 py-2 border-b">Espacios</th>
                <th className="px-4 py-2 border-b">Latitud</th>
                <th className="px-4 py-2 border-b">Longitud</th>
                <th className="px-4 py-2 border-b">S/ Hora</th>
                <th className="px-4 py-2 border-b">S/ Día</th>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentParkings.map((parking) => (
                <tr key={parking.id} className="text-sm text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{parking.name}</td>
                  <td className="px-4 py-2 border-b">{parking.address}</td>
                  <td className="px-4 py-2 border-b">{parking.city}</td>
                  <td className="px-4 py-2 border-b text-center">{parking.availableSpaces}/{parking.totalSpaces}</td>
                  <td className="px-4 py-2 border-b">{parking.latitude.toFixed(4)}</td>
                  <td className="px-4 py-2 border-b">{parking.longitude.toFixed(4)}</td>
                  <td className="px-4 py-2 border-b">S/ {parking.hourlyRate}</td>
                  <td className="px-4 py-2 border-b">S/ {parking.dailyRate}</td>
                  <td className="px-4 py-2 border-b text-xs text-gray-400">{parking.id}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => navigate(`/reservation/${parking.id}`)}
                      className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      Reservar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {parkings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay estacionamientos registrados</p>
        </div>
      )}
    </div>
  );
};

export default AllParkings; 