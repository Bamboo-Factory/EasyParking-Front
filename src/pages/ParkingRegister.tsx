import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { parkingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

// Componente para manejar los eventos del mapa
const MapEvents = ({ onPositionChange }: { onPositionChange: (position: [number, number]) => void }) => {
  useMapEvents({
    click: (e) => {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const ParkingRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number]>([-12.0464, -77.0428]); // Lima por defecto
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    totalSpaces: '',
    hourlyRate: '',
    dailyRate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const parkingData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: position[0],
        longitude: position[1],
        totalSpaces: parseInt(formData.totalSpaces),
        hourlyRate: parseFloat(formData.hourlyRate),
        dailyRate: parseFloat(formData.dailyRate),
      };

      await parkingService.registerParking(parkingData);
      navigate('/all-parkings');
    } catch (err) {
      setError('Error al registrar el estacionamiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Registrar Nuevo Estacionamiento
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Estacionamiento
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="input mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Espacios
            </label>
            <input
              type="number"
              name="totalSpaces"
              value={formData.totalSpaces}
              onChange={handleInputChange}
              required
              min="1"
              className="input mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio por Hora (S/)
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="input mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tarifa por Día (S/)
            </label>
            <input
              type="number"
              name="dailyRate"
              value={formData.dailyRate}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="input mt-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <div className="h-[300px] rounded-lg overflow-hidden shadow-md">
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position} />
              <MapEvents onPositionChange={setPosition} />
            </MapContainer>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Haz clic en el mapa para seleccionar la ubicación exacta
          </p>
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
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Registrando...' : 'Registrar Estacionamiento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParkingRegister; 