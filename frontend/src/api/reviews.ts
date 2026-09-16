import { apiFetch } from "./client";
import type { ReviewDto } from "./types";

export function getReviewsByListingId(listingId: number | string) {
  return apiFetch<ReviewDto[]>(`/reviews/listing/${listingId}`);
}
