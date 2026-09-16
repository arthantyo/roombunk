import { apiFetch } from "./client";
import type { ReservationStatus } from "./types";

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

export type ConversationResponse = {
  reservationId: number;
  otherUserId: number;
  otherUsername: string;
  lastMessage: string;
  lastMessageAt: string;
  reservationStatus: ReservationStatus;
};

export function getConversations() {
  return apiFetch<ConversationResponse[]>("/messages/conversations");
}
