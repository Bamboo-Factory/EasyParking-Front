import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { ClockIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { parkingService } from '../services/api';
import type { Parking } from '../services/api';
import 'leaflet/dist/leaflet.css';
import { mockParkingSpots } from '../mocks/parkingData';

const ParkingReservation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchParking = async () => {
      try {
        if (!id) throw new Error('ID no proporcionado');
        // const data = await parkingService.getParkingById(id);
        const data = mockParkingSpots.find(parking => parking.id === id);
        setParking(data);
      } catch (err) {
        setError('Error al cargar la información del estacionamiento');
      } finally {
        setLoading(false);
      }
    };

    fetchParking();
  }, [id]);

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
    return calculateTotalHours() * parking.pricePerHour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parking || !id) return;

    try {
      setLoading(true);
      await parkingService.createReservation({
        parkingId: id,
        startTime: formData.startTime,
        endTime: formData.endTime,
        totalPrice: calculateTotalPrice(),
      });
      navigate('/parkings');
    } catch (err) {
      setError('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !parking) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Estacionamiento no encontrado'}
      </div>
    );
  }

  return (
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
                  S/ {parking.pricePerHour} por hora
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">
                  {parking.availableSpaces} espacios disponibles
                </p>
              </div>
            </div>

            {parking.amenities.length > 0 && (
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
            )}
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
                min={new Date().toISOString().slice(0, 16)}
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
                disabled={loading || !formData.startTime || !formData.endTime}
                className="btn btn-primary"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParkingReservation; 