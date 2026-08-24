import { apiFetch } from "./client";
import type { PaymentIntentResponse } from "./types";

export interface CreatePaymentIntentRequest {
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  holdToken: string;
}

export function createPaymentIntent(request: CreatePaymentIntentRequest) {
  return apiFetch<PaymentIntentResponse>("/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
