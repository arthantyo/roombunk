import { apiFetch } from "./client";
import type { WishlistDto, WishlistGroupDto } from "./types";

export interface CreateWishlistGroupRequest {
  name: string;
}

export interface AddListingToWishlistRequest {
  listingId: number;
  groupId: number;
}

export function getMyWishlists() {
  return apiFetch<WishlistDto[]>("/wishlist");
}

export function getMyWishlistGroups() {
  return apiFetch<WishlistGroupDto[]>("/wishlist/groups");
}

export function createWishlistGroup(request: CreateWishlistGroupRequest) {
  return apiFetch<WishlistGroupDto>("/wishlist/groups", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function addListingToWishlist(request: AddListingToWishlistRequest) {
  return apiFetch<WishlistDto>("/wishlist", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function removeListingFromWishlist(listingId: number) {
  return apiFetch<void>(`/wishlist/${listingId}`, {
    method: "DELETE",
  });
}

export function removeWishlistGroup(groupId: number) {
  return apiFetch<void>(`/wishlist/groups/${groupId}`, {
    method: "DELETE",
  });
}
