import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { parkingService } from '../services/api';
import type { Parking } from '../services/api';
import 'leaflet/dist/leaflet.css';
import { mockParkingSpots } from '../mocks/parkingData';

const ParkingList = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        // Obtener ubicación del usuario
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            
            // Obtener estacionamientos cercanos
            // const nearbyParkings = await parkingService.getNearbyParkings(
            //   latitude,
            //   longitude,
            //   5 // radio en kilómetros
            // );
            
            setParkings(mockParkingSpots);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Si no se puede obtener la ubicación, obtener todos los estacionamientos
            parkingService.getAllParkings()
              .then(setParkings)
              .catch(setError)
              .finally(() => setLoading(false));
          }
        );
      } catch (err) {
        setError('Error al cargar los estacionamientos');
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Estacionamientos Cercanos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa */}
        <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={userLocation || [-12.0464, -77.0428]} // Lima por defecto
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {parkings.map((parking) => (
              <Marker
                key={parking.id}
                position={[parking.latitude, parking.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{parking.name}</h3>
                    <p className="text-sm text-gray-600">{parking.address}</p>
                    <p className="text-sm text-primary-600">
                      S/ {parking.pricePerHour} por hora
                    </p>
                    <Link
                      to={`/reservation/${parking.id}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Reservar
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Lista de estacionamientos */}
        <div className="space-y-4">
          {parkings.map((parking) => (
            <div
              key={parking.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {parking.name}
                  </h3>
                  <p className="text-gray-600">{parking.address}</p>
                </div>
                <span className="text-primary-600 font-semibold">
                  S/ {parking.pricePerHour}/hora
                </span>
              </div>

              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{parking.availableSpaces} espacios disponibles</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>24/7</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  to={`/reservation/${parking.id}`}
                  className="btn btn-primary"
                >
                  Reservar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkingList; 