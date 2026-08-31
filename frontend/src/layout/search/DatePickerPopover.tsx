import { Box, ButtonBase, Popover, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";

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
  const [activeDate, setActiveDate] = useState<"checkIn" | "checkOut">(
    "checkIn",
  );

  function selectCheckIn(value: string) {
    onCheckInChange(value);
    if (checkOut && value > checkOut) onCheckOutChange("");
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
            width: { xs: "calc(100vw - 32px)", sm: "auto" },
            maxWidth: "calc(100vw - 32px)",
            borderRadius: 2,
            boxShadow: "0 18px 38px rgba(0,0,0,0.16)",
          },
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {[
                { label: "From", value: "checkIn" },
                { label: "To", value: "checkOut" },
              ].map((option) => (
                <ButtonBase
                  key={option.value}
                  onClick={() =>
                    setActiveDate(option.value as "checkIn" | "checkOut")
                  }
                  sx={{
                    flex: 1,
                    py: 0.75,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor:
                      activeDate === option.value ? "#0f6f5c" : "#d7d7d7",
                    color:
                      activeDate === option.value
                        ? "#0f6f5c"
                        : "text.secondary",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  }}
                >
                  {option.label}
                </ButtonBase>
              ))}
            </Stack>
            <DateCalendar
              value={
                activeDate === "checkIn"
                  ? checkIn
                    ? dayjs(checkIn)
                    : null
                  : checkOut
                    ? dayjs(checkOut)
                    : null
              }
              minDate={
                activeDate === "checkOut" && checkIn
                  ? dayjs(checkIn)
                  : undefined
              }
              onChange={(date) => {
                const value = date?.format("YYYY-MM-DD") ?? "";
                if (activeDate === "checkIn") {
                  selectCheckIn(value);
                  setActiveDate("checkOut");
                } else {
                  onCheckOutChange(value);
                }
              }}
              sx={{ width: "100%" }}
            />
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ pl: 1.5 }}>
                From
              </Typography>
              <DateCalendar
                value={checkIn ? dayjs(checkIn) : null}
                onChange={(date) => {
                  const value = date?.format("YYYY-MM-DD") ?? "";
                  selectCheckIn(value);
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ pl: 1.5 }}>
                To
              </Typography>
              <DateCalendar
                value={checkOut ? dayjs(checkOut) : null}
                minDate={checkIn ? dayjs(checkIn) : undefined}
                onChange={(date) =>
                  onCheckOutChange(date?.format("YYYY-MM-DD") ?? "")
                }
              />
            </Box>
          </Stack>
        </>
      </LocalizationProvider>
    </Popover>
  );
}
