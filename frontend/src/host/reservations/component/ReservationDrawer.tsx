// ReservationDetailsDrawer.tsx
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { HostReservation } from "./ReservationCard";

type Props = {
  open: boolean;
  reservation: HostReservation | null;
  onClose: () => void;
  onAccept: (reservation: HostReservation) => void;
  onCancel: (reservation: HostReservation) => void;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }} spacing={2}>
      <Typography color="text.secondary">{label}</Typography>

      <Typography
        sx={{
          fontWeight: 500,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export function ReservationDetailsDrawer({
  open,
  reservation,
  onClose,
  onAccept,
  onCancel,
}: Props) {
  if (!reservation) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 480,
            },
          },
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reservation details
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {reservation.confirmationCode}
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 3,
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Guest
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {reservation.guestName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {reservation.guests} guest
                {reservation.guests !== 1 && "s"}
              </Typography>
            </Box>

            <Divider />

            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 600 }}>Booking details</Typography>

              <DetailRow
                label="Check-in"
                value={new Date(reservation.checkIn).toLocaleDateString()}
              />

              <DetailRow
                label="Check-out"
                value={new Date(reservation.checkOut).toLocaleDateString()}
              />

              <DetailRow label="Nights" value={reservation.nights} />

              <DetailRow
                label="Booked on"
                value={new Date(reservation.bookingDate).toLocaleDateString()}
              />

              <DetailRow
                label="Confirmation"
                value={reservation.confirmationCode}
              />
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 600 }}>Payment</Typography>

              <DetailRow
                label="Guest payment"
                value={`€${reservation.totalPaid.toFixed(2)}`}
              />

              <DetailRow
                label="Service fee"
                value={`-€${reservation.serviceFee.toFixed(2)}`}
              />

              <Divider />

              <DetailRow
                label="Host payout"
                value={
                  <Typography
                    component="span"
                    sx={{
                      color: "#0f6f5c",
                      fontWeight: 700,
                    }}
                  >
                    €{reservation.hostPayout.toFixed(2)}
                  </Typography>
                }
              />
            </Stack>
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            p: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {reservation.status === "pending" && (
            <>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => onCancel(reservation)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.2,
                }}
              >
                Decline
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={() => onAccept(reservation)}
                sx={{
                  bgcolor: "#0f6f5c",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.2,
                  "&:hover": {
                    bgcolor: "#0c5c4c",
                  },
                }}
              >
                Accept reservation
              </Button>
            </>
          )}

          {(reservation.status === "accepted" ||
            reservation.status === "hosting") && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => onCancel(reservation)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.2,
              }}
            >
              Cancel reservation
            </Button>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
