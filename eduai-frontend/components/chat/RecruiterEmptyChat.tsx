interface Props {
  onNewConversation: () => void;
}
import { useRouter } from "next/navigation";
export default function EmptyChat({ onNewConversation }: Props) {
  const router = useRouter();
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
      <div className="w-15 h-15 rounded-lg flex items-center justify-center">
            <img
              src="/favicon.ico"
              alt="EduAI"
              className="w-15 h-15"
            />
          </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Olá Recrutador(a), seja muito bem vindo(a) ao EduAI!</h2>
        <p className="text-sm font-semibold text-gray-800 mb-1">Este usuário foi criado para facilitar seu acesso, mas seu chat será deletado assim que você fizer logout!</p>
        <p className="text-sm font-semibold text-gray-800 mb-1">Caso queira testar a persistência de dados, por favor, crie um login com suas credenciais clicando <button onClick={() => router.push("/register")} className="text-blue-500 hover:text-blue-700 hover:cursor-pointer underline">aqui</button></p>
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