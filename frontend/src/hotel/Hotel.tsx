import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import { getHotelById } from "../api/hotels";
import { getRoomsByHotelId } from "../api/rooms";
import BookingSidebar from "./BookingSidebar";
import { BookmarkBorder, GridView, Star } from "@mui/icons-material";
import ReviewSummary from "./ReviewSummary";

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
    return <Skeleton variant="rounded" height={520} sx={{ borderRadius: 4 }} />;
  }

  if (!hotel) {
    return <Alert severity="error">Hotel not found.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 1.5, md: 3 }, py: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { md: "row" },
          justifyContent: "space-between",
          alignItems: { md: "center" },
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

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<BookmarkBorder fontSize="small" />}
            sx={{
              borderRadius: 2,
              color: "#222222",
              borderColor: "rgba(18,18,18,0.2)",
              backgroundColor: "transparent",
              px: 1.5,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Save
          </Button>
        </Box>
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

          {/* {bookingError && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
              {bookingError}
            </Alert>
          )} */}

          <Divider sx={{ mb: 3 }} />

          {/* <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 2, letterSpacing: -0.7 }}
            >
              Available rooms
            </Typography>

            {roomsLoading && (
              <Skeleton
                variant="rounded"
                height={170}
                sx={{ borderRadius: 3 }}
              />
            )}

            {!roomsLoading && rooms && rooms.length > 0 && (
              <Box sx={{ display: "grid", gap: 2 }}>
                {rooms.map((room) => {
                  const total = room.pricePerNight * nights;

                  return (
                    <Box
                      key={room.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "180px minmax(0, 1fr)",
                          md: "220px minmax(0, 1fr)",
                        },
                        gap: 2,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Box
                        sx={{
                          minHeight: { xs: 170, sm: 180 },
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, rgba(15,111,92,0.12), rgba(15,111,92,0.02))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 48,
                        }}
                      ></Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                              {room.roomType}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.5,
                              }}
                            >
                              <PeopleAltOutlinedIcon
                                sx={{ fontSize: 18, color: "#4e4e4e" }}
                              />
                              <Typography sx={{ color: "#4c4c4c" }}>
                                {room.capacity} Guests
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                            <Typography sx={{ color: "#5d5d5d" }}>
                              From
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: 800, lineHeight: 1.1 }}
                            >
                              ${room.pricePerNight.toFixed(2)}
                            </Typography>
                            <Typography
                              sx={{ color: "#666", fontSize: "0.8rem" }}
                            >
                              per night
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography sx={{ color: "#4c4c4c" }}>
                            {nights > 0
                              ? `Estimated total: $${total.toFixed(2)} for ${nights} night${nights > 1 ? "s" : ""}`
                              : "Pick your dates to see pricing"}
                          </Typography>

                          <Button
                            variant="contained"
                            onClick={() => handleBook(room)}
                            disabled={isBooking && selectedRoom?.id === room.id}
                            sx={{
                              borderRadius: 2,
                              px: 2.5,
                              fontWeight: 700,
                              textTransform: "none",
                              minWidth: { xs: "100%", sm: 150 },
                            }}
                          >
                            {isBooking && selectedRoom?.id === room.id
                              ? "Reserving..."
                              : "Reserve"}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

            {!roomsLoading && (!rooms || rooms.length === 0) && (
              <Typography sx={{ color: "#5a5a5a" }}>
                No rooms are available for this hotel right now.
              </Typography>
            )}
          </Box> */}
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
