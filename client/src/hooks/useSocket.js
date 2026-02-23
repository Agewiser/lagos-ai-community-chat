import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export function useSocket(username) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    if (socketRef.current) return;

    socketRef.current = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      secure: true,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected, emitting user_joined for:", username);
      socket.emit("user_joined", { username });
    });

    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  function sendMessage(text) {
    if (!socketRef.current || !text.trim()) return;
    socketRef.current.emit("user_message", { username, text });
  }

  return { messages, connected, sendMessage };
}