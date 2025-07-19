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
  city: string;
  latitude: number;
  longitude: number;
  totalSpaces: number;
  availableSpaces: number;
  hourlyRate: number;
  dailyRate: number;
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
  parking: Parking;
  paymentStatus?: string;
  notes?: string;
  user: User;
}

export interface ParkingSpace {
  id: string;
  spaceNumber: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const userService = {
  // Obtener todos los usuarios
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/Users");
    return response.data;
  },
};

export const parkingService = {
  // Obtener todos los estacionamientos disponibles
  getAllAvailableParkings: async (): Promise<Parking[]> => {
    const response = await api.get("/Parkings/available");
    return response.data;
  },

  // Obtener todos los estacionamientos (para administradores)
  getAllParkings: async (): Promise<Parking[]> => {
    const response = await api.get("/Parkings");
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
    parkingData: Omit<Parking, "id" | "availableSpaces">
  ): Promise<Parking> => {
    const response = await api.post("/parkings", parkingData);
    return response.data;
  },

  // Crear una reserva
  createReservation: async (
    reservationData: Omit<Reservation, "id" | "status" | "parkingSpace" | "parking" | "user">
  ): Promise<Reservation> => {
    const response = await api.post("/reservations", reservationData);
    return response.data;
  },

  // Obtener reservas de un usuario
  getUserReservations: async (): Promise<Reservation[]> => {
    const response = await api.get("/reservations/user");
    return response.data;
  },

  // Obtener reservas de un usuario por ID
  getReservationsByUserId: async (
    userId: string | number
  ): Promise<Reservation[]> => {
    const response = await api.get(`/reservations/user/${userId}`);
    return response.data;
  },

  // Cancelar una reserva
  cancelReservation: async (id: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  },

  // Obtener todas las reservaciones (admin/general)
  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await api.get("/reservations");
    return response.data;
  },
};

export { api };

export default parkingService;
