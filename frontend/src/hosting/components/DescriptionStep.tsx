import { Box, Button, Stack, TextField, Typography } from "@mui/material";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const MAX_LENGTH = 500;

export default function DescriptionStep({
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Create your description
        </Typography>

        <Typography color="text.secondary">
          Share what makes your place special.
        </Typography>
      </Box>

      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        multiline
        minRows={6}
        fullWidth
        placeholder="Tell guests about your place..."
        slotProps={{
          htmlInput: {
            maxLength: MAX_LENGTH,
          },
        }}
        helperText={`${value.length}/${MAX_LENGTH}`}
      />

      <Stack direction="row" spacing={2}>
        <Button onClick={onBack}>Back</Button>

        <Button variant="contained" onClick={onNext} disabled={!value.trim()}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
