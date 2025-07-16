import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7041/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Parking {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalSpaces: number;
  availableSpaces: number;
  hourlyRate: number;
  images: string[];
  amenities: string[];
}

export interface Reservation {
  id: string;
  userId: string;
  parkingId: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
  parkingSpace: ParkingSpace;
}

export interface ParkingSpace {
  id: string;
  spaceNumber: string;
  isAvailable: boolean;
}

export const parkingService = {
  // Obtener todos los estacionamientos
  getAllAvailableParkings: async (): Promise<Parking[]> => {
    const response = await api.get("/Parkings/available");
    return response.data;
  },

  // Obtener estacionamientos cercanos
  getNearbyParkings: async (
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Parking[]> => {
    const response = await api.get("/Parkings/search/location", {
      params: { latitude, longitude, radiusKm },
    });
    return response.data;
  },

  // Obtener un estacionamiento por ID
  getParkingById: async (id: string): Promise<Parking> => {
    const response = await api.get(`/Parkings/${id}`);
    return response.data;
  },

  // Registrar un nuevo estacionamiento
  registerParking: async (
    parkingData: Omit<Parking, "id">
  ): Promise<Parking> => {
    const response = await api.post("/parkings", parkingData);
    return response.data;
  },

  // Crear una reserva
  createReservation: async (
    reservationData: Omit<Reservation, "id" | "status" | "parkingSpace">
  ): Promise<Reservation> => {
    const response = await api.post("/reservations", reservationData);
    return response.data;
  },

  // Obtener reservas de un usuario
  getUserReservations: async (): Promise<Reservation[]> => {
    const response = await api.get("/reservations/user");
    return response.data;
  },

  // Cancelar una reserva
  cancelReservation: async (id: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  },
};

export { api };

export default parkingService;
