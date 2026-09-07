import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  Drawer,
  IconButton,
  Popover,
  Stack,
  Switch,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";

type GuestsPopoverProps = {
  anchorEl: HTMLElement | null;
  adults: number;
  childrenCount: number;
  infants: number;
  pets: boolean;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onInfantsChange: (value: number) => void;
  onPetsChange: (value: boolean) => void;
  onClose: () => void;
};

type CounterRowProps = {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function CounterRow({
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
      }}
    >
      <Stack>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: "#767676" }}>
          {description}
        </Typography>
      </Stack>
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
          disabled={value <= min}
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
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default function GuestsPopover({
  anchorEl,
  adults,
  childrenCount,
  infants,
  pets,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onPetsChange,
  onClose,
}: GuestsPopoverProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const content = (
    <Stack spacing={2}>
      <CounterRow
        label="Adults"
        description="Ages 18+"
        value={adults}
        min={1}
        max={16}
        onChange={onAdultsChange}
      />
      <CounterRow
        label="Children"
        description="Ages 2-17"
        value={childrenCount}
        min={0}
        max={10}
        onChange={onChildrenChange}
      />
      <CounterRow
        label="Infants"
        description="Under 2"
        value={infants}
        min={0}
        max={5}
        onChange={onInfantsChange}
      />
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
              p: 2.5,
              pb: "max(20px, env(safe-area-inset-bottom))",
              borderRadius: "16px 16px 0 0",
            },
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      marginThreshold={0}
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
      {content}
    </Popover>
  );
}
