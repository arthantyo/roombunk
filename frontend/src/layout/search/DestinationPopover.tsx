import HistoryIcon from "@mui/icons-material/History";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  ButtonBase,
  Drawer,
  IconButton,
  InputBase,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

type DestinationPopoverProps = {
  anchorEl: HTMLElement | null;
  destination: string;
  onDestinationChange: (value: string) => void;
  onClose: () => void;
};

const recentLocations = ["Amsterdam, Noord-Holland", "Utrecht, Utrecht"];
const suggestedLocations = [
  "Rotterdam, Zuid-Holland",
  "Maastricht, Limburg",
  "Haarlem, Noord-Holland",
  "Den Haag, Zuid-Holland",
];

function LocationOption({
  location,
  recent = false,
  onSelect,
}: {
  location: string;
  recent?: boolean;
  onSelect: (location: string) => void;
}) {
  return (
    <ButtonBase
      type="button"
      onClick={() => onSelect(location)}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        gap: 1.5,
        px: 1,
        py: 1.1,
        borderRadius: 1,
        textAlign: "left",
        "&:hover": { backgroundColor: "#f3f6f5" },
      }}
    >
      {recent ? (
        <HistoryIcon fontSize="small" sx={{ color: "#0f6f5c" }} />
      ) : (
        <LocationOnOutlinedIcon fontSize="small" sx={{ color: "#0f6f5c" }} />
      )}
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {location}
      </Typography>
    </ButtonBase>
  );
}

export default function DestinationPopover({
  anchorEl,
  destination,
  onDestinationChange,
  onClose,
}: DestinationPopoverProps) {
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const normalizedDestination = destination.trim().toLowerCase();
  const matchingSuggestions = normalizedDestination
    ? suggestedLocations.filter((location) =>
        location.toLowerCase().includes(normalizedDestination),
      )
    : suggestedLocations;

  function selectLocation(location: string) {
    onDestinationChange(location.split(",")[0]);
    onClose();
  }

  const content = (
    <Stack spacing={1.5}>
      <Box>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Recently searched
          </Typography>
          <IconButton
            type="button"
            aria-label="Close destination suggestions"
            onClick={onClose}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stack sx={{ mt: 0.5 }}>
          {recentLocations.map((location) => (
            <LocationOption
              key={location}
              location={location}
              recent
              onSelect={selectLocation}
            />
          ))}
        </Stack>
      </Box>
      <Box sx={{ pt: 1, borderTop: "1px solid #e4e4e4" }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Suggested locations
        </Typography>
        <Stack sx={{ mt: 0.5 }}>
          {matchingSuggestions.length ? (
            matchingSuggestions.map((location) => (
              <LocationOption
                key={location}
                location={location}
                onSelect={selectLocation}
              />
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ px: 1, py: 1.1, color: "text.secondary" }}
            >
              No locations found
            </Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        anchor="bottom"
        open={Boolean(anchorEl)}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              p: 1.5,
              width: "100%",
              maxHeight: "85vh",
              borderRadius: "16px 16px 0 0",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
            px: 1.5,
            border: "1px solid #b8b8b8",
            borderRadius: 1.5,
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            autoFocus
            value={destination}
            onChange={(event) => onDestinationChange(event.target.value)}
            placeholder="Search destinations"
            inputProps={{ "aria-label": "Search destinations" }}
            sx={{ flex: 1, py: 1 }}
          />
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
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            p: 1.5,
            width: 320,
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
