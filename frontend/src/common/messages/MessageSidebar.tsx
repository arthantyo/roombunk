import { Box, Chip, Stack, Typography, Zoom } from "@mui/material";

import { ConversationListItem } from "./ConversationListItem";
import type { Conversation } from "./types";

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
        minHeight: 0,
        height: "100%",
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
          flex: 1,
        }}
      >
        {conversations.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 3,
              pb: { xs: 10, md: 12 },
            }}
          >
            <Zoom in>
              <Box
                component="img"
                src="/images/no-msg.png"
                alt="No messages"
                sx={{ width: 260, mb: 1 }}
              />
            </Zoom>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              You don’t have any messages
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: "0.875rem",
                maxWidth: 280,
              }}
            >
              When you receive a new message, it will appear here.
            </Typography>
          </Box>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              active={selectedConversation?.id === conversation.id}
              onClick={() => onSelect(conversation)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
