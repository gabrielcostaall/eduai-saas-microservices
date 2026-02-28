interface Props {
  onNewConversation: () => void;
}

export default function EmptyChat({ onNewConversation }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Como posso ajudar?</h2>
        <p className="text-sm text-gray-500">Selecione uma conversa ou inicie uma nova</p>
      </div>
      <button
        onClick={onNewConversation}
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nova conversa
      </button>
    </div>
  );
}