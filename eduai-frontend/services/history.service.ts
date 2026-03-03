import { Conversation, Message } from "@/types";

const historyBaseUrl = process.env.NEXT_PUBLIC_HISTORY_URL!;
const deleteBaseUrl = process.env.NEXT_PUBLIC_CONVERSATION_DELETE_URL!;

export async function fetchConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(historyBaseUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error("Erro ao buscar histórico");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMessages(token: string, convId: number): Promise<Message[]> {
  const res = await fetch(`${historyBaseUrl}/${convId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao buscar mensagens");

  return res.json();
}

export async function deleteConversation(token: string, convId: number): Promise<void> {
  const res = await fetch(`${deleteBaseUrl}/${convId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao deletar conversa");
}