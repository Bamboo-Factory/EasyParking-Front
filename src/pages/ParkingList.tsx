import { useState, useEffect } from 'react';
import { parkingService } from '../services/api';
import type { Parking } from '../services/api';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import ErrorMessage from '../components/atoms/ErrorMessage';
import ParkingListTemplate from '../components/templates/ParkingListTemplate';

const ParkingList = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        // Obtener ubicación del usuario
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            
            // Obtener estacionamientos cercanos
            const nearbyParkings = await parkingService.getNearbyParkings(
              latitude,
              longitude,
              1 // radio en kilómetros
            );
            
            setParkings(nearbyParkings);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Si no se puede obtener la ubicación, obtener todos los estacionamientos
            parkingService.getAllAvailableParkings()
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Calcular estacionamientos para la página actual
  const totalPages = Math.ceil(parkings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParkings = parkings.slice(startIndex, endIndex);

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ParkingListTemplate
      parkings={currentParkings}
      userLocation={userLocation}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default ParkingList; 