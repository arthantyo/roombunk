import { useEffect, useRef } from "react";
import { Box, Stack, Zoom } from "@mui/material";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "./types";

type Props = {
  messages: Message[];
  currentUserRole: "host" | "guest";
};

export function MessageList({ messages, currentUserRole }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      <Stack spacing={4}>
        {messages.map((message, index) => {
          const isNewest = index === messages.length - 1;

          return (
            <Zoom
              key={message.id}
              in
              timeout={isNewest ? 250 : 0}
              style={{
                transformOrigin:
                  message.sender === "host" ? "bottom right" : "bottom left",
              }}
            >
              <Box>
                <MessageBubble
                  message={message}
                  currentUserRole={currentUserRole}
                />
              </Box>
            </Zoom>
          );
        })}

        <Box ref={bottomRef} />
      </Stack>
    </Box>
  );
}
