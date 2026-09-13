import type { AmenityType } from "../utils/amenityMap";
export type ListingStatus = "DRAFT" | "LIVE";

export interface ListingDto {
  id: number;
  title: string;
  description?: string;
  propertyType?: string;
  guestAccess?: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  country: string;
  guests?: number;
  maxGuests?: number;
  beds?: number;
  bathrooms?: number;
  bedrooms?: number;
  petFriendly?: boolean;
  amenities?: AmenityType[];
  basePrice: number;
  extraGuestPrice?: number;
  status: ListingStatus;

  verified?: boolean;
}

export interface WishlistGroupDto {
  id: number;
  name: string;
}

export interface WishlistDto {
  id: number;
  listing: ListingDto;
  group: WishlistGroupDto;
}

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED";

export interface ReservationDto {
  id: number;
  userId: number;
  listingId: number;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  createdAt: string;
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
