import { Box, Typography } from "@mui/material";
import { amenityMap } from "../../utils/amenityMap";

type AmenityType = keyof typeof amenityMap;

interface AmenityItemProps {
  type: AmenityType;
}

export default function AmenityItem({ type }: AmenityItemProps) {
  const amenity = amenityMap[type];
  const Icon = amenity.icon;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Icon sx={{ color: "#222", fontSize: 28 }} />

      <Typography sx={{ fontSize: "1rem" }}>{amenity.label}</Typography>
    </Box>
  );
}
