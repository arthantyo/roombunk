import { apiFetch } from "./client";
import type { ListingDto } from "./types";

export type CreateListingRequest = Omit<ListingDto, "id">;

export function getListings() {
  return apiFetch<ListingDto[]>("/listings");
}

export function getListingById(id: number | string) {
  return apiFetch<ListingDto>(`/listings/${id}`);
}

export function createListing(listing: CreateListingRequest) {
  return apiFetch<ListingDto>("/listings", {
    method: "POST",
    body: JSON.stringify(listing),
  });
}

export function updateListing(
  id: number | string,
  listing: Partial<CreateListingRequest>,
) {
  return apiFetch<ListingDto>(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(listing),
  });
}

export function deleteListing(id: number | string) {
  return apiFetch<void>(`/listings/${id}`, { method: "DELETE" });
}
