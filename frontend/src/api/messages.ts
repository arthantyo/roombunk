import { apiFetch } from "./client";

export interface ApiMessage {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface SendMessageRequest {
  reservationId: number;
  content: string;
}

export function getReservationMessages(reservationId: number) {
  return apiFetch<ApiMessage[]>(`/messages/reservation/${reservationId}`);
}

export function sendMessage(request: SendMessageRequest) {
  return apiFetch<ApiMessage>("/messages", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
