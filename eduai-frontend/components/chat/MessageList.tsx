import { useEffect, useRef } from "react";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xl px-4 py-3 rounded-2xl text-sm shadow-sm ${
            msg.role === "user"
            ? "bg-blue-600 text-white rounded-br-sm prose prose-sm max-w-none prose-invert"
            : msg.status === "error"
            ? "bg-red-50 text-red-800 border border-red-200 prose prose-sm max-w-none"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm prose prose-sm max-w-none"
            }`}
            >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}