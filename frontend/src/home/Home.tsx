import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { BookmarkBorder } from "@mui/icons-material";
import { Grow, IconButton, Zoom } from "@mui/material";
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
import WishlistModal from "../hotel/WishlistModal";
import { useAuth } from "../auth/useAuth";

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

function HotelCard({ hotel }: { hotel: HotelDto }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <>
      <Card
        component={RouterLink}
        to={`/hotels/${hotel.id}`}
        sx={{
          minWidth: 0,
          width: "100%",
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
            image={
              // eslint-disable-next-line react-hooks/purity
              Math.random() > 0.66
                ? "/images/studio-stock.png"
                : // eslint-disable-next-line react-hooks/purity
                  Math.random() > 0.5
                  ? "/images/hotel-stock.png"
                  : "/images/apartment-stock.png"
            }
            alt={hotel.name}
            sx={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: 4,
              objectFit: "cover",
            }}
          />
          <IconButton
            aria-label={`Save ${hotel.name} to a wishlist`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isAuthenticated) {
                openAuthModal();
                return;
              }
              setWishlistOpen(true);
            }}
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
            <BookmarkBorder fontSize="small" sx={{ color: "#1d1d1d" }} />
          </IconButton>
        </Box>
        <Box sx={{ mt: 1.2, px: 0.5 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {hotel.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, mt: 0.2 }}
          >
            {hotel.city}, {hotel.country}
          </Typography>
          {/* <Typography variant="body2" sx={{ mt: 0.2, fontWeight: 500 }}>
          {formattedPrice}
        </Typography> */}
        </Box>
      </Card>
      <WishlistModal
        hotelId={hotel.id}
        hotelName={hotel.name}
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </>
  );
}

function HotelCardSkeleton() {
  return (
    <Box sx={{ minWidth: 0, width: "100%" }}>
      <Skeleton
        variant="rounded"
        sx={{
          display: "block",
          width: "100%",
          aspectRatio: "1 / 1",
          height: "auto",
          borderRadius: 4,
        }}
      />

      <Box sx={{ mt: 1.2, px: 0.5 }}>
        <Skeleton
          variant="text"
          width="78%"
          sx={{ fontSize: "1rem", lineHeight: 1.35 }}
        />

        <Skeleton
          variant="text"
          width="58%"
          sx={{ fontSize: "0.875rem", lineHeight: 1.43, mt: 0.2 }}
        />
      </Box>
    </Box>
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
              <HotelCardSkeleton key={index} />
            ))}

          {!isLoading &&
            filteredHotels.map((hotel: HotelDto, index) => (
              <Grow in={!isLoading} timeout={300 + index * 70} key={hotel.id}>
                <Box>
                  <HotelCard hotel={hotel} />
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

      {!isLoading && filteredHotels.length === 0 && (
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
