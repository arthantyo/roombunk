import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AmenityItem from "./AmenityItem";
import type { AmenityType } from "../../utils/amenityMap";
import { amenityCategories } from "../../utils/amenityCategories";

export function AmenitiesModalContent({
  onClose,
  amenities,
}: {
  onClose: () => void;
  amenities: AmenityType[];
}) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          borderBottom: "1px solid #eeeeee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          What this place offers
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, md: 3 },
          py: 1,
        }}
      >
        {amenityCategories.map((category) => {
          const availableAmenities = category.amenities.filter((amenity) =>
            amenities.includes(amenity),
          );

          if (availableAmenities.length === 0) {
            return null;
          }

          return (
            <Box
              key={category.title}
              sx={{
                py: 3,
                borderBottom: "1px solid #eeeeee",

                "&:last-child": {
                  borderBottom: 0,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  mb: 2.5,
                }}
              >
                {category.title}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                }}
              >
                {availableAmenities.map((amenity) => (
                  <AmenityItem key={amenity} type={amenity} />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
