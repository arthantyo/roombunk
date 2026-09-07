import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Popover, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickerDay, type PickerDayProps } from "@mui/x-date-pickers/PickerDay";
import dayjs from "dayjs";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

type DatePickerPopoverProps = {
  anchorEl: HTMLElement | null;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onClose: () => void;
};

export default function DatePickerPopover({
  anchorEl,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onClose,
}: DatePickerPopoverProps) {
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const [activeDate, setActiveDate] = useState<"checkIn" | "checkOut">(
    "checkIn",
  );

  function selectDate(value: string) {
    if (activeDate === "checkIn" || !checkIn || checkOut) {
      onCheckInChange(value);
      onCheckOutChange("");
      setActiveDate("checkOut");
      return;
    }

    if (value < checkIn) {
      onCheckInChange(value);
      return;
    }

    onCheckOutChange(value);
    setActiveDate("checkIn");
  }

  function RangeDay(props: PickerDayProps) {
    const date = props.day.format("YYYY-MM-DD");
    const isCheckIn = date === checkIn;
    const isCheckOut = date === checkOut;
    const isInRange = Boolean(
      checkIn && checkOut && date > checkIn && date < checkOut,
    );

    return (
      <PickerDay
        {...props}
        selected={false}
        sx={{
          fontSize: { xs: "0.875rem", sm: "1rem" },

          outline: props.today ? "2px solid #0f6f5c" : "none",
          borderRadius: "50%",
          bgcolor: isInRange ? "#dcefe9" : "transparent",
          color: isInRange ? "#075545" : "inherit",

          "&:hover, &:focus": {
            bgcolor: isCheckIn || isCheckOut ? "#0b5d4d" : "#dcefe9",
          },

          ...(isCheckIn || isCheckOut
            ? {
                bgcolor: "#0f6f5c",
                color: "#ffffff",
                fontWeight: 700,
                "&:hover, &:focus": {
                  bgcolor: "#0b5d4d",
                },
              }
            : {}),
        }}
      />
    );
  }

  const content = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            px: 1.5,
            pt: 0.75,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Check in
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {checkIn ? dayjs(checkIn).format("ddd, MMM D") : "Select date"}
            </Typography>
          </Box>
          <Box sx={{ borderLeft: "1px solid #e6e6e6", pl: 1.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Check out
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {checkOut ? dayjs(checkOut).format("ddd, MMM D") : "Select date"}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            px: 1.5,
            pt: 1.25,
            color: "#0f6f5c",
            fontWeight: 700,
          }}
        >
          {activeDate === "checkIn"
            ? "Choose your check-in date"
            : "Choose your check-out date"}
        </Typography>
        <DateCalendar
          disableHighlightToday
          disablePast
          value={null}
          onChange={(date) => {
            if (date) selectDate(date.format("YYYY-MM-DD"));
          }}
          slots={{ day: RangeDay }}
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: "none",
            mt: 1,

            "& .MuiPickersCalendarHeader-root": {
              px: 2,
            },

            "& .MuiPickersCalendarHeader-label": {
              fontSize: "1.1rem",
              fontWeight: 600,
            },

            "& .MuiDayCalendar-weekDayLabel": {
              width: 44,
              height: 44,
              fontSize: "0.95rem",
            },

            "& .MuiPickersDay-root": {
              width: 44,
              height: 44,
              fontSize: "1rem",
            },

            "& .MuiDayCalendar-weekContainer": {
              justifyContent: "space-around",
              marginBottom: "0.6rem",
            },

            "& .MuiDayCalendar-header": {
              justifyContent: "space-around",
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={Boolean(anchorEl)}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              p: 1,
              pb: 2,
              width: "100%",
              maxHeight: "92vh",
              boxSizing: "border-box",
              borderRadius: "16px 16px 0 0",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            type="button"
            aria-label="Close date picker"
            onClick={onClose}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {content}
      </Drawer>
    );
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            p: { xs: 1, sm: 2 },
            pb: { xs: 2, sm: 3 },
            width: `25rem`,
            maxWidth: "calc(100vw - 32px)",
            boxSizing: "border-box",
            borderRadius: 2,
            boxShadow: "0 18px 38px rgba(0,0,0,0.16)",
          },
        },
      }}
    >
      {content}
    </Popover>
  );
}
