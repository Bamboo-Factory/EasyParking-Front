import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Parking } from '../../services/api';

interface ParkingCardProps {
  parking: Parking;
}

const ParkingCard = ({ parking }: ParkingCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {parking.name}
          </h3>
          <p className="text-gray-600">{parking.address}</p>
        </div>
        <span className="text-primary-600 font-semibold">
          S/ {parking.hourlyRate} x hora
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
  );
};

export default ParkingCard; 