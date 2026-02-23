import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "https://nonpedagogic-unlifting-marhta.ngrok-free.dev";


export function useSocket(username) {
const [messages, setMessages] = useState([]);
const [connected, setConnected] = useState(false);
const socketRef = useRef(null);

useEffect (() => {
        if (!username) return;
         if (socketRef.current) return; 

        //create the socket connection here
    socketRef.current = io(SERVER_URL);
    const socket = socketRef.current;

    socket.on("connect", ()  => {
        setConnected(true);
        console.log("Socket connected, emitting user_joined for:", username); 
        socket.emit("user_joined", {username});
    });

    //load existing chat history
    socket.on("chat_history", (history) => {
        setMessages(history);
    });

    //listen for new messages and add them to the list

    socket.on ("new_message", (message) => {
          console.log("new_message received:", message); 

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
        socketRef.current.emit ("user_message", {username, text});
    }
    return { messages, connected, sendMessage};
}