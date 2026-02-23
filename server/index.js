// server/index.js
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import personas from "./personas.js";
import { getPersonaResponse, getWelcomeMessage, splitIntoChunks } from "./groq.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
  ],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Naija AI Chat server is running 🚀");
});

// --- In-memory chat history ---
let chatHistory = [];

// --- Random delay helper ---
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// --- Emit a message with optional second chunk ---
async function emitMessage(persona, text, index) {
  const chunks = splitIntoChunks(text);

  const firstMsg = {
    id: Date.now() + index,
    sender: persona.name,
    avatar: persona.avatar,
    color: persona.color,
    text: chunks[0],
    type: "ai",
    isAdmin: !!persona.isAdmin,
    timestamp: new Date().toISOString(),
  };

  chatHistory.push(firstMsg);
  if (chatHistory.length > 100) chatHistory = chatHistory.slice(-100);
  io.emit("new_message", firstMsg);

  if (chunks[1]) {
    setTimeout(() => {
      const secondMsg = {
        id: Date.now() + index + 100,
        sender: persona.name,
        avatar: persona.avatar,
        color: persona.color,
        text: chunks[1],
        type: "ai",
        isAdmin: !!persona.isAdmin,
        timestamp: new Date().toISOString(),
      };
      chatHistory.push(secondMsg);
      if (chatHistory.length > 100) chatHistory = chatHistory.slice(-100);
      io.emit("new_message", secondMsg);
    }, randomDelay(3000, 6000));
  }
}

// --- Socket.io ---
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("chat_history", chatHistory);

  socket.on("user_joined", async (data) => {
    const username = data.username || "newcomer";
    console.log(`user_joined received for: ${username}`);

    const isPersona = personas.some(
      (p) => p.name.toLowerCase() === username.toLowerCase()
    );
    if (isPersona) return;

    const adminChike = personas.find((p) => p.isAdmin);

    setTimeout(async () => {
      try {
        const welcomeText = await getWelcomeMessage(adminChike, username);
        await emitMessage(adminChike, welcomeText, 0);

        const nonAdminPersonas = personas.filter((p) => !p.isAdmin);
        const shuffled = [...nonAdminPersonas].sort(() => Math.random() - 0.5);
        const reacting = shuffled.slice(0, Math.floor(Math.random() * 2) + 1);

        reacting.forEach((persona, i) => {
          setTimeout(async () => {
            try {
              const reactionText = await getPersonaResponse(persona, chatHistory);
              await emitMessage(persona, reactionText, i + 1);
            } catch (err) {
              console.error(`${persona.name} welcome reaction error:`, err.message);
            }
          }, randomDelay(5000, 10000) + i * randomDelay(2000, 4000));
        });

      } catch (err) {
        console.error("Welcome error:", err.message);
      }
    }, randomDelay(1500, 3000));
  });

  socket.on("user_message", async (data) => {
    const userMsg = {
      id: Date.now(),
      sender: data.username || "Anonymous",
      text: data.text,
      type: "user",
      timestamp: new Date().toISOString(),
    };

    chatHistory.push(userMsg);
    io.emit("new_message", userMsg);

    const nonAdminPersonas = personas.filter((p) => !p.isAdmin);
    const shuffled = [...nonAdminPersonas].sort(() => Math.random() - 0.5);
    const responding = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

    if (Math.random() < 0.2) {
      responding.push(personas.find((p) => p.isAdmin));
    }

    responding.forEach((persona, i) => {
      const delay = randomDelay(4000, 12000) + i * randomDelay(2000, 4000);

      setTimeout(async () => {
        try {
          const responseText = await getPersonaResponse(persona, chatHistory);
          await emitMessage(persona, responseText, i);
        } catch (err) {
          console.error(`${persona.name} error:`, err.message);
        }
      }, delay);
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});