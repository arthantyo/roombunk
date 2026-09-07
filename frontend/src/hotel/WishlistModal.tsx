import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ApiError } from "../api/client";
import {
  addHotelToWishlist,
  createWishlist,
  getMyWishlists,
} from "../api/wishlists";

interface WishlistModalProps {
  hotelId: number;
  hotelName: string;
  open: boolean;
  onClose: () => void;
}

export default function WishlistModal({
  hotelId,
  open,
  onClose,
}: WishlistModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [showNewWishlistInput, setShowNewWishlistInput] = useState(false);

  const isMobile = useMediaQuery("(max-width:599.95px)");
  const queryClient = useQueryClient();

  const {
    data: wishlists = [],
    isLoading,
    error: wishlistError,
  } = useQuery({
    queryKey: ["wishlists"],
    queryFn: getMyWishlists,
    enabled: open,
  });

  const effectiveSelectedId = selectedId ?? wishlists[0]?.id ?? null;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const trimmedName = newWishlistName.trim();

      if (trimmedName) {
        return createWishlist({
          name: trimmedName,
          hotelId,
        });
      }

      if (effectiveSelectedId === null) {
        throw new Error("Select a wishlist first.");
      }

      return addHotelToWishlist(effectiveSelectedId, {
        hotelId,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["wishlists"],
      });

      setSelectedId(null);
      setNewWishlistName("");
      onClose();
    },
  });

  const error = wishlistError ?? saveMutation.error;

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Unable to save or load your wishlists."
        : null;

  const hasWishlists = !isLoading && wishlists.length > 0;
  const isCreatingNew = !hasWishlists || showNewWishlistInput;

  const handleClose = () => {
    setSelectedId(null);
    setNewWishlistName("");
    setShowNewWishlistInput(false);
    saveMutation.reset();
    onClose();
  };

  const content = (
    <>
      <DialogTitle
        sx={{
          px: { xs: 2.5, sm: 3 },
          pt: 3,
          pb: 1,
        }}
      >
        Save to a wishlist
        <IconButton
          onClick={handleClose}
          aria-label="Close wishlist dialog"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 1.5,
        }}
      >
        {errorMessage && (
          <Typography
            role="alert"
            sx={{
              color: "#b42318",
              mb: 1.5,
            }}
          >
            {errorMessage}
          </Typography>
        )}

        <Box sx={{ display: "grid", gap: 1 }}>
          {isLoading && (
            <Typography sx={{ color: "#666" }}>Loading wishlists...</Typography>
          )}

          {hasWishlists &&
            wishlists.map((wishlist) => {
              const isSelected =
                effectiveSelectedId === wishlist.id && !isCreatingNew;

              return (
                <ButtonBase
                  key={wishlist.id}
                  onClick={() => {
                    setSelectedId(wishlist.id);
                    setNewWishlistName("");
                    setShowNewWishlistInput(false);
                    saveMutation.reset();
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    px: 1.5,
                    py: 1.25,
                    border: "1px solid",
                    borderColor: isSelected ? "#222" : "#dedede",
                    borderRadius: 1.5,
                    textAlign: "left",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {wishlist.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.8rem",
                      }}
                    >
                      {wishlist.hotelIds.length} saved
                    </Typography>
                  </Box>

                  {isSelected && <CheckIcon fontSize="small" />}
                </ButtonBase>
              );
            })}

          {hasWishlists && !showNewWishlistInput && (
            <ButtonBase
              onClick={() => {
                setShowNewWishlistInput(true);
                saveMutation.reset();
              }}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                px: 1.5,
                py: 1.25,
                border: "1px dashed #dedede",
                borderRadius: 1.5,
                textAlign: "left",
                color: "#222",
                fontWeight: 500,
              }}
            >
              + Create a new wishlist
            </ButtonBase>
          )}

          {isCreatingNew && !isLoading && (
            <TextField
              autoFocus={hasWishlists}
              label="Wishlist name"
              value={newWishlistName}
              onChange={(e) => setNewWishlistName(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: hasWishlists ? 0.5 : 0 }}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2,
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <Button
          variant="contained"
          onClick={() => saveMutation.mutate()}
          disabled={
            isLoading ||
            saveMutation.isPending ||
            (isCreatingNew ? !newWishlistName.trim() : !effectiveSelectedId)
          }
          sx={{
            backgroundColor: "#222",
            textTransform: "none",
            borderRadius: 1,
            width: "100%",
          }}
        >
          {isCreatingNew ? "Create wishlist" : "Save to wishlist"}
        </Button>
      </DialogActions>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              maxHeight: "90vh",
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
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
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            m: 2,
            overflow: "hidden",
          },
        },
      }}
    >
      {content}
    </Dialog>
  );
}
