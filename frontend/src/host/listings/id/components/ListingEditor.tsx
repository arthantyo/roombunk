import { useState } from "react";
import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { ListingData } from "../../types";
import { updateHotel } from "../../../../api/hotels";
import { updateRoom } from "../../../../api/rooms";
import { HostingSuccessListing } from "../../components/HostingSuccessListing";
import { hostingSteps } from "../../constants";
import { ListingEditorHeader } from "./ListingEditorHeader";
import { ListingEditorSteps } from "./ListingEditorSteps";

type Props = {
  id: string;
  initialData: ListingData;
};

export function ListingEditor({ id, initialData }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const [propertyType, setPropertyType] = useState(initialData.propertyType);

  const [placeAccessType, setPlaceAccessType] = useState(
    initialData.placeAccessType,
  );

  const [propertyDetails, setPropertyDetails] = useState(
    initialData.propertyDetails,
  );

  const [roomDetails, setRoomDetails] = useState(initialData.roomDetails);

  const [amenities, setAmenities] = useState(initialData.amenities);

  const [title, setTitle] = useState(initialData.title);

  const [description, setDescription] = useState(initialData.description);

  const [pricePerNight, setPricePerNight] = useState(initialData.pricePerNight);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await updateHotel(id, propertyDetails);

      if (!initialData.roomId) {
        return;
      }

      await updateRoom(initialData.roomId, {
        name: title,
        description,
        pricePerNight: Number(pricePerNight) || 100,
        capacity: roomDetails.guests,
        amenities,
        propertyType,
      });
    },

    onSuccess: () => {
      setActiveStep(hostingSteps.length);
    },
  });

  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };

  const handleBack = () => {
    setActiveStep((step) => Math.max(0, step - 1));
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  if (activeStep === hostingSteps.length) {
    return <HostingSuccessListing  />;
  }

  return (
    <Box
      sx={{
        maxWidth: 760,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        pb: 8,
        mt: { xs: 3, md: 6 },
      }}
    >
      <ListingEditorHeader
        listingId={id}
        title={title || propertyDetails.name}
        activeStep={activeStep}
        onStepChange={setActiveStep}
      />

      <ListingEditorSteps
        activeStep={activeStep}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        placeAccessType={placeAccessType}
        setPlaceAccessType={setPlaceAccessType}
        propertyDetails={propertyDetails}
        setPropertyDetails={setPropertyDetails}
        roomDetails={roomDetails}
        setRoomDetails={setRoomDetails}
        amenities={amenities}
        setAmenities={setAmenities}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        pricePerNight={pricePerNight}
        setPricePerNight={setPricePerNight}
        onNext={handleNext}
        onBack={handleBack}
        onSave={handleSave}
      />
    </Box>
  );
}
