import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

type GuestPickerPopoverProps = {
  anchorEl: HTMLElement | null;
  guests: number;
  rooms: number;
  pets: boolean;
  onGuestsChange: (value: number) => void;
  onRoomsChange: (value: number) => void;
  onPetsChange: (value: boolean) => void;
  onClose: () => void;
};

type CounterRowProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function CounterRow({ label, value, onChange }: CounterRowProps) {
  return (
    <Stack
      direction="row"
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          border: "1px solid #b8b8b8",
          borderRadius: 1,
        }}
      >
        <IconButton
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= 1}
          onClick={() => onChange(value - 1)}
          size="small"
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ width: 34, textAlign: "center", fontWeight: 600 }}
        >
          {value}
        </Typography>
        <IconButton
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= 20}
          onClick={() => onChange(value + 1)}
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default function GuestPickerPopover({
  anchorEl,
  guests,
  rooms,
  pets,
  onGuestsChange,
  onRoomsChange,
  onPetsChange,
  onClose,
}: GuestPickerPopoverProps) {
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
            p: 2.5,
            width: 300,
            maxWidth: "calc(100vw - 32px)",
            borderRadius: 2,
            boxShadow: "0 18px 38px rgba(0,0,0,0.16)",
          },
        },
      }}
    >
      <Stack spacing={2}>
        <CounterRow label="Guests" value={guests} onChange={onGuestsChange} />
        <CounterRow label="Rooms" value={rooms} onChange={onRoomsChange} />
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            pt: 1,
            borderTop: "1px solid #e4e4e4",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Pets
          </Typography>
          <Switch
            checked={pets}
            onChange={(event) => onPetsChange(event.target.checked)}
            slotProps={{ input: { "aria-label": "Traveling with pets" } }}
          />
        </Stack>
        <Button type="button" variant="outlined" onClick={onClose}>
          Done
        </Button>
      </Stack>
    </Popover>
  );
}
