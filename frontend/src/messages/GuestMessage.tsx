import { useState } from "react";
import { Box } from "@mui/material";
import { ConversationHeader } from "../common/messages/ConversationHeader";
import { MessageComposer } from "../common/messages/MessageComposer";
import { MessageList } from "../common/messages/MessageList";
import { MessagesSidebar } from "../common/messages/MessageSidebar";

type Conversation = {
  id: string;
  title: string;
  dates: string;
  preview: string;
  avatar: string;
  unread?: boolean;
};

type Message = {
  id: string;
  sender: "host" | "guest";
  text: string;
  time: string;
};

const conversations: Conversation[] = [
  {
    id: "1",
    title: "Apartment in Groningen",
    dates: "Jan 30 – Feb 1",
    preview: "Host: You can pick up the key at reception.",
    avatar: "/images/apartment-placeholder.png",
  },
  {
    id: "2",
    title: "Studio in Amsterdam",
    dates: "Feb 12 – Feb 15",
    preview: "Host: Early check-in should be possible.",
    avatar: "/images/studio-placeholder.png",
  },
];

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "host",
      text: "Normally, you can pick up the key at the reception.",
      time: "4:44 PM",
    },
    {
      id: "2",
      sender: "host",
      text: "Great. What time is check-out?",
      time: "12:51 PM",
    },
  ],

  "2": [
    {
      id: "3",
      sender: "guest",
      text: "Hi, is early check-in possible?",
      time: "10:12 AM",
    },
    {
      id: "4",
      sender: "host",
      text: "Yes, it should be possible from around 1 PM.",
      time: "10:24 AM",
    },
  ],
};

export default function GuestMessages() {
  const currentUserRole = "guest" as const;

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0] ?? null);

  const [message, setMessage] = useState("");

  const [messagesByConversation, setMessagesByConversation] =
    useState<Record<string, Message[]>>(initialMessages);

  const messages = selectedConversation
    ? (messagesByConversation[selectedConversation.id] ?? [])
    : [];

  function handleSend() {
    if (!selectedConversation) return;

    const text = message.trim();

    if (!text) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: currentUserRole,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesByConversation((prev) => ({
      ...prev,

      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] ?? []),
        newMessage,
      ],
    }));

    setMessage("");
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "420px minmax(0, 1fr)",
        },
        width: "100%",
        height: {
          xs: "calc(100vh - 84px - 72px)",
          md: "calc(100vh - 65px)",
        },
        overflow: "hidden",
        px: { xs: 0, md: 4 },
      }}
    >
      <Box
        sx={{
          display: {
            xs: selectedConversation ? "none" : "block",
            md: "block",
          },
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

      {selectedConversation && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <ConversationHeader
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />

          <MessageList messages={messages} currentUserRole={currentUserRole} />

          <MessageComposer
            value={message}
            onChange={setMessage}
            onSend={handleSend}
          />
        </Box>
      )}
    </Box>
  );
}
