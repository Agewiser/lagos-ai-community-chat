// src/App.jsx
import { useState } from "react";
import JoinScreen from "./components/JoinScreen";
import ChatRoom from "./components/ChatRoom";

export default function App() {
  const [username, setUsername] = useState("");

  return (
    <div>
      {username ? (
        <ChatRoom username={username} />
      ) : (
        <JoinScreen onJoin={setUsername} />
      )}
    </div>
  );
}