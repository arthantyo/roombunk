import {
  AcUnit,
  Balcony,
  Bathtub,
  BeachAccess,
  CoffeeMaker,
  Crib,
  Desk,
  Dining,
  DoorFront,
  DryCleaning,
  Elevator,
  EvStation,
  Fireplace,
  FitnessCenter,
  Garage,
  HotTub,
  Iron,
  Kitchen,
  LocalLaundryService,
  LocalParking,
  Lock,
  Microwave,
  OutdoorGrill,
  Pets,
  Pool,
  Security,
  Shower,
  Spa,
  Thermostat,
  Tv,
  Wifi,
  Yard,
} from "@mui/icons-material";

export const amenityMap = {
  // Internet & entertainment
  WIFI: {
    label: "Wifi",
    icon: Wifi,
  },
  TV: {
    label: "TV",
    icon: Tv,
  },

  // Climate
  AIR_CONDITIONING: {
    label: "Air conditioning",
    icon: AcUnit,
  },
  HEATING: {
    label: "Heating",
    icon: Thermostat,
  },
  FIREPLACE: {
    label: "Indoor fireplace",
    icon: Fireplace,
  },

  // Kitchen
  KITCHEN: {
    label: "Kitchen",
    icon: Kitchen,
  },

  MICROWAVE: {
    label: "Microwave",
    icon: Microwave,
  },

  COFFEE_MAKER: {
    label: "Coffee maker",
    icon: CoffeeMaker,
  },
  DINING_AREA: {
    label: "Dining area",
    icon: Dining,
  },

  // Bathroom
  BATHTUB: {
    label: "Bathtub",
    icon: Bathtub,
  },
  SHOWER: {
    label: "Shower",
    icon: Shower,
  },

  // Laundry
  WASHER: {
    label: "Washer",
    icon: LocalLaundryService,
  },
  DRYER: {
    label: "Dryer",
    icon: DryCleaning,
  },
  IRON: {
    label: "Iron",
    icon: Iron,
  },

  // Outdoor
  BALCONY: {
    label: "Balcony",
    icon: Balcony,
  },
  GARDEN: {
    label: "Garden",
    icon: Yard,
  },
  BBQ: {
    label: "BBQ grill",
    icon: OutdoorGrill,
  },
  BEACH_ACCESS: {
    label: "Beach access",
    icon: BeachAccess,
  },

  // Facilities
  POOL: {
    label: "Pool",
    icon: Pool,
  },
  HOT_TUB: {
    label: "Hot tub",
    icon: HotTub,
  },
  GYM: {
    label: "Gym",
    icon: FitnessCenter,
  },
  SPA: {
    label: "Spa",
    icon: Spa,
  },
  ELEVATOR: {
    label: "Elevator",
    icon: Elevator,
  },

  // Parking
  FREE_PARKING: {
    label: "Free parking",
    icon: LocalParking,
  },
  GARAGE: {
    label: "Garage",
    icon: Garage,
  },
  EV_CHARGER: {
    label: "EV charger",
    icon: EvStation,
  },

  // Workspace
  WORKSPACE: {
    label: "Dedicated workspace",
    icon: Desk,
  },

  // Family
  CRIB: {
    label: "Crib",
    icon: Crib,
  },

  // Pets
  PETS_ALLOWED: {
    label: "Pets allowed",
    icon: Pets,
  },

  // Safety
  SMOKE_ALARM: {
    label: "Smoke alarm",
    icon: Security,
  },
  SECURITY_SYSTEM: {
    label: "Security system",
    icon: Lock,
  },

  // Accessibility
  STEP_FREE_ACCESS: {
    label: "Step-free access",
    icon: DoorFront,
  },
} as const;

export type AmenityType = keyof typeof amenityMap;
