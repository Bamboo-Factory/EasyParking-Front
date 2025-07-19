import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { ClockIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { parkingService, userService } from '../services/api';
import type { Parking, User } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/atoms/ProtectedRoute';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import ErrorMessage from '../components/atoms/ErrorMessage';
import SuccessMessage from '../components/atoms/SuccessMessage';
import 'leaflet/dist/leaflet.css';

const ParkingReservation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Redirigir al login si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        if (!id) throw new Error('ID no proporcionado');
        const data = await parkingService.getParkingById(id);
        
        setParking(data);
      } catch (err) {
        setError('Error al cargar la información del estacionamiento');
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [id]);

  // Cargar todos los usuarios si el rol es admin
  useEffect(() => {
    if (user?.role === 'Admin') {
      const fetchUsers = async () => {
        try {
          const users = await userService.getAllUsers();
          setAllUsers(users);
        } catch (err) {
          console.error('Error al cargar usuarios:', err);
        }
      };
      fetchUsers();
    }
  }, [user]);

  // Filtrar usuarios basado en la búsqueda
  useEffect(() => {
    if (user?.role === 'Admin' && userSearch.length > 0) {
      const filtered = allUsers.filter((u: User) =>
        u.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      );
      setUserOptions(filtered);
    } else {
      setUserOptions([]);
    }
  }, [userSearch, allUsers, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalHours = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0, diffHours);
  };

  const calculateTotalPrice = () => {
    if (!parking) return 0;
    return calculateTotalHours() * parking.hourlyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parking || !id || !user) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const userIdToReserve = user.role === 'Admin' && selectedUser ? selectedUser.id : user.id;
      const reservation = await parkingService.createReservation({
        userId: userIdToReserve,
        parkingId: id,
        startTime: formData.startTime,
        endTime: formData.endTime,
        totalAmount: calculateTotalPrice(),
      });

      // Mostrar mensaje de éxito con el número del espacio
      if (reservation.parkingSpace && reservation.parkingSpace.spaceNumber) {
        const spaceNumber = reservation.parkingSpace.spaceNumber;
        setSuccessMessage(`¡Reserva creada exitosamente! Tu espacio asignado es: ${spaceNumber}. Serás redirigido en 3 segundos...`);
      } else {
        setSuccessMessage('¡Reserva creada exitosamente! Serás redirigido en 3 segundos...');
      }
      
      // Redirigir después de 5 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        if (user.role === 'Admin') {
          navigate('/reservations');
        } else {
          navigate('/parkings');
        }
      }, 5000);
    } catch (err) {
      setError('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !parking) {
    return <ErrorMessage message={error || 'Estacionamiento no encontrado'} />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reservar Estacionamiento
        </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Información del estacionamiento */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {parking.name}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                <p className="text-gray-600">{parking.address}</p>
              </div>

              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">
                  S/ {parking.hourlyRate} por hora
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">
                  {parking.totalSpaces} espacios totales
                </p>
              </div>
            </div>

            {/* {parking.amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Servicios y Amenidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parking.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          <div className="h-[300px] rounded-lg overflow-hidden shadow-md">
            <MapContainer
              center={[parking.latitude, parking.longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[parking.latitude, parking.longitude]} />
            </MapContainer>
          </div>
        </div>

        {/* Formulario de reserva */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Detalles de la Reserva
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {user.role === 'Admin' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar usuario</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Escribe el nombre del usuario..."
                  value={userSearch}
                  onChange={e => {
                    setUserSearch(e.target.value);
                    setSelectedUser(null);
                  }}
                />
                {userLoading && <div className="text-xs text-gray-500 mt-1">Buscando...</div>}
                {userOptions.length > 0 && (
                  <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto shadow z-10">
                    {userOptions.map(option => (
                      <li
                        key={option.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-primary-100 ${selectedUser?.id === option.id ? 'bg-primary-200' : ''}`}
                        onClick={() => {
                          setSelectedUser(option);
                          setUserSearch(`${option.firstName} ${option.lastName}`);
                          setUserOptions([]);
                        }}
                      >
                        {option.firstName} {option.lastName} <span className="text-xs text-gray-500">({option.email})</span>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedUser && (
                  <div className="text-xs text-green-600 mt-1">Usuario seleccionado: {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})</div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha y Hora de Inicio
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                min={new Date().toDateString().slice(0, 16)}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha y Hora de Fin
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                min={formData.startTime || new Date().toISOString().slice(0, 16)}
                className="input mt-1"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Horas totales:</span>
                <span>{calculateTotalHours().toFixed(1)} horas</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total a pagar:</span>
                <span>S/ {calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <SuccessMessage message={successMessage} />
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/parkings')}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.startTime || !formData.endTime || !user || (user.role === 'Admin' && !selectedUser)}
                className="btn btn-primary"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default ParkingReservation; 