import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { Error } from "../common/Error";
import { getMyReservations } from "../api/reservations";
import { formatDateRange } from "../utils/dateFormatter";
import { NoTrips } from "./NoTrips";
import { TripDetailsDrawer } from "./TripDetailsDrawer";

export default function Reservations() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myReservations"],
    queryFn: getMyReservations,
  });

  const [selectedReservation, setSelectedReservation] = useState<
    (typeof data extends (infer T)[] | undefined ? T : never) | null
  >(null);

  return (
    <>
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          px: { xs: 2, sm: 3 },
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

        {isError && <Error />}

        {isLoading && (
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={90} />
            ))}
          </Stack>
        )}

        {!isLoading && data?.length === 0 && <NoTrips />}

        <Stack spacing={1}>
          {data?.map((reservation) => (
            <Card
              key={reservation.id}
              variant="outlined"
              sx={{
                border: "1px solid #ececec",
                borderRadius: 2.5,
                overflow: "hidden",
              }}
            >
              <CardActionArea
                onClick={() => setSelectedReservation(reservation)}
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
                      {reservation.listing.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {formatDateRange(
                        reservation.checkInDate,
                        reservation.checkOutDate,
                      )}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>

      <TripDetailsDrawer
        open={selectedReservation !== null}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onCancel={(reservation) => {
          console.log("Cancel", reservation.id);
        }}
      />
    </>
  );
}
