// src/components/ChatRoom.jsx
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import MessageBubble from "./MessageBubble";
import TypingIndicators from "./TypingIndicators";

export default function ChatRoom({ username }) {
  const { messages, connected, sendMessage, typingUsers } = useSocket(username);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇳🇬</span>
          <div>
            <h1 className="font-bold text-sm">Lagos Community Chat</h1>
            <p className="text-xs text-green-200">
              {connected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>

        {/* Online personas */}
        <div className="flex -space-x-1">
          {["👑", "💅", "🙏", "🤖", "🧠", "🔍"].map((avatar, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-green-600 border-2 border-green-700 flex items-center justify-center text-xs"
            >
              {avatar}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && connected && (
          <div className="text-center text-gray-400 text-sm mt-10 animate-pulse">

            Waiting for the room to warm up...
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUser={username}
          />
        ))}

        {/* Invisible div at bottom for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicators  */}
      <TypingIndicators typingUsers={typingUsers} />

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || !connected}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>

    </div>
  );
}