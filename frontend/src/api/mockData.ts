import type { HotelDto, RoomDto } from "./types";

export const useMockData =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA !== "false";

export function mockResponse<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 2000);
  });
}

export const mockHotels: HotelDto[] = [
  {
    id: 101,
    name: "The Hoxton Shoreditch",
    address: "199-206 High Holborn",
    city: "London",
    state: "England",
    zipCode: "EC1V 9BD",
    country: "United Kingdom",
  },
  {
    id: 102,
    name: "Casa Bonay",
    address: "Gran Via de les Corts Catalanes, 700",
    city: "Barcelona",
    state: "Catalonia",
    zipCode: "08010",
    country: "Spain",
  },
  {
    id: 103,
    name: "The Hoxton, Williamsburg",
    address: "97 Wythe Avenue",
    city: "Brooklyn",
    state: "New York",
    zipCode: "11249",
    country: "United States",
  },
  {
    id: 104,
    name: "Hotel Sanders",
    address: "Tordenskjoldsgade 15",
    city: "Copenhagen",
    state: "Capital Region",
    zipCode: "1055",
    country: "Denmark",
  },
  {
    id: 105,
    name: "The Henrietta Hotel",
    address: "14-15 Henrietta Street",
    city: "London",
    state: "England",
    zipCode: "WC2E 8QH",
    country: "United Kingdom",
  },
  {
    id: 106,
    name: "Ace Hotel Kyoto",
    address: "245-2 Kurumayacho",
    city: "Kyoto",
    state: "Kyoto",
    zipCode: "604-8185",
    country: "Japan",
  },
];

const roomTypes = [
  { suffix: "Cozy", capacity: 2, price: 145 },
  { suffix: "Deluxe", capacity: 3, price: 210 },
  { suffix: "Suite", capacity: 4, price: 325 },
];

export const mockRooms: RoomDto[] = mockHotels.flatMap((hotel) =>
  roomTypes.map((room, index) => ({
    id: hotel.id * 10 + index + 1,
    name: `${room.suffix} ${hotel.name.split(" ")[0]} Room`,
    description: `A lovely ${room.suffix.toLowerCase()} room in ${hotel.city} with great amenities.`,
    address: hotel.address,
    propertyType: "apartment",
    roomType: `${room.suffix} ${hotel.name.split(" ")[0]} Room`,
    capacity: room.capacity,
    pricePerNight: room.price + (hotel.id % 3) * 15,
    amenities: ["WIFI", "KITCHEN", "TV", "AIR_CONDITIONING"],
    hotelId: hotel.id,
  })),
);
