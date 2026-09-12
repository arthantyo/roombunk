import { useState } from "react";

import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { EmptyReservations } from "./EmptyReservations";
import type { HostReservation } from "./component/ReservationCard";
import { ReservationCard } from "./component/ReservationCard";
import { ReservationDetailsDrawer } from "./component/ReservationDrawer";

type ReservationFilter = "today" | "upcoming";

export default function HostReservations() {
  const [filter, setFilter] = useState<ReservationFilter>("today");

  const [selectedReservation, setSelectedReservation] =
    useState<HostReservation | null>(null);

  const reservations: HostReservation[] = [
    {
      id: "1",
      guestName: "Alex Morgan",
      propertyName: "Modern apartment in Groningen",
      checkIn: "2026-09-15",
      checkOut: "2026-09-19",
      bookingDate: "2026-09-02",
      confirmationCode: "RBK-94821",
      guests: 2,
      nights: 4,
      status: "pending",
      totalPaid: 620,
      serviceFee: 62,
      hostPayout: 558,
    },
  ];

  function handleAccept(reservation: HostReservation) {
    console.log("accept", reservation.id);
  }

  function handleCancel(reservation: HostReservation) {
    console.log("cancel", reservation.id);
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
