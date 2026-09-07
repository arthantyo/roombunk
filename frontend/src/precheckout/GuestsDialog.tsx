import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CounterRow } from "./CounterRow";

type GuestsModalProps = {
  open: boolean;

  adults: number;
  childrenCount: number;
  infants: number;
  pets: boolean;

  onAdultsChange?: (value: number) => void;
  onChildrenChange?: (value: number) => void;
  onInfantsChange?: (value: number) => void;
  onPetsChange?: (value: boolean) => void;

  onClose: () => void;
};

export default function GuestsModal({
  open,
  adults,
  childrenCount,
  infants,
  pets,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onPetsChange,
  onClose,
}: GuestsModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const content = (
    <Stack spacing={2.5}>
      <CounterRow
        label="Adults"
        description="Ages 18+"
        value={adults}
        min={1}
        max={16}
        onChange={onAdultsChange}
      />

      <Divider />

      <CounterRow
        label="Children"
        description="Ages 2-17"
        value={childrenCount}
        min={0}
        max={10}
        onChange={onChildrenChange}
      />

      <Divider />

      <CounterRow
        label="Infants"
        description="Under 2"
        value={infants}
        min={0}
        max={5}
        onChange={onInfantsChange}
      />

      <Divider />

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
            }}
          >
            Pets
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#767676",
            }}
          >
            Bringing a pet?
          </Typography>
        </Stack>

        <Switch
          checked={pets}
          onChange={(event) => onPetsChange?.(event.target.checked)}
          slotProps={{
            input: {
              "aria-label": "Traveling with pets",
            },
          }}
        />
      </Stack>

      <Button
        type="button"
        variant="contained"
        onClick={onClose}
        fullWidth
        sx={{
          mt: 1,
          py: 1.3,
          bgcolor: "#0f6f5c",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,

          "&:hover": {
            bgcolor: "#0c5c4d",
          },
        }}
      >
        Done
      </Button>
    </Stack>
  );
  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
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
          Guests
        </Typography>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: "24px !important",
        }}
      >
        {content}
      </DialogContent>
    </Dialog>
  );
}
