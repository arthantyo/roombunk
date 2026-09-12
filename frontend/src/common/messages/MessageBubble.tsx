import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "./types";

type Props = {
  message: Message;
  currentUserRole: "host" | "guest";
};

export function MessageBubble({ message, currentUserRole }: Props) {
  const isOwnMessage = message.sender === currentUserRole;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
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
            textAlign: isOwnMessage ? "right" : "left",
          }}
        >
          {isOwnMessage
            ? message.time
            : `${message.sender === "host" ? "Host" : "Guest"} · ${message.time}`}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.75,
            borderRadius: 3,
            bgcolor: isOwnMessage ? "#3d3d3d" : "white",
            color: isOwnMessage ? "#fff" : "text.primary",
          }}
        >
          <Typography>{message.text}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
