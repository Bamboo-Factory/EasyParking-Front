export interface Reservation {
  id: string;
  parkingSpotId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  vehicle: {
    plate: string;
    brand: string;
    model: string;
    color: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export const mockReservations: Reservation[] = [
  {
    id: "RES1",
    parkingSpotId: "1",
    userId: "USER1",
    startTime: "2024-03-20T10:00:00Z",
    endTime: "2024-03-20T12:00:00Z",
    status: "confirmed",
    totalPrice: 10.00,
    vehicle: {
      plate: "ABC-123",
      brand: "Toyota",
      model: "Corolla",
      color: "Blanco"
    },
    paymentStatus: "paid",
    createdAt: "2024-03-19T15:30:00Z"
  },
  {
    id: "RES2",
    parkingSpotId: "2",
    userId: "USER1",
    startTime: "2024-03-21T14:00:00Z",
    endTime: "2024-03-21T16:00:00Z",
    status: "pending",
    totalPrice: 15.00,
    vehicle: {
      plate: "XYZ-789",
      brand: "Honda",
      model: "Civic",
      color: "Negro"
    },
    paymentStatus: "pending",
    createdAt: "2024-03-20T09:15:00Z"
  }
]; 