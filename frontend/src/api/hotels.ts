import { apiFetch } from "./client";
import type { HotelDto, PageResponse } from "./types";

export function getHotels(page = 0, size = 12) {
  return apiFetch<PageResponse<HotelDto>>(`/hotels/?page=${page}&size=${size}`);
}

export function getHotelById(id: number | string) {
  return apiFetch<HotelDto>(`/hotels/${id}`);
}
