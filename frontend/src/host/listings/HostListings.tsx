import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, CircularProgress } from "@mui/material";

import { hostingSteps } from "./constants";
import { createListing } from "../../api/listings";

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

function mapPropertyType(type: PropertyType): string {
  switch (type) {
    case "apartment":
      return "APARTMENT";
    case "house":
      return "HOUSE";
    case "hotel":
      return "HOTEL";
    default:
      return String(type).toUpperCase();
  }
}

function mapGuestAccess(access: PlaceAccessType): string {
  switch (access) {
    case "entire":
      return "ENTIRE_PLACE";
    case "private-room":
      return "PRIVATE_ROOM";
    case "shared-room":
      return "SHARED_ROOM";
    default:
      return String(access).toUpperCase().replace(/-/g, "_");
  }
}

export default function HostListings() {
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);

  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");

  const [placeAccessType, setPlaceAccessType] =
    useState<PlaceAccessType>("entire");

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
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

  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      setActiveStep(hostingSteps.length);
    },
  });

  function handleCreateListing() {
    createMutation.mutate({
      title: title,
      description,
      propertyType: mapPropertyType(propertyType),
      guestAccess: mapGuestAccess(placeAccessType),
      address: propertyDetails.address,
      city: propertyDetails.city,
      province: propertyDetails.state,
      postalCode: propertyDetails.zipCode,
      country: propertyDetails.country,
      guests: roomDetails.guests,
      maxGuests: roomDetails.guests,
      beds: roomDetails.beds,
      bedrooms: roomDetails.bedrooms,
      bathrooms: roomDetails.bathrooms,
      status: "LIVE",
      amenities,
      basePrice: Number(pricePerNight) || 0,
    });
  }

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
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to create listing. Please try again.
        </Alert>
      )}

      {createMutation.isPending && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

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
          onNext={handleCreateListing}
        />
      )}
    </Box>
  );
}
