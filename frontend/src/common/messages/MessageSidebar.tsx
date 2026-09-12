import { Box, Chip, Stack, Typography } from "@mui/material";

import { ConversationListItem } from "./ConversationListItem";
import type { Conversation } from "../types";

type Props = {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelect: (conversation: Conversation) => void;
};

export function MessagesSidebar({
  conversations,
  selectedConversation,
  onSelect,
}: Props) {
  return (
    <Box
      sx={{
        borderRight: { md: "1px solid #eceae5" },
        display: {
          xs: selectedConversation ? "none" : "flex",
          md: "flex",
        },
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Box sx={{ px: 3, py: 3 }}>
        <Stack
          direction="row"
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Messages
          </Typography>

          {/* <Stack direction="row" spacing={1}>
            <IconButton
              sx={{
                bgcolor: "grey.100",
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: "grey.100",
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
            >
              <SettingsOutlinedIcon />
            </IconButton>
          </Stack> */}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Chip
            label="All"
            sx={{
              bgcolor: "#222",
              color: "#fff",
              fontWeight: 600,
            }}
          />

          <Chip
            label="Unread"
            variant="outlined"
            sx={{
              fontWeight: 600,
            }}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          px: 2,
          overflowY: "auto",
          gap: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            active={selectedConversation?.id === conversation.id}
            onClick={() => onSelect(conversation)}
          />
        ))}
      </Box>
    </Box>
  );
}
