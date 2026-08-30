import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import PeopleIcon from "@mui/icons-material/People";
import { getHotelById } from "../api/hotels";
import { getRoomsByHotelId } from "../api/rooms";
import { createHold } from "../api/reservations";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
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

  if (hotelLoading) {
    return <Skeleton variant="rounded" height={300} />;
  }

  if (!hotel) {
    return <Alert severity="error">Hotel not found.</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          height: 220,
          borderRadius: 3,
          background: "linear-gradient(135deg, #0f6f5c 0%, #1b9c81 100%)",
          display: "flex",
          alignItems: "flex-end",
          p: 3,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
            {hotel.name}
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 1, alignItems: "center" }}
          >
            <LocationOnIcon sx={{ color: "white" }} fontSize="small" />
            <Typography color="white">
              {hotel.address}, {hotel.city}, {hotel.state} {hotel.zipCode},{" "}
              {hotel.country}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Card elevation={1} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select your dates
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Check-in"
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Check-out"
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>
          {nights > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {nights} night{nights > 1 ? "s" : ""}
            </Typography>
          )}
        </CardContent>
      </Card>

      {bookingError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {bookingError}
        </Alert>
      )}

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Available rooms
      </Typography>

      <Grid container spacing={2}>
        {roomsLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Grid key={i} size={12}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}

        {!roomsLoading &&
          rooms?.map((room) => (
            <Grid key={room.id} size={12}>
              <Card variant="outlined">
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">{room.roomType}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Chip
                        icon={<PeopleIcon />}
                        label={`Sleeps ${room.capacity}`}
                        size="small"
                      />
                      <Chip
                        icon={<BedIcon />}
                        label={room.roomType}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                  <Stack
                    spacing={1}
                    sx={{ alignItems: { xs: "flex-start", sm: "flex-end" } }}
                  >
                    <Typography variant="h6" color="primary">
                      ${room.pricePerNight.toFixed(2)}{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        / night
                      </Typography>
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={isBooking && selectedRoom?.id === room.id}
                      onClick={() => handleBook(room)}
                    >
                      {isBooking && selectedRoom?.id === room.id
                        ? "Holding..."
                        : "Book now"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {!roomsLoading && rooms?.length === 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography color="text.secondary">
            No rooms available at this hotel.
          </Typography>
        </>
      )}
    </Box>
  );
}
