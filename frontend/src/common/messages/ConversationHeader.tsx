import { Avatar, Box, Stack, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { Conversation } from "./types";

type Props = {
  conversation: Conversation;
  onBack?: () => void;
};

export function ConversationHeader({ conversation, onBack }: Props) {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        borderBottom: "1px solid #eceae5",
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar
            src={conversation.avatar}
            sx={{
              width: 36,
              height: 36,
            }}
          />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {conversation.title}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
