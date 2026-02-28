"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/sidebar/Sidebar";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import EmptyChat from "@/components/chat/EmptyChat";

import { fetchConversations, fetchMessages, deleteConversation } from "@/services/history.service";
import { sendMessage } from "@/services/chat.service";

import { Message, Conversation } from "@/types";

export default function Home() {
  const { user, logout, token } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    if (token) {
      fetchConversations(token).then(setConversations).catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    if (conversationId && conversationId !== 0) {
      fetchMessages(token!, conversationId).then(setMessages).catch(console.error);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const data = await sendMessage({ token: token!, message: input, conversationId });

      if (!conversationId || conversationId === 0) {
        setConversationId(data.conversationId);
        fetchConversations(token!).then(setConversations).catch(console.error);
      }

      setInput("");

      if (data.conversationId) {
        fetchMessages(token!, data.conversationId).then(setMessages).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteConversation(token!, id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isInChat = conversationId !== null && conversationId !== 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">EduAI Assistant</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block">Microservices + AI</span>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeId={conversationId}
          onSelect={setConversationId}
          onNewConversation={() => setConversationId(0)}
          onDelete={handleDelete}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {isInChat ? (
            <MessageList messages={messages} />
          ) : (
            <EmptyChat onNewConversation={() => setConversationId(0)} />
          )}

          <MessageInput
            value={input}
            loading={loading}
            onChange={setInput}
            onSend={handleSend}
          />
        </main>
      </div>
    </div>
  );
}