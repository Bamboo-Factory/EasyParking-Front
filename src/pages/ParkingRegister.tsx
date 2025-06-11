import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { parkingService } from '../services/api';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number]>([-12.0464, -77.0428]); // Lima por defecto
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSpaces: '',
    pricePerHour: '',
    amenities: [] as string[],
  });

  const amenitiesOptions = [
    'Vigilancia 24/7',
    'Cámaras de seguridad',
    'Techado',
    'Acceso controlado',
    'Iluminación',
    'Seguridad electrónica',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const parkingData = {
        ...formData,
        latitude: position[0],
        longitude: position[1],
        totalSpaces: parseInt(formData.totalSpaces),
        pricePerHour: parseFloat(formData.pricePerHour),
        availableSpaces: parseInt(formData.totalSpaces),
        images: [], // Por ahora sin imágenes
      };

      await parkingService.registerParking(parkingData);
      navigate('/parkings');
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
              name="pricePerHour"
              value={formData.pricePerHour}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicios y Amenidades
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenitiesOptions.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
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