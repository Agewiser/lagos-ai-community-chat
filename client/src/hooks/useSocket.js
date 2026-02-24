import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export function useSocket(username) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
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

    //Add persona to typing list
    socket.on ("typing_start", (persona) => {
      setTypingUsers ((prev) => {
        const list = prev || [];
        const already = list.find((p) => p.name === persona.name);
        if (already) return list;
        return [...list, persona]
      });
    });

    //Remove the persona from the typing list array
    socket.on("typing_stop", ({ name }) => {
     setTypingUsers((prev) => (prev || []).filter((p) => p.name !== name));
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  function sendMessage(text) {
    if (!socketRef.current || !text.trim()) return;
    socketRef.current.emit("user_message", { username, text });
  }

  return { messages, connected, sendMessage, typingUsers };
}