import { Box, ButtonBase, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ListingDto } from "../api/types";
import GuestsPopover from "./GuestsPopover";

function fieldLabelSx(label: string) {
  return {
    content: `"${label}"`,
    position: "absolute",
    top: 9,
    left: 12,
    zIndex: 1,
    color: "#222",
    fontSize: "0.65rem",
    fontWeight: 800,
    pointerEvents: "none",
  } as const;
}

const dateInputSx = {
  "& .MuiOutlinedInput-notchedOutline": { border: 0 },
  "& .MuiInputBase-input": {
    px: 1.5,
    py: 3.4,
    fontSize: "1.05rem",
  },
  "& .MuiInputBase-root": { borderRadius: 0 },
} as const;

interface BookingSidebarProps {
  listing: ListingDto;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount: number;
  infants: number;
  pets: boolean;
  minCheckInDate: string;
  nights: number;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onInfantsChange: (value: number) => void;
  onPetsChange: (value: boolean) => void;
}

export default function BookingSidebar({
  listing,
  checkInDate,
  checkOutDate,
  adults,
  childrenCount,
  infants,
  pets,
  minCheckInDate,
  nights,
  onCheckInChange,
  onCheckOutChange,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onPetsChange,
}: BookingSidebarProps) {
  const guestFieldRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [guestAnchor, setGuestAnchor] = useState<HTMLElement | null>(null);
  const totalGuests = adults + childrenCount;
  const guestSummaryParts = [
    `${totalGuests} guest${totalGuests === 1 ? "" : "s"}`,
  ];
  if (infants > 0) {
    guestSummaryParts.push(`${infants} infant${infants === 1 ? "" : "s"}`);
  }
  if (pets) {
    guestSummaryParts.push("pets");
  }
  const guestSummary = guestSummaryParts.join(", ");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        minWidth: 260,
        width: { xs: "100%", md: "100%" },
        p: 3,
        borderRadius: 2,
        background: "#ffffff",
        border: "1px solid #ececec",
        boxShadow: "0 5px 18px rgba(0,0,0,0.10)",
        position: { md: "sticky" },
        top: { md: 24 },
      }}
    >
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "1.4rem",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          mb: 2,
        }}
      >
        {nights > 0
          ? `€${(listing.basePrice * nights).toFixed(2)} total`
          : "Choose your dates"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          border: "1px solid #858585",
          borderBottom: { xs: "1px solid #858585", sm: 0 },
          borderRadius: { xs: 1, sm: "10px 10px 0 0" },
          overflow: "hidden",
          height: { xs: "auto", sm: 68 },
        }}
      >
        <TextField
          type="date"
          value={checkInDate}
          onChange={(e) => onCheckInChange(e.target.value)}
          slotProps={{
            htmlInput: { min: minCheckInDate },
          }}
          fullWidth
          sx={{
            ...dateInputSx,
            "&::before": fieldLabelSx("CHECK-IN"),
          }}
        />
        <TextField
          type="date"
          value={checkOutDate}
          onChange={(e) => onCheckOutChange(e.target.value)}
          slotProps={{
            htmlInput: { min: checkInDate },
          }}
          fullWidth
          sx={{
            ...dateInputSx,
            height: "100%",
            borderLeft: { xs: 0, sm: "1px solid #858585" },
            borderTop: { xs: "1px solid #858585", sm: 0 },
            "&::before": fieldLabelSx("CHECK-OUT"),
          }}
        />
      </Box>

      <Box
        ref={guestFieldRef}
        sx={{
          position: "relative",
          border: "1px solid #858585",
          mt: { xs: 1, sm: 0 },
          borderRadius: { xs: 1, sm: "0 0 10px 10px" },
          "&::before": fieldLabelSx("GUESTS"),
        }}
      >
        <ButtonBase
          onClick={() => setGuestAnchor(guestFieldRef.current)}
          aria-haspopup="dialog"
          aria-expanded={Boolean(guestAnchor)}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            px: 1.5,
            pt: 3.5,
            pb: 1.5,
            fontSize: "1rem",
            color: "text.primary",
          }}
        >
          {guestSummary}
        </ButtonBase>
      </Box>
      <GuestsPopover
        anchorEl={guestAnchor}
        adults={adults}
        childrenCount={childrenCount}
        infants={infants}
        pets={pets}
        onAdultsChange={onAdultsChange}
        onChildrenChange={onChildrenChange}
        onInfantsChange={onInfantsChange}
        onPetsChange={onPetsChange}
        onClose={() => setGuestAnchor(null)}
      />
      <ButtonBase
        onClick={() =>
          navigate({
            pathname: `/book/${listing.id}`,
            search: new URLSearchParams({
              checkIn: checkInDate,
              checkOut: checkOutDate,
              adults: String(adults),
              children: String(childrenCount),
              infants: String(infants),
              pets: String(pets),
            }).toString(),
          })
        }
        disabled={
          nights <= 0 ||
          (listing.maxGuests != null && totalGuests > listing.maxGuests)
        }
        aria-haspopup="dialog"
        sx={{
          mt: 2,
          py: 1.6,
          px: 3,
          borderRadius: 2,
          backgroundColor: "#0f6f5c",
          color: "#fff",
        }}
      >
        Reserve
      </ButtonBase>

      <Typography
        sx={{
          color: "#555",
          textAlign: "center",
          fontSize: "0.72rem",
          pt: 0.25,
          mt: 1,
        }}
      >
        Your host will accept or reject the reservation.
      </Typography>
    </Box>
  );
}
