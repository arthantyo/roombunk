import {
  Box,
  Button,
  Dialog,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AmenityItem from "./AmenityItem";
import type { AmenityType } from "../../utils/amenityMap";
import { useState } from "react";
import { AmenitiesModalContent } from "./AmenitiesModalContent";

export function AmenitySection({ amenities }: { amenities: AmenityType[] }) {
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <>
      <Box>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 500, mb: 3 }}>
          What this place offers
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 3,
          }}
        >
          {amenities.slice(0, 6).map((amenity) => (
            <AmenityItem key={amenity} type={amenity} />
          ))}
        </Box>
        <Button
          onClick={() => setAmenitiesOpen(true)}
          variant="contained"
          sx={{
            mt: 3,
            py: 1.2,
            alignSelf: "flex-start",
            textTransform: "none",
            color: "#222222",
            backgroundColor: "#f1f1f1",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#e6e6e6", boxShadow: "none" },
          }}
        >
          Show all amenities
        </Button>
      </Box>
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={amenitiesOpen}
          onClose={() => setAmenitiesOpen(false)}
          slotProps={{
            paper: {
              sx: {
                height: "92dvh",
                borderRadius: "20px 20px 0 0",
                overflow: "hidden",
              },
            },
          }}
        >
          <AmenitiesModalContent
            amenities={amenities}
            onClose={() => setAmenitiesOpen(false)}
          />
        </Drawer>
      ) : (
        <Dialog
          open={amenitiesOpen}
          onClose={() => setAmenitiesOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                maxHeight: "85vh",
              },
            },
          }}
        >
          <AmenitiesModalContent
            amenities={amenities}
            onClose={() => setAmenitiesOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
}
