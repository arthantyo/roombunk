import { Box, Button, Stack, TextField, Typography } from "@mui/material";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const MAX_LENGTH = 50;

export default function TitleStep({ value, onChange, onBack, onNext }: Props) {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Now, let's give your place a title
        </Typography>
      </Box>

      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        multiline
        minRows={3}
        fullWidth
        placeholder="Cozy apartment in the city center"
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
