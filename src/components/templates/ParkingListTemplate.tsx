import PageTitle from "../atoms/PageTitle";
import ParkingMap from "../organisms/ParkingMap";
import ParkingList from "../organisms/ParkingList";
import type { Parking } from "../../services/api";
import UserReservationsList from "./UserReservationsList";

interface ParkingListTemplateProps {
  parkings: Parking[];
  userLocation: [number, number] | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ParkingListTemplate = ({
  parkings,
  userLocation,
  currentPage,
  totalPages,
  onPageChange,
}: ParkingListTemplateProps) => {
  return (
    <div className="space-y-6">
      <PageTitle title="Estacionamientos Cercanos" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa */}
        <ParkingMap parkings={parkings} userLocation={userLocation} />

        {/* Lista de estacionamientos */}
        <ParkingList
          parkings={parkings}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
      {/* Reservaciones del usuario */}
      <UserReservationsList />
    </div>
  );
};

export default ParkingListTemplate;
