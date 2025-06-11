export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'owner' | 'admin';
  vehicles: {
    plate: string;
    brand: string;
    model: string;
    color: string;
  }[];
  paymentMethods: {
    id: string;
    type: 'credit' | 'debit';
    lastFourDigits: string;
    expiryDate: string;
  }[];
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: "USER1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+51 999 123 456",
    role: "user",
    vehicles: [
      {
        plate: "ABC-123",
        brand: "Toyota",
        model: "Corolla",
        color: "Blanco"
      },
      {
        plate: "XYZ-789",
        brand: "Honda",
        model: "Civic",
        color: "Negro"
      }
    ],
    paymentMethods: [
      {
        id: "PM1",
        type: "credit",
        lastFourDigits: "1234",
        expiryDate: "12/25"
      }
    ],
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "OWNER1",
    name: "Empresa Parking Solutions",
    email: "contacto@parkingsolutions.com",
    phone: "+51 999 888 777",
    role: "owner",
    vehicles: [],
    paymentMethods: [],
    createdAt: "2024-01-01T08:00:00Z"
  }
]; 