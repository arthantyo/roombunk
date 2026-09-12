import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "./types";

type Props = {
  message: Message;
  currentUserRole: "host" | "guest";
};

export function MessageBubble({ message, currentUserRole }: Props) {
  const isHost = currentUserRole === "host";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isHost ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          maxWidth: {
            xs: "90%",
            md: "72%",
          },
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mb: 0.5,
            textAlign: isHost ? "right" : "left",
          }}
        >
          {isHost ? message.time : `Guest · ${message.time}`}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.75,
            borderRadius: 3,
            bgcolor: isHost ? "#3d3d3d" : "white",
            color: isHost ? "#fff" : "text.primary",
          }}
        >
          <Typography>{message.text}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
