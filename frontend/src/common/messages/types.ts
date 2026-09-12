export type Conversation = {
  id: string;
  title: string;
  dates: string;
  preview: string;
  avatar: string;
  unread?: boolean;
};

export type Message = {
  id: string;
  sender: "host" | "guest";
  text: string;
  time: string;
};
