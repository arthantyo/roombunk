import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { getMyReservations } from "../api/reservations";
import type { ReservationStatus } from "../api/types";

const statusColor: Record<
  ReservationStatus,
  "default" | "success" | "warning" | "error"
> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  EXPIRED: "default",
};

export default function Reservations() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myReservations"],
    queryFn: getMyReservations,
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        My trips
      </Typography>

      {isError && (
        <Alert severity="error">Unable to load your reservations.</Alert>
      )}

      {isLoading && (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={90} />
          ))}
        </Stack>
      )}

      {!isLoading && data?.length === 0 && (
        <Typography color="text.secondary">
          You don't have any reservations yet.
        </Typography>
      )}

      <Stack spacing={2}>
        {data?.map((reservation) => (
          <Card key={reservation.id} variant="outlined">
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <EventIcon color="action" />
                <Typography variant="body1">
                  {reservation.checkInDate} &rarr; {reservation.checkOutDate}
                </Typography>
              </Stack>
              <Chip
                label={reservation.status}
                color={statusColor[reservation.status]}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
