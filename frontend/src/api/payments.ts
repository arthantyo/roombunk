import { apiFetch } from "./client";
export interface CreateCheckoutSessionRequest {
  listingId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface CheckoutSessionResponse {
  url: string;
}

export function createCheckoutSession(request: CreateCheckoutSessionRequest) {
  return apiFetch<CheckoutSessionResponse>(
    "/payments/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}
