import { apiFetch } from "./client";
import { mockHotels, mockResponse, useMockData } from "./mockData";
import type { HotelDto, PageResponse } from "./types";

export type CreateHotelRequest = Omit<HotelDto, "id">;

export function getHotels(page = 0, size = 12) {
  if (useMockData) {
    const start = page * size;
    return mockResponse({
      content: mockHotels.slice(start, start + size),
      totalPages: Math.ceil(mockHotels.length / size),
      totalElements: mockHotels.length,
      number: page,
      size,
    });
  }

  return apiFetch<PageResponse<HotelDto>>(`/hotels/?page=${page}&size=${size}`);
}

export function getHotelById(id: number | string) {
  if (useMockData) {
    return mockResponse(mockHotels.find((hotel) => hotel.id === Number(id)));
  }

  return apiFetch<HotelDto>(`/hotels/${id}`);
}

export function createHotel(hotel: CreateHotelRequest) {
  if (useMockData) {
    return mockResponse({ id: Date.now(), ...hotel });
  }

  return apiFetch<HotelDto>("/hotels/", {
    method: "POST",
    body: JSON.stringify(hotel),
  });
}
