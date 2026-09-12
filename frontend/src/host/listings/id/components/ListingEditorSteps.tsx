import type { Dispatch, SetStateAction } from "react";
import type { AmenityType } from "../../../../utils/amenityMap";
import AmenitiesStep from "../../components/AmenitiesStep";
import DescriptionStep from "../../components/DescriptionStep";
import PlaceAccessStep from "../../components/PlaceAccessStep";
import PricingStep from "../../components/PricingStep";
import PropertyDetailsStep from "../../components/PropertyDetailsStep";
import PropertyTypeStep from "../../components/PropertyTypeStep";
import RoomDetailsStep from "../../components/RoomDetailsStep";
import TitleStep from "../../components/TitleStep";
import type {
  PropertyType,
  PlaceAccessType,
  PropertyDetails,
  RoomDetails,
} from "../../types";

type Props = {
  activeStep: number;

  propertyType: PropertyType;
  setPropertyType: Dispatch<SetStateAction<PropertyType>>;

  placeAccessType: PlaceAccessType;
  setPlaceAccessType: Dispatch<SetStateAction<PlaceAccessType>>;

  propertyDetails: PropertyDetails;
  setPropertyDetails: Dispatch<SetStateAction<PropertyDetails>>;

  roomDetails: RoomDetails;
  setRoomDetails: Dispatch<SetStateAction<RoomDetails>>;

  amenities: AmenityType[];
  setAmenities: Dispatch<SetStateAction<AmenityType[]>>;

  title: string;
  setTitle: Dispatch<SetStateAction<string>>;

  description: string;
  setDescription: Dispatch<SetStateAction<string>>;

  pricePerNight: string;
  setPricePerNight: Dispatch<SetStateAction<string>>;

  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
};

export function ListingEditorSteps({
  activeStep,
  propertyType,
  setPropertyType,
  placeAccessType,
  setPlaceAccessType,
  propertyDetails,
  setPropertyDetails,
  roomDetails,
  setRoomDetails,
  amenities,
  setAmenities,
  title,
  setTitle,
  description,
  setDescription,
  pricePerNight,
  setPricePerNight,
  onNext,
  onBack,
  onSave,
}: Props) {
  switch (activeStep) {
    case 0:
      return (
        <PropertyTypeStep
          value={propertyType}
          onChange={setPropertyType}
          onNext={onNext}
        />
      );

    case 1:
      return (
        <PlaceAccessStep
          value={placeAccessType}
          onChange={setPlaceAccessType}
          onBack={onBack}
          onNext={onNext}
        />
      );

    case 2:
      return (
        <PropertyDetailsStep
          value={propertyDetails}
          onChange={setPropertyDetails}
          onBack={onBack}
          onNext={onNext}
        />
      );

    case 3:
      return (
        <RoomDetailsStep
          value={roomDetails}
          onChange={setRoomDetails}
          onBack={onBack}
          onNext={onNext}
        />
      );

    case 4:
      return (
        <AmenitiesStep
          value={amenities}
          onChange={setAmenities}
          onBack={onBack}
          onNext={onNext}
        />
      );

    case 5:
      return (
        <TitleStep
          value={title}
          onChange={setTitle}
          onBack={onBack}
          onNext={onNext}
        />
      );

    case 6:
      return (
        <DescriptionStep
          value={description}
          onChange={setDescription}
          onBack={onBack}
          onNext={onNext}
        />
      );

    case 7:
      return (
        <PricingStep
          value={pricePerNight}
          onChange={setPricePerNight}
          onBack={onBack}
          onNext={onSave}
        />
      );

    default:
      return null;
  }
}
