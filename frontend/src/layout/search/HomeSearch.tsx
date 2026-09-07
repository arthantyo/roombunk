import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  ButtonBase,
  Container,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePickerPopover from "./DatePickerPopover";
import DestinationPopover from "./DestinationPopover";
import GuestPickerPopover from "./GuestPickerPopover";

export default function HomeSearch() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [pets, setPets] = useState(false);
  const [destinationAnchor, setDestinationAnchor] =
    useState<HTMLElement | null>(null);
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [guestPickerAnchor, setGuestPickerAnchor] =
    useState<HTMLElement | null>(null);
  const searchFormRef = useRef<HTMLFormElement | null>(null);
  const destinationFieldRef = useRef<HTMLDivElement | null>(null);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchParams = new URLSearchParams();

    if (destination.trim()) searchParams.set("destination", destination.trim());
    if (checkIn) searchParams.set("checkIn", checkIn);
    if (checkOut) searchParams.set("checkOut", checkOut);
    if (guests > 1) searchParams.set("guests", String(guests));
    if (rooms > 1) searchParams.set("rooms", String(rooms));
    if (pets) searchParams.set("pets", "true");

    navigate({ pathname: "/", search: searchParams.toString() });
  }

  const dateSummary =
    checkIn && checkOut
      ? `${dayjs(checkIn).format("MMM D")} - ${dayjs(checkOut).format("MMM D")}`
      : "Add dates";
  const guestSummary = `${guests} ${guests === 1 ? "guest" : "guests"}, ${rooms} ${rooms === 1 ? "room" : "rooms"}${pets ? ", pets" : ""}`;
  const fieldSx = {
    flex: 1,
    borderBottom: { xs: "1px solid #ebebeb", lg: "none" },
    borderRight: { lg: "1px solid #ebebeb" },
    px: { xs: 2, md: 3 },
    py: { xs: 1.5, md: 1.8 },
    minHeight: 72,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
  const labelSx = { fontWeight: 700, color: "#222222", mb: 0.35 };
  const pickerButtonSx = {
    alignSelf: "stretch",
    color: "text.secondary",
    fontSize: "0.875rem",
    justifyContent: "flex-start",
    textAlign: "left",
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ px: { xs: 2, md: 3 }, pb: 3 }}
    >
      <Box
        component="form"
        ref={searchFormRef}
        onSubmit={handleSearch}
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: { xs: 2, md: 4 },
          borderRadius: { xs: 2, lg: 999 },
          border: "1px solid #e2e1df",
          background: "rgba(255,255,255,0.72)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
          backdropFilter: "blur(4px)",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{ alignItems: "stretch" }}
        >
          <Box ref={destinationFieldRef} sx={fieldSx}>
            <Typography variant="caption" sx={labelSx}>
              Where
            </Typography>
            <InputBase
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              onFocus={() => setDestinationAnchor(destinationFieldRef.current)}
              onClick={() => setDestinationAnchor(destinationFieldRef.current)}
              placeholder="Search destinations"
              inputProps={{ "aria-label": "Destination" }}
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
                width: "100%",
                "& .MuiInputBase-input": { py: 0, px: 0 },
              }}
            />
          </Box>
          <Box sx={fieldSx}>
            <Typography variant="caption" sx={labelSx}>
              When
            </Typography>
            <ButtonBase
              onClick={() => setDatePickerAnchor(searchFormRef.current)}
              aria-haspopup="dialog"
              aria-expanded={Boolean(datePickerAnchor)}
              sx={pickerButtonSx}
            >
              {dateSummary}
            </ButtonBase>
          </Box>
          <Box sx={fieldSx}>
            <Typography variant="caption" sx={labelSx}>
              Who
            </Typography>
            <ButtonBase
              onClick={() => setGuestPickerAnchor(searchFormRef.current)}
              aria-haspopup="dialog"
              aria-expanded={Boolean(guestPickerAnchor)}
              sx={pickerButtonSx}
            >
              {guestSummary}
            </ButtonBase>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 2, lg: 1.5 },
              py: { xs: 1.25, lg: 1.5 },
            }}
          >
            <IconButton
              type="submit"
              aria-label="Search stays"
              sx={{
                width: { xs: "100%", lg: 52 },
                height: 52,
                background: "#0f6f5c",
                color: "#fff",
                borderRadius: { xs: 1, lg: "50%" },
                ":hover": { background: "#0f6f5c" },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>
      <DestinationPopover
        anchorEl={destinationAnchor}
        destination={destination}
        onDestinationChange={setDestination}
        onClose={() => setDestinationAnchor(null)}
      />
      <DatePickerPopover
        key={datePickerAnchor ? "open" : "closed"}
        anchorEl={datePickerAnchor}
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        onClose={() => setDatePickerAnchor(null)}
      />
      <GuestPickerPopover
        anchorEl={guestPickerAnchor}
        guests={guests}
        rooms={rooms}
        pets={pets}
        onGuestsChange={setGuests}
        onRoomsChange={setRooms}
        onPetsChange={setPets}
        onClose={() => setGuestPickerAnchor(null)}
      />
    </Container>
  );
}
