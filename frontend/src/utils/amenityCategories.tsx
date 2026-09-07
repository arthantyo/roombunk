import type { AmenityType } from "./amenityMap";

export type AmenityCategory = {
  title: string;
  amenities: AmenityType[];
};

export const amenityCategories: AmenityCategory[] = [
  {
    title: "Internet & entertainment",
    amenities: ["WIFI", "TV"],
  },
  {
    title: "Heating & cooling",
    amenities: ["AIR_CONDITIONING", "HEATING", "FIREPLACE"],
  },
  {
    title: "Kitchen & dining",
    amenities: ["KITCHEN", "MICROWAVE", "COFFEE_MAKER", "DINING_AREA"],
  },
  {
    title: "Bathroom",
    amenities: ["BATHTUB", "SHOWER"],
  },
  {
    title: "Laundry",
    amenities: ["WASHER", "DRYER", "IRON"],
  },
  {
    title: "Outdoor",
    amenities: ["BALCONY", "GARDEN", "BBQ", "BEACH_ACCESS"],
  },
  {
    title: "Facilities",
    amenities: ["POOL", "HOT_TUB", "GYM", "SPA", "ELEVATOR"],
  },
  {
    title: "Parking",
    amenities: ["FREE_PARKING", "GARAGE", "EV_CHARGER"],
  },
  {
    title: "Workspace",
    amenities: ["WORKSPACE"],
  },
  {
    title: "Family",
    amenities: ["CRIB"],
  },
  {
    title: "Pets",
    amenities: ["PETS_ALLOWED"],
  },
  {
    title: "Safety",
    amenities: ["SMOKE_ALARM", "SECURITY_SYSTEM"],
  },
  {
    title: "Accessibility",
    amenities: ["STEP_FREE_ACCESS"],
  },
];
