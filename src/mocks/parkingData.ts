export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalSpaces: number;
  availableSpaces: number;
  pricePerHour: number;
  rating: number;
  images: string[];
  amenities: string[];
  isOpen: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const mockParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Estacionamiento Centro Comercial Plaza",
    address: "Av. Principal 123, Lima",
    latitude: -12.0464,
    longitude: -77.0428,
    totalSpaces: 100,
    availableSpaces: 45,
    pricePerHour: 5.00,
    rating: 4.5,
    images: [
      "https://example.com/parking1.jpg",
      "https://example.com/parking1-2.jpg"
    ],
    amenities: ["Vigilancia 24/7", "CCTV", "Techado", "Acceso para discapacitados"],
    isOpen: true,
    owner: {
      id: "OWNER1",
      name: "Empresa Parking Solutions",
      email: "contacto@parkingsolutions.com",
      phone: "+51 999 888 777"
    }
  },
  {
    id: "2",
    name: "Parking Express Miraflores",
    address: "Calle Los Robles 456, Miraflores",
    latitude: -12.1224,
    longitude: -77.0305,
    totalSpaces: 50,
    availableSpaces: 20,
    pricePerHour: 7.50,
    rating: 4.8,
    images: [
      "https://example.com/parking2.jpg"
    ],
    amenities: ["Vigilancia 24/7", "CCTV", "Techado", "Lavado de autos"],
    isOpen: true,
    owner: {
      id: "OWNER2",
      name: "Parking Express SAC",
      email: "info@parkingexpress.com",
      phone: "+51 999 777 666"
    }
  }
]; 