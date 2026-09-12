import { apiFetch } from "./client";
import { mockResponse, mockRooms, useMockData } from "./mockData";
import type { RoomDto } from "./types";

export type CreateRoomRequest = Omit<RoomDto, "id">;

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

export function createRoom(room: CreateRoomRequest) {
  if (useMockData) {
    return mockResponse({ id: Date.now(), ...room });
  }

  return apiFetch<RoomDto>("/rooms/", {
    method: "POST",
    body: JSON.stringify(room),
  });
}
