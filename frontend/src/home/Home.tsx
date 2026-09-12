import { ListingCardSkeleton } from "./ListingCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { BookmarkBorder } from "@mui/icons-material";
import { Grow, IconButton, Zoom } from "@mui/material";
import {
  Box,
  Card,
  CardMedia,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { getListings } from "../api/listings";
import type { ListingDto } from "../api/types";
import WishlistModal from "../hotel/WishlistModal";
import { useAuth } from "../auth/useAuth";
import { useState, useMemo } from "react";
import { ListingCard } from "./ListingCard";

const PAGE_SIZE = 8;

function SectionHeader({ title }: { title: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2.5,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          fontSize: { xs: "1.2rem", md: "1.4rem" },
          letterSpacing: -0.8,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function Home() {
  const [page, setPage] = useState(0);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("destination") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });

  const filteredListings = useMemo(() => {
    const listings = data ?? [];
    if (!search.trim())
      return listings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const term = search.toLowerCase();
    return listings.filter(
      (listing: ListingDto) =>
        listing.title.toLowerCase().includes(term) ||
        listing.city.toLowerCase().includes(term) ||
        listing.country.toLowerCase().includes(term),
    );
  }, [data, page, search]);

  return (
    <Box
      sx={{
        pt: 2,
        pb: { xs: 10, md: 2 },
      }}
    >
      <Box sx={{ mb: 4, px: { xs: 1, md: 3 } }}>
        <SectionHeader title="Our stays" />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(6, minmax(0, 1fr))",
            },
            gap: { xs: 1.5, sm: 2, md: 2.2 },
            pb: 1,
          }}
        >
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <ListingCardSkeleton key={index} />
            ))}

          {!isLoading &&
            filteredListings.map((listing: ListingDto, index: number) => (
              <Grow in={!isLoading} timeout={300 + index * 70} key={listing.id}>
                <Box>
                  <ListingCard listing={listing} />
                </Box>
              </Grow>
            ))}
        </Box>
      </Box>

      {/* {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error instanceof ApiError
            ? error.message
            : "Unable to load hotels. Please try again later."}
        </Alert>
      )} */}

      {!isLoading && filteredListings.length === 0 && (
        <Box sx={{ textAlign: "center" }}>
          <Zoom in>
            <Box
              component="img"
              src="/images/no-hotels.png"
              alt="No hotels found"
              sx={{
                display: "block",
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                mx: "auto",
              }}
            />
          </Zoom>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              mt: 2,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            No results found
          </Typography>
          <Typography
            sx={{
              mt: 1,
              textAlign: "center",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              maxWidth: "400px",
              mx: "auto",
            }}
            color="text.secondary"
          >
            We couldn't find any listings matching your search.
          </Typography>
        </Box>
      )}

      {data && Math.ceil(data.length / PAGE_SIZE) > 1 && (
        <Stack sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={Math.ceil(data.length / PAGE_SIZE)}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}
