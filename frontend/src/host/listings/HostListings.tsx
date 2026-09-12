import { useState } from "react";

import { Box } from "@mui/material";

import { hostingSteps } from "./constants";

import type { AmenityType } from "../../utils/amenityMap";

import PropertyTypeStep from "./components/PropertyTypeStep";
import PlaceAccessStep from "./components/PlaceAccessStep";
import PropertyDetailsStep from "./components/PropertyDetailsStep";
import RoomDetailsStep from "./components/RoomDetailsStep";
import AmenitiesStep from "./components/AmenitiesStep";
import TitleStep from "./components/TitleStep";
import DescriptionStep from "./components/DescriptionStep";
import PricingStep from "./components/PricingStep";
import { HostingSuccessListing } from "./components/HostingSuccessListing";
import type {
  PropertyType,
  PlaceAccessType,
  PropertyDetails,
  RoomDetails,
} from "./types";

export default function HostListings() {
  const [activeStep, setActiveStep] = useState(0);

  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");

  const [placeAccessType, setPlaceAccessType] =
    useState<PlaceAccessType>("entire");

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [roomDetails, setRoomDetails] = useState<RoomDetails>({
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  });

  const [amenities, setAmenities] = useState<AmenityType[]>([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [pricePerNight, setPricePerNight] = useState("");

  /*
   * Finished
   */
  if (activeStep === hostingSteps.length) {
    return <HostingSuccessListing />;
  }

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
        },
        pb: 8,
        mt: {
          xs: 3,
          md: 10,
        },
      }}
    >
      {/*
       * 0 - Property type
       */}
      {activeStep === 0 && (
        <PropertyTypeStep
          value={propertyType}
          onChange={setPropertyType}
          onNext={() => setActiveStep(1)}
        />
      )}

      {/*
       * 1 - Guest access
       */}
      {activeStep === 1 && (
        <PlaceAccessStep
          value={placeAccessType}
          onChange={setPlaceAccessType}
          onBack={() => setActiveStep(0)}
          onNext={() => setActiveStep(2)}
        />
      )}

      {/*
       * 2 - Property details
       */}
      {activeStep === 2 && (
        <PropertyDetailsStep
          value={propertyDetails}
          onChange={setPropertyDetails}
          onBack={() => setActiveStep(1)}
          onNext={() => setActiveStep(3)}
        />
      )}

      {/*
       * 3 - Basics
       */}
      {activeStep === 3 && (
        <RoomDetailsStep
          value={roomDetails}
          onChange={setRoomDetails}
          onBack={() => setActiveStep(2)}
          onNext={() => setActiveStep(4)}
        />
      )}

      {/*
       * 4 - Amenities
       */}
      {activeStep === 4 && (
        <AmenitiesStep
          value={amenities}
          onChange={setAmenities}
          onBack={() => setActiveStep(3)}
          onNext={() => setActiveStep(5)}
        />
      )}

      {/*
       * 5 - Title
       */}
      {activeStep === 5 && (
        <TitleStep
          value={title}
          onChange={setTitle}
          onBack={() => setActiveStep(4)}
          onNext={() => setActiveStep(6)}
        />
      )}

      {/*
       * 6 - Description
       */}
      {activeStep === 6 && (
        <DescriptionStep
          value={description}
          onChange={setDescription}
          onBack={() => setActiveStep(5)}
          onNext={() => setActiveStep(7)}
        />
      )}

      {/*
       * 7 - Pricing
       */}
      {activeStep === 7 && (
        <PricingStep
          value={pricePerNight}
          onChange={setPricePerNight}
          onBack={() => setActiveStep(6)}
          onNext={() => setActiveStep(8)}
        />
      )}
    </Box>
  );
}
