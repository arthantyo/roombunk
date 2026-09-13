import { Add } from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";

import { getListings } from "../api/listings";
import { EmptyListings } from "./components/EmptyCard";
import { ListingCard } from "./components/ListingCard";
import type { HostListing } from "./types";

export default function Host() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });

  const listings: HostListing[] =
    data?.map((listing) => ({
      id: listing.id,
      title: listing.title,
      location: `${listing.city}, ${listing.country}`,
      status: listing.status,
      verified: listing.verified,
      basePrice: listing.basePrice,
      extraGuestPrice: listing.extraGuestPrice,
      maxGuests: listing.maxGuests,
      beds: listing.beds,
      bathrooms: listing.bathrooms,
      bedrooms: listing.bedrooms,
      petFriendly: listing.petFriendly,
      amenities: listing.amenities,
      propertyType: listing.propertyType,
      guestAccess: listing.guestAccess,
      address: listing.address,
      city: listing.city,
      province: listing.province,
      postalCode: listing.postalCode,
      country: listing.country,
      description: listing.description,
    })) ?? [];

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={4}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              letterSpacing: -0.8,
              fontSize: {
                xs: "1.6rem",
                sm: "2rem",
              },
            }}
          >
            Your listings
          </Typography>

          <IconButton
            component={RouterLink}
            to="/host/create"
            sx={{
              flexShrink: 0,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              width: {
                xs: 30,
                sm: 38,
              },
              height: {
                xs: 30,
                sm: 38,
              },
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <Add />
          </IconButton>
        </Stack>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">Unable to load your listings.</Alert>
        ) : listings.length === 0 ? (
          <EmptyListings />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
