import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { Parking } from '../../services/api';
import { userIcon } from '../../utils/mapIcons';
import MapController from '../molecules/MapController';
import 'leaflet/dist/leaflet.css';

interface ParkingMapProps {
  parkings: Parking[];
  userLocation: [number, number] | null;
}

const ParkingMap = ({ parkings, userLocation }: ParkingMapProps) => {
  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-lg relative">
      <MapContainer
        center={userLocation || [-12.0464, -77.0428]} // Lima por defecto
        zoom={17}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController userLocation={userLocation} />
        
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
                  S/ {parking.hourlyRate} por hora
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
        
        {/* Marker para la posición actual del usuario */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-blue-600">Tu ubicación</h3>
                <p className="text-sm text-gray-600">
                  Lat: {userLocation[0].toFixed(6)}, Lng: {userLocation[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ParkingMap; 