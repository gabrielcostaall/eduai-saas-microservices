interface Props {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function MessageInput({ value, loading, onChange, onSend }: Props) {
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex gap-3 max-w-4xl mx-auto">
        <input
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm bg-gray-50"
          placeholder="Digite sua mensagem..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}