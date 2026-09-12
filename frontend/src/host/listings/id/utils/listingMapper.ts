import type { ListingData } from "../../types";

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
export function mapHotelToListing(hotel: any, rooms: any[]): ListingData {
  const room = rooms?.[0];

  return {
    propertyType:
      room?.propertyType === "house" || room?.propertyType === "hotel"
        ? room.propertyType
        : "apartment",

    placeAccessType: "entire",

    propertyDetails: {
      name: hotel.name ?? "",
      address: hotel.address ?? "",
      city: hotel.city ?? "",
      state: hotel.state ?? "",
      zipCode: hotel.zipCode ?? "",
      country: hotel.country ?? "",
    },

    roomDetails: {
      guests: room?.capacity ?? 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },

    amenities: room?.amenities ?? [],

    title: room?.name ?? hotel.name ?? "",
    description: room?.description ?? "",

    pricePerNight: String(room?.pricePerNight ?? 100),

    roomId: room?.id,
  };
}
