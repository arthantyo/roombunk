import CloseIcon from "@mui/icons-material/Close";
import { DeleteOutlineRounded, EditOutlined } from "@mui/icons-material";
import { Alert } from "@mui/material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import type { HostListing } from "../types";

type Props = {
  open: boolean;
  listing: HostListing | null;
  onClose: () => void;
  onDelete: (listing: HostListing) => void;
  deleteError: string | null;
};

export function ListingActions({
  open,
  listing,
  onClose,
  onDelete,
  deleteError,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleEdit = () => {
    if (!listing) return;

    onClose();
    navigate(`/host/listings/${listing.id}`);
  };

  const content = listing ? (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6">{listing.title}</Typography>

          <Typography variant="body2" color="text.secondary">
            {listing.location}
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Stack>

      <Stack spacing={1.5}>
        {deleteError && <Alert severity="error">{deleteError}</Alert>}
        <Button
          fullWidth
          variant="contained"
          startIcon={<EditOutlined />}
          onClick={handleEdit}
        >
          Edit listing
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineRounded />}
          onClick={() => {
            if (listing) {
              onDelete(listing);
            }
          }}
        >
          Delete listing
        </Button>
      </Stack>
    </Box>
  ) : null;

  if (isMobile) {
    return (
      <Drawer anchor="bottom" open={open} onClose={onClose}>
        {content}
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent sx={{ p: 0 }}>{content}</DialogContent>
    </Dialog>
  );
}
