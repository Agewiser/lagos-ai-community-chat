import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

export function useSocket(username) {
const [messages, setMessages] = useState([]);
const [connected, setConnected] = useState(false);
const socketRef = useRef(null);

useEffect (() => {
        if (!username) return;

        //create the socket connection here
    socketRef.current = io(SERVER_URL);
    const socket = socketRef.current;

    socket.on("connect", ()  => {
        setConnected(true);

        socket.emit("new-user", {username});
    });

    //load existing chat history
    socket.on("chat-history", (history) => {
        setMessages(history);
    });

    //listen for new messages and add them to the list

    socket.on ("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
    });

    //clean up once it unmounts
    return () => {
        socket.disconnect();
    };
    }, [username]);

    //send a message to the server
    function sendMessage(text) {
        if (!socketRef.current || !text.trim()) return;
        socketRef.current.emit ("user-message", {username, text});
    }
    return { messages, connected, sendMessage};
}