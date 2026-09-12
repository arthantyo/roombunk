import { Add } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { EmptyListings } from "./components/EmptyCard";
import { ListingCard } from "./components/ListingCard";
import type { HostListing } from "./types";

const listings: HostListing[] = [
  {
    id: 1,
    title: "Modern apartment in Groningen",
    location: "Groningen, Netherlands",
    status: "LIVE",
  },
  {
    id: 2,
    title: "Cozy studio near the city centre",
    location: "Groningen, Netherlands",
    status: "DRAFT",
  },
];

export default function Host() {
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
            to="/host/hosting"
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

        {listings.length === 0 ? (
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
