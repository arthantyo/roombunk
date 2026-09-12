import ApartmentIcon from "@mui/icons-material/Apartment";
import HotelIcon from "@mui/icons-material/Hotel";

import type { PropertyType } from "./types";
import { House } from "@mui/icons-material";

export const propertyTypes: {
  value: PropertyType;
  label: string;
  icon: typeof ApartmentIcon;
}[] = [
  {
    value: "apartment",
    label: "Apartment",
    icon: ApartmentIcon,
  },
  {
    value: "house",
    label: "House",
    icon: House,
  },
  {
    value: "hotel",
    label: "Hotel",
    icon: HotelIcon,
  },
];

export const hostingSteps = [
  "Property type",
  "Guest access",
  "Property details",
  "Place basics",
  "Amenities",
  "Title",
  "Description",
  "Pricing",
];
