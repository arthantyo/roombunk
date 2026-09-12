import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const HOST_FEE_PERCENTAGE = 0.03;

export default function PricingStep({
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [draftPrice, setDraftPrice] = useState(value);

  const price = Number(value) || 0;

  const openPriceEditor = () => {
    setDraftPrice(value);
    setOpen(true);
  };

  const handleSave = () => {
    if (Number(draftPrice) <= 0) return;

    onChange(draftPrice);
    setOpen(false);
  };

  const priceEditor = (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Base price
        </Typography>

        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography color="text.secondary">
        Set the price guests will pay per night.
      </Typography>

      <TextField
        type="number"
        value={draftPrice}
        onChange={(e) => setDraftPrice(e.target.value)}
        autoFocus
        fullWidth
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          },
          htmlInput: {
            min: 1,
            step: "1",
          },
        }}
        sx={{
          "& input": {
            fontSize: "1.8rem",
            fontWeight: 600,
            py: 2,
          },
        }}
      />

      <PriceBreakdown price={Number(draftPrice) || 0} />

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={Number(draftPrice) <= 0}
        onClick={handleSave}
      >
        Save
      </Button>
    </Stack>
  );

  return (
    <>
      <Stack spacing={4}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Set your price
          </Typography>

          <Typography color="text.secondary">
            You can change your pricing at any time.
          </Typography>
        </Box>

        <Box
          onClick={openPriceEditor}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2.5,
            cursor: "pointer",

            "&:hover": {
              borderColor: "text.primary",
            },
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Base price</Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Price guests pay per night
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography sx={{ fontWeight: 600 }}>
                {price > 0 ? `€${price.toFixed(0)}` : "Add price"}
              </Typography>

              <ChevronRightIcon color="action" />
            </Stack>
          </Stack>
        </Box>

        {/* {price > 0 && <PriceBreakdown price={price} />} */}

        <Stack direction="row" spacing={2}>
          <Button onClick={onBack}>Back</Button>

          <Button variant="contained" onClick={onNext} disabled={price <= 0}>
            Next
          </Button>
        </Stack>
      </Stack>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          slotProps={{
            paper: {
              sx: {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                p: 3,
              },
            },
          }}
        >
          {priceEditor}
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="xs"
          slotProps={{
            paper: {
              sx: {
                borderRadius: 1,
              },
            },
          }}
        >
          <DialogContent sx={{ p: 3 }}>{priceEditor}</DialogContent>
        </Dialog>
      )}
    </>
  );
}

function PriceBreakdown({ price }: { price: number }) {
  const hostFee = price * HOST_FEE_PERCENTAGE;
  const earnings = price - hostFee;

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 600,
          mb: 2,
        }}
      >
        Price breakdown
      </Typography>

      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography color="text.secondary">Base price</Typography>

          <Typography>€{price.toFixed(2)}</Typography>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography color="text.secondary">Host service fee (3%)</Typography>

          <Typography>-€{hostFee.toFixed(2)}</Typography>
        </Stack>

        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            pt: 1.5,
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>You earn</Typography>

            <Typography sx={{ fontWeight: 600 }}>
              €{earnings.toFixed(2)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
