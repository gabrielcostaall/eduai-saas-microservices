const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL!;

interface SendMessageParams {
  token: string;
  message: string;
  conversationId: number | null;
}

interface SendMessageResponse {
  conversationId: number;
}

export async function sendMessage({
  token,
  message,
  conversationId,
}: SendMessageParams): Promise<SendMessageResponse> {
  const res = await fetch(chatUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!res.ok) throw new Error("Erro ao enviar mensagem");

  return res.json();
}