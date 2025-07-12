import type { Parking } from '../../services/api';
import ParkingCard from '../molecules/ParkingCard';
import Pagination from '../molecules/Pagination';

interface ParkingListProps {
  parkings: Parking[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ParkingList = ({ parkings, currentPage, totalPages, onPageChange }: ParkingListProps) => {
  return (
    <div className="space-y-4">
      {parkings.map((parking) => (
        <ParkingCard key={parking.id} parking={parking} />
      ))}
      
      {/* Paginador */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ParkingList; 