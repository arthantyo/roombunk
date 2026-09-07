import CloseIcon from "@mui/icons-material/Close";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickerDay, type PickerDayProps } from "@mui/x-date-pickers/PickerDay";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

type DatePickerDialogProps = {
  open: boolean;
  checkIn: string;
  checkOut: string;
  minDate?: string;
  initialActiveDate?: "checkIn" | "checkOut";

  onCheckInChange?: (value: string) => void;
  onCheckOutChange?: (value: string) => void;

  onClose: () => void;
};

export default function DatePickerDialog({
  open,
  checkIn,
  checkOut,
  minDate,
  initialActiveDate = "checkIn",
  onCheckInChange,
  onCheckOutChange,
  onClose,
}: DatePickerDialogProps) {
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const [activeDate, setActiveDate] = useState<"checkIn" | "checkOut">(
    initialActiveDate,
  );

  const [draftCheckIn, setDraftCheckIn] = useState(checkIn);
  const [draftCheckOut, setDraftCheckOut] = useState(checkOut);

  useEffect(() => {
    if (!open) return;
  }, [open, checkIn, checkOut, initialActiveDate]);

  function selectDate(value: string) {
    if (activeDate === "checkIn" || !draftCheckIn || draftCheckOut) {
      setDraftCheckIn(value);
      setDraftCheckOut("");
      setActiveDate("checkOut");
      return;
    }

    if (value <= draftCheckIn) {
      setDraftCheckIn(value);
      setDraftCheckOut("");
      setActiveDate("checkOut");
      return;
    }

    setDraftCheckOut(value);
    setActiveDate("checkIn");
  }

  function handleConfirm() {
    if (!draftCheckIn || !draftCheckOut) return;

    onCheckInChange?.(draftCheckIn);
    onCheckOutChange?.(draftCheckOut);

    onClose();
  }

  function handleClose() {
    // Discard changes
    setDraftCheckIn(checkIn);
    setDraftCheckOut(checkOut);

    onClose();
  }

  function RangeDay(props: PickerDayProps) {
    const date = props.day.format("YYYY-MM-DD");

    const isCheckIn = date === draftCheckIn;
    const isCheckOut = date === draftCheckOut;

    const isInRange = Boolean(
      draftCheckIn &&
      draftCheckOut &&
      date > draftCheckIn &&
      date < draftCheckOut,
    );

    return (
      <PickerDay
        {...props}
        selected={false}
        sx={{
          fontSize: {
            xs: "0.875rem",
            sm: "1rem",
          },

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

  const canConfirm =
    Boolean(draftCheckIn) &&
    Boolean(draftCheckOut) &&
    draftCheckOut > draftCheckIn;

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
          <Box
            onClick={() => setActiveDate("checkIn")}
            sx={{
              cursor: "pointer",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              Check in
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              {draftCheckIn
                ? dayjs(draftCheckIn).format("ddd, MMM D")
                : "Select date"}
            </Typography>
          </Box>

          <Box
            onClick={() => setActiveDate("checkOut")}
            sx={{
              borderLeft: "1px solid #e6e6e6",
              pl: 1.5,
              cursor: "pointer",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              Check out
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              {draftCheckOut
                ? dayjs(draftCheckOut).format("ddd, MMM D")
                : "Select date"}
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
          minDate={minDate ? dayjs(minDate) : undefined}
          value={null}
          onChange={(date) => {
            if (!date) return;

            selectDate(date.format("YYYY-MM-DD"));
          }}
          slots={{
            day: RangeDay,
          }}
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
        open={open}
        onClose={() => {
          handleConfirm();
          handleClose();
        }}
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 2.5,
          py: 2,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          borderBottom: "1px solid #eeeeee",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          Change dates
        </Typography>

        <IconButton
          type="button"
          aria-label="Close date picker"
          onClick={handleClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: "20px !important",
        }}
      >
        {content}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #eeeeee",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: "text.primary",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!canConfirm}
          onClick={handleConfirm}
          sx={{
            bgcolor: "#0f6f5c",
            textTransform: "none",
            px: 3,

            "&:hover": {
              bgcolor: "#0b5d4d",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
