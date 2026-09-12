import { apiFetch } from "./client";
import type { ReservationDto } from "./types";

export function getMyReservations() {
  return apiFetch<ReservationDto[]>("/reservations/");
}

export function getListingAvailability(
  listingId: number | string,
  from: string,
  to: string,
) {
  return apiFetch<{ start: string; end: string }[]>(
    `/reservations/listing/${listingId}/availability?from=${from}&to=${to}`,
  );
}

export function acceptReservation(id: number) {
  return apiFetch<ReservationDto>(`/reservations/${id}/accept`, {
    method: "PATCH",
  });
}

export function rejectReservation(id: number) {
  return apiFetch<ReservationDto>(`/reservations/${id}/reject`, {
    method: "PATCH",
  });
}

export function cancelReservation(id: number) {
  return apiFetch<ReservationDto>(`/reservations/${id}/cancel`, {
    method: "PATCH",
  });
}
