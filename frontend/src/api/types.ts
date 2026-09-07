export interface HotelDto {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface WishlistDto {
  id: number;
  name: string;
  hotelIds: number[];
}

export interface RoomDto {
  id: number;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  hotelId: number;
}

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface ReservationDto {
  id: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface ReservationHoldResponse {
  holdToken: string;
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  expiresAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  idempotencyKey: string;
  amount: number;
  currency: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface AuthResponse {
  token: string;
}
