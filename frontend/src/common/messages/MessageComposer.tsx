import { Box, IconButton, InputBase, Paper, Stack } from "@mui/material";

import SendRoundedIcon from "@mui/icons-material/SendRounded";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend?: () => void;
};

export function MessageComposer({ value, onChange, onSend }: Props) {
  const canSend = Boolean(value.trim());

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        bgcolor: "#fff",
        borderTop: "1px solid #eceae5",
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 1,
          px: 2,
          py: 1.5,
        }}
      >
        <InputBase
          fullWidth
          multiline
          minRows={2}
          placeholder="Write a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            fontSize: "1rem",
            alignItems: "flex-start",
          }}
        />

        <Stack
          direction="row"
          sx={{
            mt: 1,
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            disabled={!canSend}
            onClick={onSend}
            sx={{
              bgcolor: canSend ? "#0f6f5c" : "grey.100",
              color: canSend ? "#fff" : "text.disabled",
              "&:hover": {
                bgcolor: canSend ? "#0c5c4c" : "grey.100",
              },
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
}
