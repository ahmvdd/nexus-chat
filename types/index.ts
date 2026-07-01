export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export type Model = "claude-sonnet-4-6" | "claude-haiku-4-5-20251001";

export interface ModelOption {
  id: Model;
  label: string;
  description: string;
}
