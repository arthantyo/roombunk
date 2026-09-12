import {
  Box,
  Button,
  Card,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";

import { propertyTypes } from "../constants";
import type { PropertyType } from "../types";

type Props = {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
  onNext: () => void;
};

export default function PropertyTypeStep({ value, onChange, onNext }: Props) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Which of these best describes your place?
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {propertyTypes.map((option) => {
          const Icon = option.icon;
          const selected = option.value === value;

          return (
            <Card
              key={option.value}
              variant="outlined"
              sx={{
                flex: 1,
                borderColor: selected ? "primary.main" : undefined,
                borderWidth: selected ? 2 : 1,
              }}
            >
              <CardActionArea
                onClick={() => onChange(option.value)}
                sx={{ p: 2, height: "100%" }}
              >
                <Icon sx={{ fontSize: 32, mb: 1 }} />

                <Typography sx={{ fontWeight: 500 }}>{option.label}</Typography>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>

      <Box>
        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Box>
    </Stack>
  );
}
