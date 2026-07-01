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

export type Model = "llama3.2" | "mistral";

export interface ModelOption {
  id: Model;
  label: string;
  description: string;
}
