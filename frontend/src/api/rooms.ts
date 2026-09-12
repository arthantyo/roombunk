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

export function updateRoom(id: number | string, room: Partial<RoomDto>) {
  if (useMockData) {
    const existing = mockRooms.find((r) => r.id === Number(id));
    if (existing) {
      Object.assign(existing, room);
      return mockResponse(existing);
    }
    return mockResponse({ id: Number(id), ...room } as RoomDto);
  }

  return apiFetch<RoomDto>(`/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(room),
  });
}
