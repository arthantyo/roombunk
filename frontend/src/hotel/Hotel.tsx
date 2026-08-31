import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { getHotelById } from "../api/hotels";
import { getRoomsByHotelId } from "../api/rooms";
import { createHold } from "../api/reservations";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type { RoomDto } from "../api/types";

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [checkInDate, setCheckInDate] = useState(todayIso());
  const [checkOutDate, setCheckOutDate] = useState(tomorrowIso());
  const [guests, setGuests] = useState("1");
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => getHotelById(id!),
    enabled: !!id,
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery({
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

  async function handleBook(room: RoomDto) {
    setBookingError(null);

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/hotels/${id}` } } });
      return;
    }

    if (nights <= 0) {
      setBookingError("Check-out date must be after check-in date.");
      return;
    }

    setSelectedRoom(room);
    setIsBooking(true);

    try {
      const hold = await createHold({
        room: { id: room.id, hotel: { id: room.hotelId } },
        checkInDate,
        checkOutDate,
      });

      navigate("/checkout", {
        state: {
          holdToken: hold.holdToken,
          hotelId: hold.hotelId,
          roomId: hold.roomId,
          checkInDate: hold.checkInDate,
          checkOutDate: hold.checkOutDate,
          expiresAt: hold.expiresAt,
          hotelName: hotel?.name,
          roomType: room.roomType,
          pricePerNight: room.pricePerNight,
          nights,
        },
      });
    } catch (err) {
      setBookingError(
        err instanceof ApiError
          ? err.message
          : "This room is unavailable for the selected dates. Please try different dates.",
      );
    } finally {
      setIsBooking(false);
    }
  }

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
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 6,
          mb: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
            fontSize: { xs: "2.4rem", md: "4rem" },
            color: "#1f1f1f",
          }}
        >
          {hotel.name}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<BookmarksOutlinedIcon fontSize="small" />}
            sx={{
              borderRadius: 2,
              borderColor: "rgba(18,18,18,0.2)",
              color: "#1f1f1f",
              backgroundColor: "rgba(255,255,255,0.3)",
              px: 1.5,
              textTransform: "none",
              fontWeight: 600,
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
          gridTemplateRows: { xs: "340px 340px", md: "560px" },
          gap: 1.2,
          mb: 3,
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
            borderRadius: 4,
            display: "block",
            boxShadow: "0 28px 50px rgba(0, 0, 0, 0.08)",
          }}
        />

        <Box
          sx={{
            display: "grid",
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
                borderRadius: 4,
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
            md: "minmax(0, 1.8fr) minmax(260px, 0.6fr)",
          },
          gap: { xs: 3, md: 4 },
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
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: -1,
                  color: "#1e1e1e",
                  mb: 1,
                  fontSize: { xs: "2rem", md: "2.3rem" },
                }}
              >
                Hotel in {hotel.city}, {hotel.country}
              </Typography>

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

          {bookingError && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
              {bookingError}
            </Alert>
          )}

          <Divider sx={{ mb: 3 }} />

          <Box>
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
                                Sleeps {room.capacity}
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
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              minWidth: 260,
              width: { xs: "100%", md: "100%" },
              p: 2.25,
              borderRadius: 2,
              background: "#ffffff",
              border: "1px solid #ececec",
              boxShadow: "0 5px 18px rgba(0,0,0,0.10)",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Typography
              sx={{
                fontWeight: 750,
                fontSize: "1rem",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                mb: 2,
              }}
            >
              {lowestNightlyRate !== null && nights > 0
                ? `From $${(lowestNightlyRate * nights).toFixed(2)} total`
                : "Choose your dates"}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                border: "1px solid #858585",
                borderBottom: { xs: "1px solid #858585", sm: 0 },
                borderRadius: { xs: 2, sm: "10px 10px 0 0" },
                overflow: "hidden",
                height: { xs: "auto", sm: 48 },
              }}
            >
              <TextField
                type="date"
                value={checkInDate}
                onChange={(e) => handleCheckInChange(e.target.value)}
                slotProps={{
                  htmlInput: { min: todayIso() },
                }}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                  "& .MuiInputBase-input": {
                    px: 1.25,
                    py: 2.15,
                    fontSize: "0.85rem",
                  },
                  "& .MuiInputBase-root": { borderRadius: 0 },
                  "&::before": {
                    content: '"CHECK-IN"',
                    position: "absolute",
                    top: 7,
                    left: 10,
                    zIndex: 1,
                    color: "#222",
                    fontSize: "0.55rem",
                    fontWeight: 800,
                    pointerEvents: "none",
                  },
                }}
              />
              <TextField
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                slotProps={{
                  htmlInput: { min: checkInDate },
                }}
                fullWidth
                sx={{
                  height: "100%",
                  borderLeft: { xs: 0, sm: "1px solid #858585" },
                  borderTop: { xs: "1px solid #858585", sm: 0 },
                  "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                  "& .MuiInputBase-input": {
                    px: 1.25,
                    py: 2.15,
                    fontSize: "0.85rem",
                  },
                  "& .MuiInputBase-root": { borderRadius: 0 },
                  "&::before": {
                    content: '"CHECK-OUT"',
                    position: "absolute",
                    top: 7,
                    left: 10,
                    zIndex: 1,
                    color: "#222",
                    fontSize: "0.55rem",
                    fontWeight: 800,
                    pointerEvents: "none",
                  },
                }}
              />
            </Box>

            <TextField
              select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: { xs: 2, sm: "0 0 10px 10px" },
                  fontSize: "0.78rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#858585",
                },
                "& .MuiInputBase-input": { pt: 2.35, pb: 0.9 },
                "&::before": {
                  content: '"GUESTS"',
                  position: "absolute",
                  top: 7,
                  left: 10,
                  zIndex: 1,
                  color: "#222",
                  fontSize: "0.55rem",
                  fontWeight: 800,
                  pointerEvents: "none",
                },
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((guestCount) => (
                <MenuItem key={guestCount} value={String(guestCount)}>
                  {guestCount} guest{guestCount > 1 ? "s" : ""}
                </MenuItem>
              ))}
            </TextField>

            <Typography
              sx={{
                color: "#555",
                textAlign: "center",
                fontSize: "0.72rem",
                pt: 0.25,
                mt: 1,
              }}
            >
              Select a room below to reserve
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
