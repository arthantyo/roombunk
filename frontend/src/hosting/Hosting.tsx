import { useState } from "react";

import { Box, Typography } from "@mui/material";

import { hostingSteps } from "./constants";

import type {
  PlaceAccessType,
  PropertyDetails,
  PropertyType,
  RoomDetails,
} from "./types";

import type { AmenityType } from "../utils/amenityMap";

import PropertyTypeStep from "./components/PropertyTypeStep";
import PlaceAccessStep from "./components/PlaceAccessStep";
import PropertyDetailsStep from "./components/PropertyDetailsStep";
import RoomDetailsStep from "./components/RoomDetailsStep";
import AmenitiesStep from "./components/AmenitiesStep";
import TitleStep from "./components/TitleStep";
import DescriptionStep from "./components/DescriptionStep";
import PricingStep from "./components/PricingStep";
import { HostingSuccessListing } from "./components/HostingSuccessListing";

export default function Hosting() {
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

  //   const mutation = useMutation({
  //     mutationFn: async () => {
  //       const hotel = await createHotel({
  //         ...propertyDetails,

  //         // Add these to your createHotel DTO when
  //         // your backend supports them:
  //         //
  //         // propertyType,
  //         // placeAccessType,
  //         // title,
  //         // description,
  //         // amenities,
  //       });

  //       await createRoom({
  //         hotelId: hotel.id,

  //         guests: roomDetails.guests,
  //         bedrooms: roomDetails.bedrooms,
  //         beds: roomDetails.beds,
  //         bathrooms: roomDetails.bathrooms,

  //         // Add this to your room DTO:
  //         //
  //         // pricePerNight: Number(pricePerNight),
  //       });

  //       return hotel;
  //     },

  //     onSuccess: () => {
  //       setActiveStep(hostingSteps.length);
  //     },
  //   });

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
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          mt: {
            xs: 3,
            md: 5,
          },
          fontWeight: 500,
          letterSpacing: -0.8,
          fontSize: {
            xs: "1.7rem",
            sm: "2rem",
          },
        }}
      >
        List your place
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      >
        Step {activeStep + 1} of {hostingSteps.length}:{" "}
        {hostingSteps[activeStep]}
      </Typography>

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
