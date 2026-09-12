import {
  BathroomOutlined,
  BedOutlined,
  DoorFrontOutlined,
  GroupsOutlined,
} from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import type { RoomDetails } from "../types";

type Props = {
  value: RoomDetails;
  onChange: (value: RoomDetails) => void;
  onBack: () => void;
  onNext: () => void;
};

type CounterRowProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  onChange: (value: number) => void;
  min?: number;
};

function CounterRow({
  label,
  value,
  icon,
  onChange,
  min = 0,
}: CounterRowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.primary",
          }}
        >
          {icon}
        </Box>

        <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
      </Stack>

      <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
        <IconButton
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            width: 36,
            height: 36,
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography
          sx={{
            minWidth: 24,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {value}
        </Typography>

        <IconButton
          onClick={() => onChange(value + 1)}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            width: 36,
            height: 36,
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default function RoomDetailsStep({
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  const update = (field: keyof RoomDetails, fieldValue: number) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
          }}
        >
          Share some basics about your place
        </Typography>
      </Box>

      <Stack>
        <CounterRow
          label="Guests"
          value={value.guests}
          icon={<GroupsOutlined />}
          onChange={(newValue) => update("guests", newValue)}
          min={1}
        />

        <CounterRow
          label="Bedrooms"
          value={value.bedrooms}
          icon={<DoorFrontOutlined />}
          onChange={(newValue) => update("bedrooms", newValue)}
        />

        <CounterRow
          label="Beds"
          value={value.beds}
          icon={<BedOutlined />}
          onChange={(newValue) => update("beds", newValue)}
          min={1}
        />

        <CounterRow
          label="Bathrooms"
          value={value.bathrooms}
          icon={<BathroomOutlined />}
          onChange={(newValue) => update("bathrooms", newValue)}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button onClick={onBack}>Back</Button>

        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
