import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import { getListingById } from "../api/listings";
import { createCheckoutSession } from "../api/payments";
import CheckoutSummary from "./CheckoutSummary";
import PrecheckoutSteps from "./PrecheckoutSteps/PrecheckoutSteps";

export default function Precheckout() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id!),
    enabled: !!id,
  });

  const defaultCheckIn = dayjs().format("YYYY-MM-DD");
  const defaultCheckOut = dayjs().add(1, "day").format("YYYY-MM-DD");

  const checkInDate = searchParams.get("checkIn") ?? defaultCheckIn;
  const checkOutDate = searchParams.get("checkOut") ?? defaultCheckOut;

  const adults = Number(searchParams.get("adults") ?? 1);
  const childrenCount = Number(searchParams.get("children") ?? 0);
  const infants = Number(searchParams.get("infants") ?? 0);
  const pets = searchParams.get("pets") === "true";

  if (isLoading) {
    return (
      <Typography sx={{ maxWidth: 1120, mx: "auto", p: 4 }}>
        Loading booking...
      </Typography>
    );
  }

  if (!listing) {
    return (
      <Typography sx={{ maxWidth: 1120, mx: "auto", p: 4 }}>
        Listing not found.
      </Typography>
    );
  }

  const nightlyRate = listing.basePrice;
  const serviceFee = 0.3;

  const nights = Math.max(
    1,
    dayjs(checkOutDate).diff(dayjs(checkInDate), "day"),
  );

  const updateParam = (key: string, value: string | number | boolean) => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);

      next.set(key, String(value));

      return next;
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 1120,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
        },
        pb: 8,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
          fontWeight: 500,
          mt: { xs: 3, md: 5 },
          letterSpacing: -0.8,
          fontSize: {
            xs: "1.7rem",
            sm: "2rem",
          },
        }}
      >
        Confirm your stay
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1fr) 380px",
          },
          gap: {
            xs: 4,
            md: 8,
          },
          alignItems: "start",
        }}
      >
        <PrecheckoutSteps
          onReviewRequest={async () => {
            const { url } = await createCheckoutSession({
              listingId: listing.id,
              checkInDate,
              checkOutDate,
              adults,
              children: childrenCount,
              infants,
              pets: pets ? 1 : 0,
            });

            window.location.href = url;
          }}
        />
        <CheckoutSummary
          image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          hotelName={listing.title}
          rating={4.78}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          adults={adults}
          childrenCount={childrenCount}
          infants={infants}
          pets={pets}
          nightlyRate={nightlyRate}
          nights={nights}
          serviceFee={serviceFee}
          onAdultsChange={(value) => updateParam("adults", value)}
          onChildrenChange={(value) => updateParam("children", value)}
          onInfantsChange={(value) => updateParam("infants", value)}
          onPetsChange={(value) => updateParam("pets", value)}
          onCheckInChange={(value) => updateParam("checkIn", value)}
          onCheckOutChange={(value) => updateParam("checkOut", value)}
        />
      </Box>
    </Box>
  );
}
