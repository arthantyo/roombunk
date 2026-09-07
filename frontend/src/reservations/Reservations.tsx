import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { getMyReservations } from "../api/reservations";
import { formatDateRange } from "../utils/dateFormatter";

export default function Reservations() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myReservations"],
    queryFn: getMyReservations,
  });

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 500,
          mt: 5,
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        Trips
      </Typography>

      {isError && (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Zoom in>
            <Box
              component="img"
              src="/images/server-error.png"
              alt="Server error"
              sx={{
                width: "100%",
                maxWidth: 300,
                height: "auto",
                mb: 2,
              }}
            />
          </Zoom>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Something unexpected happened.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            There was an error while loading your reservations. Please try again
            later.
          </Typography>
        </Box>
      )}

      {isLoading && (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={90} />
          ))}
        </Stack>
      )}

      {!isLoading && data?.length === 0 && (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Zoom in>
            <Box
              component="img"
              src="/images/no-trips.png"
              alt="No trips"
              sx={{
                width: "100%",
                maxWidth: 300,
                height: "auto",
                mb: 2,
              }}
            />
          </Zoom>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            No trips yet
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            When you book a stay, your trips will appear here.
          </Typography>
        </Box>
      )}

      <Stack spacing={1}>
        {data?.map((reservation) => (
          <Card
            key={reservation.id}
            variant="outlined"
            sx={{
              border: "1px solid #ececec",
              borderRadius: 2.5,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: { xs: "0.6rem", sm: ".8rem" },

                "&:last-child": {
                  pb: { xs: "0.6rem", sm: ".8rem" },
                },
              }}
            >
              <Box
                component="img"
                src="/images/hotel-stock.png"
                alt=""
                sx={{
                  width: { xs: 90, sm: 104 },
                  height: { xs: 90, sm: 104 },
                  objectFit: "cover",
                  borderRadius: 1.5,
                  flexShrink: 0,
                }}
              />

              <Stack
                spacing={0.5}
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Room {reservation.roomId}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {formatDateRange(
                    reservation.checkInDate,
                    reservation.checkOutDate,
                  )}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
