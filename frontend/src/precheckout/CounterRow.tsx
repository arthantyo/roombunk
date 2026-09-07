import { Stack, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type CounterRowProps = {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange?: (value: number) => void;
};

export function CounterRow({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: CounterRowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Stack>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#767676",
          }}
        >
          {description}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          border: "1px solid #b8b8b8",
          borderRadius: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange?.(value - 1)}
          size="small"
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography
          variant="body2"
          sx={{
            width: 34,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>

        <IconButton
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange?.(value + 1)}
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
