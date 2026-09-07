import { apiFetch } from "./client";
import type { WishlistDto } from "./types";

export interface CreateWishlistRequest {
  name: string;
  hotelId: number;
}

export interface AddHotelToWishlistRequest {
  hotelId: number;
}

export function getMyWishlists() {
  return apiFetch<WishlistDto[]>("/wishlist");
}

export function createWishlist(request: CreateWishlistRequest) {
  return apiFetch<WishlistDto>("/wishlist", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function addHotelToWishlist(
  wishlistId: number,
  request: AddHotelToWishlistRequest,
) {
  return apiFetch<WishlistDto>(`/wishlist/${wishlistId}/hotels`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
