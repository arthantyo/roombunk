import type { ListingData } from "../../types";
import type { ListingDto } from "../../../../api/types";

export function createEmptyListing(): ListingData {
  return {
    propertyType: "apartment",
    placeAccessType: "entire",

    propertyDetails: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },

    roomDetails: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },

    amenities: [],
    title: "",
    description: "",
    pricePerNight: "100",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapListingToListing(listing: ListingDto): ListingData {
  return {
    propertyType:
      listing.propertyType === "house" || listing.propertyType === "hotel"
        ? listing.propertyType
        : "apartment",

    placeAccessType: "entire",

    propertyDetails: {
      name: listing.title ?? "",
      address: listing.address ?? "",
      city: listing.city ?? "",
      state: listing.province ?? "",
      zipCode: listing.postalCode ?? "",
      country: listing.country ?? "",
    },

    roomDetails: {
      guests: listing.maxGuests ?? listing.guests ?? 2,
      bedrooms: listing.bedrooms ?? 1,
      beds: listing.beds ?? 1,
      bathrooms: listing.bathrooms ?? 1,
    },

    amenities: listing.amenities ?? [],

    title: listing.title ?? "",
    description: listing.description ?? "",

    pricePerNight: String(listing.basePrice ?? 100),
  };
}
