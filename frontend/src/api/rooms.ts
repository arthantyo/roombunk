import { apiFetch } from "./client";
import type { RoomDto } from "./types";

export function getRoomsByHotelId(hotelId: number | string) {
  return apiFetch<RoomDto[]>(`/rooms/hotel/${hotelId}`);
}

export function getRoomById(id: number | string) {
  return apiFetch<RoomDto>(`/rooms/${id}`);
}
