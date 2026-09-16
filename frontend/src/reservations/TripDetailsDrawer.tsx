import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDateRange } from "../utils/dateFormatter";
import type { ReservationDto } from "../api/types";

type Props = {
  open: boolean;
  reservation: ReservationDto | null;
  onClose: () => void;
  onCancel: (reservation: ReservationDto) => void;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <Typography color="text.secondary">{label}</Typography>

      <Typography
        component="div"
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

export function TripDetailsDrawer({
  open,
  reservation,
  onClose,
  onCancel,
}: Props) {
  if (!reservation) return null;

  const nights = Math.ceil(
    (new Date(reservation.checkOutDate).getTime() -
      new Date(reservation.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const location = [
    reservation.listing.city,
    reservation.listing.province,
    reservation.listing.country,
  ]
    .filter(Boolean)
    .join(", ");

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
        {/* Header */}
        <Stack
          direction="row"
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Trip details
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {reservation.confirmationCode}
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 3,
          }}
        >
          <Stack spacing={4}>
            {/* Listing */}
            <Stack spacing={2}>
              <Box
                component="img"
                src="/images/hotel-stock.png"
                alt={reservation.listing.title}
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {reservation.listing.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {location}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {/* Booking details */}
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  Booking details
                </Typography>

                <Chip
                  label={reservation.status}
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                  }}
                />
              </Stack>

              <DetailRow
                label="Dates"
                value={formatDateRange(
                  reservation.checkInDate,
                  reservation.checkOutDate,
                )}
              />

              <DetailRow label="Nights" value={nights} />

              <DetailRow
                label="Booked on"
                value={new Date(reservation.createdAt).toLocaleDateString()}
              />

              <DetailRow
                label="Confirmation"
                value={reservation.confirmationCode}
              />
            </Stack>

            <Divider />

            {/* Guests */}
            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 600 }}>Guests</Typography>

              <DetailRow label="Adults" value={reservation.adults} />

              {reservation.children > 0 && (
                <DetailRow label="Children" value={reservation.children} />
              )}

              {reservation.infants > 0 && (
                <DetailRow label="Infants" value={reservation.infants} />
              )}

              {reservation.pets > 0 && (
                <DetailRow label="Pets" value={reservation.pets} />
              )}
            </Stack>

            <Divider />

            {/* Property */}
            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 600 }}>Property</Typography>

              <DetailRow label="Address" value={reservation.listing.address} />

              <DetailRow label="Location" value={location} />
            </Stack>
          </Stack>
        </Box>

        {/* Actions */}
        {reservation.status !== "CANCELLED" && (
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
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
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
