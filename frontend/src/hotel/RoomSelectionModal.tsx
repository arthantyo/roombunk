import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import type { RoomDto } from "../api/types";

interface RoomSelectionModalProps {
  rooms: RoomDto[];
  nights: number;
  checkInDate: string;
  checkOutDate: string;
  open: boolean;
  onClose: () => void;
}

const roomImages = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=360&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=360&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=360&q=80",
];

export default function RoomSelectionModal({
  rooms,
  nights,
  checkInDate,
  checkOutDate,
  open,
  onClose,
}: RoomSelectionModalProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    rooms[0]?.id ?? null,
  );
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const dateRange = [checkInDate, checkOutDate]
    .filter(Boolean)
    .map((date) =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T00:00:00Z`)),
    )
    .join(" – ");

  const content = (
    <>
      <DialogTitle
        sx={{
          px: { xs: 2.5, sm: 3 },
          pt: "4rem",
          pb: 1.5,
          fontSize: "1.5rem",
          fontWeight: 500,
        }}
      >
        Choose your room
        <IconButton
          onClick={onClose}
          aria-label="Close room selection"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 1,
          mb: 2,
          maxHeight: { xs: "52vh", sm: "min(52vh, 520px)" },
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "grid", gap: 1.25 }}>
          {rooms.map((room, index) => {
            const total = room.pricePerNight * nights;
            const isSelected = selectedRoomId === room.id;

            return (
              <ButtonBase
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "104px minmax(0, 1fr)",
                  gap: 1.5,
                  p: 0.5,
                  border: "1px solid",
                  borderColor: isSelected ? "#222" : "#dedede",
                  borderRadius: 2,
                  textAlign: "left",
                  justifyContent: "stretch",
                  boxShadow: isSelected
                    ? "0 3px 10px rgba(0,0,0,0.12)"
                    : "none",
                }}
              >
                <Box
                  component="img"
                  src={roomImages[index % roomImages.length]}
                  alt=""
                  sx={{
                    width: 104,
                    height: 104,
                    objectFit: "cover",
                    borderRadius: 1.5,
                  }}
                />
                <Box sx={{ py: 1, pr: 1 }}>
                  <Typography sx={{ fontWeight: 400, lineHeight: 1.2 }}>
                    {room.roomType}
                  </Typography>
                  <Typography
                    sx={{ color: "#666", fontSize: "0.8rem", mt: 0.5 }}
                  >
                    Up to {room.capacity} guests · €
                    {room.pricePerNight.toFixed(2)} per night
                  </Typography>
                  <Typography sx={{ fontWeight: 500, mt: 0.75 }}>
                    {nights > 0 ? ` €${total.toFixed(2)}` : "Select dates"}{" "}
                  </Typography>
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: { xs: 2.5, sm: 3 },
          py: 2,
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              sx={{
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {selectedRoom
                ? `€${(selectedRoom.pricePerNight * nights).toFixed(2)}`
                : "Choose a room"}
              <Typography
                component="span"
                sx={{
                  fontWeight: 400,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {" "}
                total
              </Typography>
            </Typography>
          </Box>
          <Typography
            sx={{ fontWeight: 400, fontSize: "0.85rem", color: "#666" }}
          >
            {dateRange || "Choose your dates"}
          </Typography>
        </Box>
        <ButtonBase
          onClick={onClose}
          disabled={!selectedRoom}
          sx={{
            minWidth: 150,
            py: 1.25,
            px: 3,
            borderRadius: 2,
            backgroundColor: "#222",
            color: "#fff",
            fontWeight: 500,
            "&:disabled": { backgroundColor: "#ddd", color: "#888" },
          }}
        >
          Next
        </ButtonBase>
      </DialogActions>
    </>
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
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 2, m: 2, overflow: "hidden" },
        },
      }}
    >
      {content}
    </Dialog>
  );
}
