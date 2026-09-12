export type PropertyType = "apartment" | "house" | "hotel";

export type PropertyDetails = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type RoomDetails = {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
};

export type PlaceAccessType = "entire" | "private-room" | "shared-room";
