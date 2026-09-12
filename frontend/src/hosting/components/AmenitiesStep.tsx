import {
  Box,
  Button,
  Card,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";
import { amenityMap, type AmenityType } from "../../utils/amenityMap";

type Props = {
  value: AmenityType[];
  onChange: (value: AmenityType[]) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function AmenitiesStep({
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  const toggleAmenity = (amenity: AmenityType) => {
    if (value.includes(amenity)) {
      onChange(value.filter((item) => item !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Tell guests what your place has to offer
        </Typography>

        <Typography color="text.secondary">
          You can add more amenities after you publish your listing.
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {Object.entries(amenityMap).map(([key, amenity]) => {
            const amenityType = key as AmenityType;
            const Icon = amenity.icon;
            const selected = value.includes(amenityType);

            return (
              <Card
                key={amenityType}
                variant="outlined"
                sx={{
                  gap: 1,
                  borderRadius: 3,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? "primary.main" : "divider",
                }}
              >
                <CardActionArea
                  onClick={() => toggleAmenity(amenityType)}
                  sx={{
                    p: 2,
                    minHeight: 100,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <Icon sx={{ fontSize: 34 }} />

                  <Typography
                    sx={{
                      mt: 2,
                      fontWeight: 500,
                    }}
                  >
                    {amenity.label}
                  </Typography>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button onClick={onBack}>Back</Button>

        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
