import { Conversation } from "@/types";

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: number) => void;
}

function truncate(text: string, maxLength = 55) {
  if (!text) return "Sem mensagens";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function ConversationItem({ conversation, isActive, onClick, onDelete }: Props) {
  const lastMessage =
    conversation.Messages?.[0]?.content || conversation.last_message?.content || "";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir a conversa ao clicar em deletar
    onDelete(conversation.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group w-full text-left px-3 py-3 rounded-xl transition-colors cursor-pointer flex items-start justify-between gap-2 ${
        isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium mb-1 ${isActive ? "text-blue-700" : "text-gray-400"}`}>
          Conversa #{conversation.id}
        </p>
        <p className="text-sm text-gray-700 leading-snug truncate">
          {truncate(lastMessage)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatDate(conversation.createdAt)}
        </span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-0.5 rounded"
          title="Deletar conversa"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}