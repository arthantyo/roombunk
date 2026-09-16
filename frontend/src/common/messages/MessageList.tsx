import { useEffect, useRef } from "react";
import { Box, Stack, Typography, Zoom } from "@mui/material";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "./types";
import type { ReservationStatus } from "../../api/types";

type Props = {
  messages: Message[];
  currentUserRole: "host" | "guest";
  reservationStatus: ReservationStatus;
};

export function MessageList({
  messages,
  currentUserRole,
  reservationStatus,
}: Props) {
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

        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {reservationStatus === "PENDING" &&
              (currentUserRole === "guest"
                ? "Awaiting approval from the host"
                : "Reservation awaiting your approval")}

            {reservationStatus === "CONFIRMED" &&
              (currentUserRole === "guest"
                ? "Your reservation has been approved"
                : "You approved this reservation")}

            {reservationStatus === "CANCELLED" &&
              (currentUserRole === "guest"
                ? "Your reservation was declined"
                : "You declined this reservation")}
          </Typography>
        </Box>

        <Box ref={bottomRef} />
      </Stack>
    </Box>
  );
}
