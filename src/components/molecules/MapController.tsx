import { useMap } from 'react-leaflet';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface MapControllerProps {
  userLocation: [number, number] | null;
}

const MapController = ({ userLocation }: MapControllerProps) => {
  const map = useMap();

  const centerOnUser = () => {
    if (userLocation) {
      map.setView(userLocation, 17);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={centerOnUser}
        disabled={!userLocation}
        className="bg-white hover:bg-gray-50 disabled:bg-gray-200 text-gray-700 disabled:text-gray-400 p-2 rounded-lg shadow-md border border-gray-300 transition-colors"
        title="Centrar en mi ubicación"
      >
        <MapPinIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MapController; 