import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Box, CircularProgress } from "@mui/material";
import { getMyReservations } from "../api/reservations";
import { getReservationMessages, sendMessage } from "../api/messages";
import { useAuth } from "../auth/useAuth";
import { ConversationHeader } from "../common/messages/ConversationHeader";
import { MessageComposer } from "../common/messages/MessageComposer";
import { MessageList } from "../common/messages/MessageList";
import { MessagesSidebar } from "../common/messages/MessageSidebar";
import type { Conversation, Message } from "../common/messages/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function GuestMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [message, setMessage] = useState("");

  const reservationsQuery = useQuery({
    queryKey: ["my-reservations"],
    queryFn: getMyReservations,
  });

  const conversations = useMemo<Conversation[]>(
    () =>
      (reservationsQuery.data ?? []).map((reservation) => ({
        id: String(reservation.id),
        title: `${reservation.listing.title}`,
        dates: `${formatDate(reservation.checkInDate)} - ${formatDate(reservation.checkOutDate)}`,
        preview: reservation.status.toLowerCase(),
        avatar: "/images/apartment-stock.png",
      })),
    [reservationsQuery.data],
  );

  const reservationId = selectedConversation
    ? Number(selectedConversation.id)
    : null;
  const messagesQuery = useQuery({
    queryKey: ["messages", reservationId],
    queryFn: () => getReservationMessages(reservationId as number),
    enabled: reservationId !== null,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage({ reservationId: reservationId as number, content }),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", reservationId] });
    },
  });

  const messages: Message[] = (messagesQuery.data ?? []).map((item) => ({
    id: String(item.id),
    sender: item.userId === user?.userId ? "guest" : "host",
    text: item.content,
    time: new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  function handleSend() {
    const content = message.trim();
    if (!content || reservationId === null || sendMutation.isPending) return;
    sendMutation.mutate(content);
  }

  if (reservationsQuery.isLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 8 }} />;
  }

  if (reservationsQuery.error) {
    return <Alert severity="error">Unable to load your conversations.</Alert>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "420px minmax(0, 1fr)" },
        width: "100%",
        height: { xs: "calc(100vh - 84px - 72px)", md: "calc(100vh - 65px)" },
        overflow: "hidden",
        px: { xs: 0, md: 4 },
      }}
    >
      <Box
        sx={{
          display: { xs: selectedConversation ? "none" : "block", md: "block" },
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <MessagesSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelect={setSelectedConversation}
        />
      </Box>

      {selectedConversation ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
          }}
        >
          <ConversationHeader
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
          {messagesQuery.isLoading ? (
            <CircularProgress sx={{ m: "auto" }} />
          ) : messagesQuery.error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              Unable to load messages.
            </Alert>
          ) : (
            <MessageList messages={messages} currentUserRole="guest" />
          )}
          <MessageComposer
            value={message}
            onChange={setMessage}
            onSend={handleSend}
          />
        </Box>
      ) : null}
    </Box>
  );
}
