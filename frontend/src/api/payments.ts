import { apiFetch } from "./client";
import type { PaymentIntentResponse } from "./types";

export interface CreatePaymentIntentRequest {
  listingId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export function createPaymentIntent(request: CreatePaymentIntentRequest) {
  return apiFetch<PaymentIntentResponse>("/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
