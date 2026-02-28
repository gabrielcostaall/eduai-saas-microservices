export interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  status?: "error" | "ok";
  created_at?: string;
}

export interface Conversation {
  id: number;
  createdAt: string;
  Messages?: Message[];
  last_message?: Message;
}