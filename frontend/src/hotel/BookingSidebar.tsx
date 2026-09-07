import { Box, ButtonBase, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import type { RoomDto } from "../api/types";
import DatePickerPopover from "../layout/search/DatePickerPopover";
import GuestsPopover from "./GuestsPopover";
import RoomSelectionModal from "./RoomSelectionModal";

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

const dateFieldButtonSx = {
  position: "relative",
  width: "100%",
  minHeight: 68,
  justifyContent: "flex-start",
  px: 1.5,
  pt: 2.1,
  pb: 0.9,
  fontSize: "1.05rem",
  color: "text.primary",
  textAlign: "left",
} as const;

interface BookingSidebarProps {
  rooms: RoomDto[];
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  childrenCount: number;
  infants: number;
  pets: boolean;
  minCheckInDate: string;
  lowestNightlyRate: number | null;
  nights: number;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onInfantsChange: (value: number) => void;
  onPetsChange: (value: boolean) => void;
}

export default function BookingSidebar({
  rooms,
  checkInDate,
  checkOutDate,
  adults,
  childrenCount,
  infants,
  pets,
  minCheckInDate,
  lowestNightlyRate,
  nights,
  onCheckInChange,
  onCheckOutChange,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onPetsChange,
}: BookingSidebarProps) {
  const guestFieldRef = useRef<HTMLDivElement | null>(null);
  const [guestAnchor, setGuestAnchor] = useState<HTMLElement | null>(null);
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [activeDateField, setActiveDateField] = useState<
    "checkIn" | "checkOut"
  >("checkIn");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
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
        {lowestNightlyRate !== null && nights > 0
          ? `$${(lowestNightlyRate * nights).toFixed(2)} total`
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
        <ButtonBase
          onClick={(event) => {
            setActiveDateField("checkIn");
            setDatePickerAnchor(event.currentTarget);
          }}
          aria-haspopup="dialog"
          aria-expanded={Boolean(datePickerAnchor)}
          sx={{
            ...dateFieldButtonSx,
            "&::before": fieldLabelSx("CHECK-IN"),
          }}
        >
          {checkInDate ? dayjs(checkInDate).format("ddd, MMM D") : "Add date"}
        </ButtonBase>
        <ButtonBase
          onClick={(event) => {
            setActiveDateField("checkOut");
            setDatePickerAnchor(event.currentTarget);
          }}
          aria-haspopup="dialog"
          aria-expanded={Boolean(datePickerAnchor)}
          sx={{
            ...dateFieldButtonSx,
            borderLeft: { xs: 0, sm: "1px solid #858585" },
            borderTop: { xs: "1px solid #858585", sm: 0 },
            "&::before": fieldLabelSx("CHECK-OUT"),
          }}
        >
          {checkOutDate ? dayjs(checkOutDate).format("ddd, MMM D") : "Add date"}
        </ButtonBase>
      </Box>

      <DatePickerPopover
        key={datePickerAnchor ? activeDateField : "closed"}
        anchorEl={datePickerAnchor}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        minDate={minCheckInDate}
        initialActiveDate={activeDateField}
        onCheckInChange={onCheckInChange}
        onCheckOutChange={onCheckOutChange}
        onClose={() => setDatePickerAnchor(null)}
      />

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
        onClick={() => setRoomDialogOpen(true)}
        disabled={rooms.length === 0}
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

      <RoomSelectionModal
        rooms={rooms}
        nights={nights}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        open={roomDialogOpen}
        onClose={() => setRoomDialogOpen(false)}
      />

      <Typography
        sx={{
          color: "#555",
          textAlign: "center",
          fontSize: "0.72rem",
          pt: 0.25,
          mt: 1,
        }}
      >
        Select a room type to reserve
      </Typography>
    </Box>
  );
}
