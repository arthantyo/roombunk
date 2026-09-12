import { Button, Stack, TextField } from "@mui/material";

import type { PropertyDetails } from "../types";

type Props = {
  value: PropertyDetails;
  onChange: (value: PropertyDetails) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function PropertyDetailsStep({
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  const update = (field: keyof PropertyDetails, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const isValid = Object.values(value).every((item) => item.trim());

  return (
    <Stack spacing={2}>
      <TextField
        label="Property name"
        value={value.name}
        onChange={(e) => update("name", e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Address"
        value={value.address}
        onChange={(e) => update("address", e.target.value)}
        fullWidth
        required
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="City"
          value={value.city}
          onChange={(e) => update("city", e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="State / Region"
          value={value.state}
          onChange={(e) => update("state", e.target.value)}
          fullWidth
          required
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Zip / Postal code"
          value={value.zipCode}
          onChange={(e) => update("zipCode", e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Country"
          value={value.country}
          onChange={(e) => update("country", e.target.value)}
          fullWidth
          required
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button onClick={onBack}>Back</Button>

        <Button variant="contained" onClick={onNext} disabled={!isValid}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
