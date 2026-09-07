import { useState } from "react";
import dayjs from "dayjs";

import { Box, Divider, Paper, Typography } from "@mui/material";

import {
  CalendarMonthOutlined,
  PeopleOutlined,
  Star,
} from "@mui/icons-material";
import DatePickerDialog from "./DatePickerDialog";
import GuestsDialog from "./GuestsDialog";

type CheckoutSummaryProps = {
  image: string;
  hotelName: string;
  rating: number;

  checkInDate: string;
  checkOutDate: string;

  adults: number;
  childrenCount?: number;
  infants?: number;
  pets?: boolean;

  nightlyRate: number;
  nights: number;
  serviceFee?: number;

  onCheckInChange?: (checkInDate: string) => void;
  onCheckOutChange?: (checkOutDate: string) => void;

  onAdultsChange?: (value: number) => void;
  onChildrenChange?: (value: number) => void;
  onInfantsChange?: (value: number) => void;
  onPetsChange?: (value: boolean) => void;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function CheckoutSummary({
  image,
  hotelName,
  rating,
  checkInDate,
  checkOutDate,
  adults,
  childrenCount = 0,
  infants = 0,
  pets = false,
  nightlyRate,
  nights,
  serviceFee = 0,
  onCheckInChange,
  onCheckOutChange,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onPetsChange,
}: CheckoutSummaryProps) {
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const subtotal = nightlyRate * nights;
  const total = subtotal + serviceFee;

  const guests = adults + childrenCount;

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          position: { md: "sticky" },
          top: { md: 24 },
          boxShadow: "0 6px 22px rgba(0,0,0,0.05)",
          borderColor: "rgba(0,0,0,0.12)",
        }}
      >
        {/* Place */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={image}
            alt={hotelName}
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 1,
              flexShrink: 0,
            }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1.05rem",
                mb: 0.6,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {hotelName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Star sx={{ fontSize: 17 }} />

              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 400,
                }}
              >
                {rating}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Stay details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Dates */}
          <Box
            onClick={() => setDatesOpen(true)}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              py: 1,
              borderRadius: 1,
              cursor: "pointer",

              "&:hover": {
                bgcolor: "grey.50",
              },
            }}
          >
            <CalendarMonthOutlined
              sx={{
                fontSize: 21,
                color: "text.secondary",
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Dates
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                  }}
                >
                  Edit
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  mt: 0.3,
                }}
              >
                {formatDate(checkInDate)} – {formatDate(checkOutDate)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box
            onClick={() => setGuestsOpen(true)}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              cursor: "pointer",
              py: 1,
            }}
          >
            <PeopleOutlined
              sx={{
                fontSize: 21,
                color: "text.secondary",
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Guests
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                  }}
                >
                  Edit
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  mt: 0.3,
                }}
              >
                {guests} {guests === 1 ? "guest" : "guests"}
                {infants > 0 &&
                  `, ${infants} ${infants === 1 ? "infant" : "infants"}`}
                {pets && ", pets"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Price details */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            mb: 2,
          }}
        >
          Price details
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 1.5,
          }}
        >
          <Typography sx={{ color: "text.secondary" }}>
            {formatMoney(nightlyRate)} × {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </Typography>

          <Typography>{formatMoney(subtotal)}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 1.5,
          }}
        >
          <Typography sx={{ color: "text.secondary" }}>Service fee</Typography>

          <Typography>{formatMoney(serviceFee)}</Typography>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Total */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Total EUR
          </Typography>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.15rem",
            }}
          >
            {formatMoney(total)}
          </Typography>
        </Box>
      </Paper>

      <DatePickerDialog
        open={datesOpen}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        minDate={dayjs().format("YYYY-MM-DD")}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
        onClose={() => setDatesOpen(false)}
      />

      <GuestsDialog
        open={guestsOpen}
        adults={adults}
        childrenCount={childrenCount}
        infants={infants}
        pets={pets}
        onAdultsChange={onAdultsChange}
        onChildrenChange={onChildrenChange}
        onInfantsChange={onInfantsChange}
        onPetsChange={onPetsChange}
        onClose={() => setGuestsOpen(false)}
      />
    </>
  );
}
