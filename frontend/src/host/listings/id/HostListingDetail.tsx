import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";

import { getHotelById } from "../../../api/hotels";
import { getRoomsByHotelId } from "../../../api/rooms";

import { ListingEditor } from "./components/ListingEditor";
import { createEmptyListing, mapHotelToListing } from "./utils/listingMapper";

export default function HostListingDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => getHotelById(id!),
    enabled: !!id,
  });

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms", id],
    queryFn: () => getRoomsByHotelId(id!),
    enabled: !!id,
  });

  const isLoading = hotelLoading || roomsLoading;

  const initialData = useMemo(() => {
    if (!hotel) {
      return null;
    }

    return mapHotelToListing(hotel, rooms);
  }, [hotel, rooms]);

  if (!id || isLoading) {
    return <LoadingState />;
  }

  const listing = initialData ?? createEmptyListing();

  return <ListingEditor key={id} id={id} initialData={listing} />;
}

function LoadingState() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 10,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
