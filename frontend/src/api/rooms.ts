import { apiFetch } from "./client";
import { mockResponse, mockRooms, useMockData } from "./mockData";
import type { RoomDto } from "./types";

export function getRoomsByHotelId(hotelId: number | string) {
  if (useMockData) {
    return mockResponse(
      mockRooms.filter((room) => room.hotelId === Number(hotelId)),
    );
  }

  return apiFetch<RoomDto[]>(`/rooms/hotel/${hotelId}`);
}

export function getRoomById(id: number | string) {
  if (useMockData) {
    return mockResponse(mockRooms.find((room) => room.id === Number(id)));
  }

  return apiFetch<RoomDto>(`/rooms/${id}`);
}
