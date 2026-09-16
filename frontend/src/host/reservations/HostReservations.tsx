import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { getHostReservations } from "../../api/reservations";
import type { ReservationDto } from "../../api/types";
import { EmptyReservations } from "./EmptyReservations";
import type { HostReservation } from "./component/ReservationCard";
import { ReservationCard } from "./component/ReservationCard";
import { ReservationDetailsDrawer } from "./component/ReservationDrawer";

type ReservationFilter = "today" | "upcoming";

export default function HostReservations() {
  const [filter, setFilter] = useState<ReservationFilter>("today");

  const [selectedReservation, setSelectedReservation] =
    useState<HostReservation | null>(null);

  const reservationsQuery = useQuery({
    queryKey: ["host-reservations"],
    queryFn: getHostReservations,
  });

  const reservations = useMemo(
    () =>
      (reservationsQuery.data ?? [])
        .map(toHostReservation)
        .filter((reservation) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkIn = new Date(`${reservation.checkIn}T00:00:00`);
          const checkOut = new Date(`${reservation.checkOut}T00:00:00`);

          return filter === "today"
            ? checkIn <= today && checkOut > today
            : checkIn > today;
        }),
    [filter, reservationsQuery.data],
  );

  function handleAccept(reservation: HostReservation) {
    console.log("accept", reservation.id);
  }

  function handleCancel(reservation: HostReservation) {
    console.log("cancel", reservation.id);
  }

  if (reservationsQuery.isLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 8 }} />;
  }

  if (reservationsQuery.isError) {
    return <Alert severity="error">Unable to load your reservations.</Alert>;
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ToggleButtonGroup
              exclusive
              value={filter}
              onChange={(_, value: ReservationFilter | null) => {
                if (value) {
                  setFilter(value);
                }
              }}
              sx={{
                gap: 1,

                "& .MuiToggleButtonGroup-grouped": {
                  border: 0,
                  borderRadius: "999px !important",
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 500,
                  bgcolor: "grey.200",
                  color: "text.primary",

                  "&:hover": {
                    bgcolor: "grey.300",
                  },

                  "&.Mui-selected": {
                    bgcolor: "#0f6f5c",
                    color: "common.white",

                    "&:hover": {
                      bgcolor: "#0f6f5c",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="today">Today</ToggleButton>

              <ToggleButton value="upcoming">Upcoming</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {reservations.length === 0 ? (
            <EmptyReservations />
          ) : (
            <Stack spacing={2}>
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onClick={() => setSelectedReservation(reservation)}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Box>

      <ReservationDetailsDrawer
        open={Boolean(selectedReservation)}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onAccept={handleAccept}
        onCancel={handleCancel}
      />
    </>
  );
}

function toHostReservation(reservation: ReservationDto): HostReservation {
  const nights = Math.max(
    1,
    Math.round(
      (new Date(`${reservation.checkOutDate}T00:00:00`).getTime() -
        new Date(`${reservation.checkInDate}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const totalPaid = (reservation.listing?.basePrice ?? 0) * nights;
  const serviceFee = totalPaid * 0.1;

  return {
    id: String(reservation.id),
    guestName: `Guest #${reservation.userId}`,
    propertyName: reservation.listing?.title ?? "Your listing",
    checkIn: reservation.checkInDate,
    checkOut: reservation.checkOutDate,
    bookingDate: reservation.createdAt,
    confirmationCode: reservation.confirmationCode,
    guests:
      reservation.adults +
      reservation.children +
      reservation.infants +
      reservation.pets,
    nights,
    status:
      reservation.status === "PENDING"
        ? "pending"
        : reservation.status === "CONFIRMED"
          ? "accepted"
          : "cancelled",
    totalPaid,
    serviceFee,
    hostPayout: totalPaid - serviceFee,
  };
}
