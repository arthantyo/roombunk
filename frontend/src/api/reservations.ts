import { apiFetch } from "./client";
import type { ReservationDto, ReservationHoldResponse } from "./types";

export interface CreateHoldRequest {
  room: { id: number; hotel: { id: number } };
  checkInDate: string;
  checkOutDate: string;
}

export function createHold(request: CreateHoldRequest) {
  return apiFetch<ReservationHoldResponse>("/reservations/hold", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getMyReservations() {
  return apiFetch<ReservationDto[]>("/reservations/");
}

export function getRoomAvailability(
  roomId: number | string,
  from: string,
  to: string,
) {
  return apiFetch<{ start: string; end: string }[]>(
    `/reservations/room/${roomId}/availability?from=${from}&to=${to}`,
  );
}
