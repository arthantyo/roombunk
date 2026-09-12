// ReservationCard.tsx
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export type HostReservation = {
  id: string;
  guestName: string;
  guestAvatar?: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  bookingDate: string;
  confirmationCode: string;
  guests: number;
  nights: number;
  status: "pending" | "accepted" | "cancelled" | "hosting";
  totalPaid: number;
  serviceFee: number;
  hostPayout: number;
};

type Props = {
  reservation: HostReservation;
  onClick: () => void;
};

function getArrivalLabel(reservation: HostReservation) {
  if (reservation.status === "hosting") {
    return "Currently hosting";
  }

  const today = new Date();
  const checkIn = new Date(reservation.checkIn);

  today.setHours(0, 0, 0, 0);
  checkIn.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "Arriving today";
  if (diff === 1) return "Arrives tomorrow";
  if (diff > 1) return `Arrives in ${diff} days`;

  return "Stay started";
}

function getStatusStyles(status: HostReservation["status"]) {
  switch (status) {
    case "hosting":
      return {
        bgcolor: "#e4f3ef",
        color: "#0f6f5c",
      };

    case "accepted":
      return {
        bgcolor: "#eef7f4",
        color: "#0f6f5c",
      };

    case "pending":
      return {
        bgcolor: "#fff7e6",
        color: "#9a6700",
      };

    case "cancelled":
      return {
        bgcolor: "#f7eeee",
        color: "#a33a3a",
      };
  }
}

export function ReservationCard({ reservation, onClick }: Props) {
  const statusStyles = getStatusStyles(reservation.status);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        borderColor: "#e7e5e1",
        bgcolor: "#fff",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          p: { xs: 2, sm: 2.5 },

          "& .MuiCardActionArea-focusHighlight": {
            bgcolor: "transparent",
          },
        }}
      >
        <Stack spacing={2}>
          {/* Top row */}
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color:
                  reservation.status === "hosting"
                    ? "#0f6f5c"
                    : "text.secondary",
              }}
            >
              {getArrivalLabel(reservation)}
            </Typography>

            <Chip
              label={reservation.status}
              size="small"
              sx={{
                ...statusStyles,
                height: 26,
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: "0.75rem",

                "& .MuiChip-label": {
                  px: 1.2,
                },
              }}
            />
          </Stack>

          {/* Guest */}
          <Stack direction="row" spacing={1.75} sx={{ alignItems: "center" }}>
            <Avatar
              src={reservation.guestAvatar}
              alt={reservation.guestName}
              sx={{
                width: 52,
                height: 52,
                bgcolor: "#e8efed",
                color: "#0f6f5c",
                fontWeight: 600,
              }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  lineHeight: 1.3,
                }}
              >
                {reservation.guestName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ mt: 0.25 }}
              >
                {reservation.propertyName}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
