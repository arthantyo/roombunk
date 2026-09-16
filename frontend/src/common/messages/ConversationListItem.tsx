import { Box, Stack, Typography } from "@mui/material";
import type { Conversation } from "./types";

type Props = {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
};

export function ConversationListItem({ conversation, active, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.2,
        borderRadius: 1,
        border: "1px solid",
        borderColor: active ? "grey.400" : "grey.300",
        cursor: "pointer",
        bgcolor: active ? "grey.200" : "transparent",
        transition: "background-color 0.15s ease",

        "&:hover": {
          bgcolor: active ? "grey.300" : "grey.300",
        },
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box
          component="img"
          src={conversation.avatar}
          sx={{
            width: 72,
            height: 72,
            bgcolor: "grey.200",
            borderRadius: 1,
            border: "1px solid grey.200",
            objectFit: "cover",
          }}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between" }}
            spacing={1}
          >
            <Typography variant="body2" color="text.secondary">
              {conversation.dates}
            </Typography>
          </Stack>

          <Typography sx={{ fontWeight: 600 }}>{conversation.title}</Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Click to start a conversation
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
