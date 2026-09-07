import AmenityItem from "./amenities/AmenityItem";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Box, Button, Divider, Skeleton, Typography } from "@mui/material";
import { getHotelById } from "../api/hotels";
import { getRoomsByHotelId } from "../api/rooms";
import BookingSidebar from "./BookingSidebar";
import { BookmarkBorder, GridView, Star } from "@mui/icons-material";
import ReviewSummary from "./ReviewSummary";
import PageNotFound from "../layout/PageNotFound";
import WishlistModal from "./WishlistModal";
import { useAuth } from "../auth/useAuth";
import { useMemo, useState } from "react";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function Hotel() {
  const { id } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  // const navigate = useNavigate();
  // const { isAuthenticated } = useAuth();

  const [checkInDate, setCheckInDate] = useState(todayIso());
  const [checkOutDate, setCheckOutDate] = useState(tomorrowIso());
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(false);
  // const [, setSelectedRoom] = useState<RoomDto | null>(null);
  // const [bookingError, setBookingError] = useState<string | null>(null);
  // const [, setIsBooking] = useState(false);

  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => getHotelById(id!),
    enabled: !!id,
  });

  const { data: rooms } = useQuery({
    queryKey: ["rooms", id],
    queryFn: () => getRoomsByHotelId(id!),
    enabled: !!id,
  });

  const nights = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [checkInDate, checkOutDate]);

  const lowestNightlyRate = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return null;
    }

    return Math.min(...rooms.map((room) => Number(room.pricePerNight)));
  }, [rooms]);

  const handleCheckInChange = (value: string) => {
    setCheckInDate(value);

    const selected = new Date(`${value}T00:00:00`);
    const currentCheckout = new Date(`${checkOutDate}T00:00:00`);

    if (currentCheckout <= selected) {
      const nextDay = new Date(selected);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay.toISOString().slice(0, 10));
    }
  };

  // async function handleBook(room: RoomDto) {
  //   setBookingError(null);

  //   if (!isAuthenticated) {
  //     navigate("/login", { state: { from: { pathname: `/hotels/${id}` } } });
  //     return;
  //   }

  //   if (nights <= 0) {
  //     setBookingError("Check-out date must be after check-in date.");
  //     return;
  //   }

  //   setSelectedRoom(room);
  //   setIsBooking(true);

  //   try {
  //     const hold = await createHold({
  //       room: { id: room.id, hotel: { id: room.hotelId } },
  //       checkInDate,
  //       checkOutDate,
  //     });

  //     navigate("/checkout", {
  //       state: {
  //         holdToken: hold.holdToken,
  //         hotelId: hold.hotelId,
  //         roomId: hold.roomId,
  //         checkInDate: hold.checkInDate,
  //         checkOutDate: hold.checkOutDate,
  //         expiresAt: hold.expiresAt,
  //         hotelName: hotel?.name,
  //         roomType: room.roomType,
  //         pricePerNight: room.pricePerNight,
  //         nights,
  //       },
  //     });
  //   } catch (err) {
  //     setBookingError(
  //       err instanceof ApiError
  //         ? err.message
  //         : "This room is unavailable for the selected dates. Please try different dates.",
  //     );
  //   } finally {
  //     setIsBooking(false);
  //   }
  // }

  const galleryImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    ],
    [],
  );

  if (hotelLoading) {
    return (
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 1.5, md: 3 }, py: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            my: 2.5,
          }}
        >
          <Skeleton variant="text" width="min(420px, 70%)" height={58} />
          <Skeleton variant="rounded" width={82} height={40} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.55fr 1fr" },
            gridTemplateRows: {
              xs: "clamp(240px, 78vw, 520px)",
              md: "clamp(420px, 42vw, 560px)",
            },
            gap: 1.2,
            mb: 3,
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              height: "100%",
              borderRadius: { xs: "1.5rem", md: "3em 0 0 3rem" },
            }}
          />
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1.2,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" sx={{ height: "100%" }} />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.8fr) minmax(260px, 1fr)",
            },
            gap: { xs: 3, md: 12 },
          }}
        >
          <Box>
            <Skeleton variant="text" width="min(520px, 90%)" height={48} />
            <Skeleton variant="text" width="220px" height={30} />
            <Skeleton variant="text" width="100%" height={30} />
            <Skeleton variant="text" width="85%" height={30} />
            <Divider sx={{ mt: 2, mb: 3 }} />
            <Skeleton variant="text" width="min(520px, 90%)" height={48} />
            <Skeleton variant="text" width="220px" height={30} />
            <Skeleton variant="text" width="100%" height={30} />
            <Skeleton variant="text" width="85%" height={30} />
          </Box>
          <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
        </Box>
        <Divider sx={{ my: 4 }} />
        <Skeleton variant="text" width="180px" height={42} />
        <Skeleton variant="rounded" height={140} sx={{ mt: 1 }} />
      </Box>
    );
  }

  if (!hotel) {
    return <PageNotFound />;
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 1.5, md: 3 }, py: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 6,
          my: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 500,
            letterSpacing: -2,
            lineHeight: 1,
            fontSize: { xs: "2rem", md: "2.4rem" },
          }}
        >
          {hotel.name}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<BookmarkBorder fontSize="small" />}
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal();
              return;
            }
            setWishlistOpen(true);
          }}
          sx={{
            alignSelf: "center",
            borderRadius: 2,
            color: "#222222",
            borderColor: "rgba(18,18,18,0.2)",
            backgroundColor: "transparent",
            px: { xs: 1, sm: 1.5 },
            minWidth: { xs: 40, sm: "auto" },
            textTransform: "none",
            fontWeight: 500,
            flexShrink: 0,

            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Save
          </Box>
        </Button>
      </Box>

      <WishlistModal
        hotelId={hotel.id}
        hotelName={hotel.name}
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.55fr 1fr" },
          gridTemplateRows: {
            xs: "clamp(240px, 78vw, 520px)",
            md: "clamp(420px, 42vw, 560px)",
          },
          gap: 1.2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <Box
            component="img"
            src={galleryImages[0]}
            alt={hotel.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: { xs: "1.5rem", md: "3em 0 0 3rem" },
              display: "block",
              boxShadow: "0 28px 50px rgba(0, 0, 0, 0.08)",
            }}
          />
          <Button
            variant="contained"
            startIcon={<GridView fontSize="small" />}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              position: "absolute",
              right: 12,
              bottom: 12,
              borderRadius: 1.5,
              px: 1.5,
              py: 0.8,
              backgroundColor: "rgba(255, 255, 255, 0.94)",
              color: "#222222",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
              textTransform: "none",
              fontWeight: 400,
              "&:hover": { backgroundColor: "#ffffff" },
            }}
          >
            Show photos
          </Button>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1.2,
            height: "100%",
          }}
        >
          {galleryImages.slice(1, 5).map((image, index) => (
            <Box
              key={`${image}-${index}`}
              component="img"
              src={image}
              alt={`${hotel.name} photo ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius:
                  index === 1 ? "0 3rem 0 0" : index === 3 ? "0 0 3rem 0" : "0",
                display: "block",
                boxShadow: "0 22px 40px rgba(0, 0, 0, 0.06)",
              }}
            />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.8fr) minmax(260px, 1fr)",
          },
          gap: { xs: 3, md: 12 },
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ flex: "1 1 0", minWidth: 0, mt: 1.2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: "#1e1e1e",
                  mb: 1,
                  fontSize: { xs: "1.6rem", md: "1.8rem" },
                }}
              >
                Hotel in {hotel.city}, {hotel.country}
              </Typography>

              {/* rating */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "black",
                  marginBottom: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: "1.05rem" }}>
                  <Star sx={{ color: "black", fontSize: 10, mr: 0.5 }} />
                  4.78 •
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1.05rem",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  121 reviews
                </Typography>
              </Box>

              <Typography
                sx={{
                  maxWidth: 760,
                  color: "#4c4c4c",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                }}
              >
                Located in the creative {hotel.city} area, this hotel blends
                comfort, modern rooms, and a welcoming shared-lounge atmosphere
                for longer stays and city breaks.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 500, mb: 3 }}>
              What this place offers
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 3,
              }}
            >
              {(["WIFI", "GYM", "TV", "ELEVATOR"] as const).map((amenity) => (
                <AmenityItem key={amenity} type={amenity} />
              ))}
            </Box>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                alignSelf: "flex-start",
                textTransform: "none",
                color: "#222222",
                backgroundColor: "#f1f1f1",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#e6e6e6", boxShadow: "none" },
              }}
            >
              Show all amenities
            </Button>
          </Box>
        </Box>
        <Box>
          <BookingSidebar
            rooms={rooms ?? []}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            adults={adults}
            childrenCount={childrenCount}
            infants={infants}
            pets={pets}
            minCheckInDate={todayIso()}
            lowestNightlyRate={lowestNightlyRate}
            nights={nights}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={setCheckOutDate}
            onAdultsChange={setAdults}
            onChildrenChange={setChildrenCount}
            onInfantsChange={setInfants}
            onPetsChange={setPets}
          />
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      <ReviewSummary />
    </Box>
  );
}
