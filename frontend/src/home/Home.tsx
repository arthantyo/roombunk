import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { getHotels } from "../api/hotels";
import type { HotelDto } from "../api/types";

const PAGE_SIZE = 8;

function getHotelImage() {
  return "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80";
}

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
          fontWeight: 700,
          fontSize: { xs: "1.2rem", md: "1.4rem" },
          letterSpacing: -0.8,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function HotelCard({ hotel }: { hotel: HotelDto }) {
  return (
    <Card
      component={RouterLink}
      to={`/hotels/${hotel.id}`}
      sx={{
        minWidth: 236,
        width: 236,
        background: "transparent",
        boxShadow: "none",
        border: "none",
        textDecoration: "none",
        flexShrink: 0,
        color: "inherit",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={getHotelImage()}
          alt={hotel.name}
          sx={{ height: 250, borderRadius: 4, objectFit: "cover" }}
        />
        {/* <IconButton
          aria-label="favorite"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.85)",
            width: 34,
            height: 34,
            borderRadius: "50%",
            ":hover": { background: "rgba(255,255,255,0.95)" },
          }}
        >
          <FavoriteBorderIcon fontSize="small" sx={{ color: "#1d1d1d" }} />
        </IconButton> */}
      </Box>
      <Box sx={{ mt: 1.2, px: 0.5 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
          {hotel.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
          {hotel.city}, {hotel.country}
        </Typography>
        {/* <Typography variant="body2" sx={{ mt: 0.2, fontWeight: 500 }}>
          {formattedPrice}
        </Typography> */}
      </Box>
    </Card>
  );
}

export default function Home() {
  const [page, setPage] = useState(0);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("destination") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["hotels", page],
    queryFn: () => getHotels(page, PAGE_SIZE),
  });

  const filteredHotels = useMemo(() => {
    const hotels = data?.content ?? [];
    if (!search.trim()) return hotels;
    const term = search.toLowerCase();
    return hotels.filter(
      (hotel: HotelDto) =>
        hotel.name.toLowerCase().includes(term) ||
        hotel.city.toLowerCase().includes(term) ||
        hotel.country.toLowerCase().includes(term),
    );
  }, [data, search]);

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4, px: { xs: 1, md: 3 } }}>
        <SectionHeader title="Our stays" />
        <Box
          sx={{
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Stack direction="row" spacing={2.2} sx={{ minWidth: "max-content" }}>
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={236}
                  height={320}
                  sx={{ borderRadius: 4 }}
                />
              ))}

            {!isLoading &&
              filteredHotels.map((hotel: HotelDto) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
          </Stack>
        </Box>
      </Box>

      {/* {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error instanceof ApiError
            ? error.message
            : "Unable to load hotels. Please try again later."}
        </Alert>
      )} */}

      {!isLoading && filteredHotels.length === 0 && (
        <Box sx={{ textAlign: "center" }}>
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
            We couldn't find any hotels matching your search. Please try a
            different destination or check back later.
          </Typography>
        </Box>
      )}

      {data && data.totalPages > 1 && (
        <Stack sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={data.totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}
