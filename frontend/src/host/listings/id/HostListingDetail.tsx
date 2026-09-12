import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";

import { getListingById } from "../../../api/listings";

import { ListingEditor } from "./components/ListingEditor";
import { createEmptyListing, mapListingToListing } from "./utils/listingMapper";

export default function HostListingDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: listingDto, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id!),
    enabled: !!id,
  });

  const initialData = useMemo(() => {
    if (!listingDto) {
      return null;
    }

    return mapListingToListing(listingDto);
  }, [listingDto]);

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
