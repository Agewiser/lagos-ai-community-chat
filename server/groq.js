import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq ({ apiKey: process.env.GROQ_API_KEY });

//SET Peronan's response to chat messages
export async function getPersonaResponse (persona, recentMessages) {
    const context = recentMessages
    .slice(-10)
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

    const completion = await groq.chat.completions.create ({
        model: "llama-3.1-8b-instant",
        messages: [
      { role: "system", content: persona.personality },
        {
            role: "user",
            content: `Here is the recent chat:\n${context}\n\nRespond naturally as ${persona.name} in 1-4 short words. Never wrap your response in quotation marks. Occasionally, use wrong spelling or punctuation.`,
        },
        ],
        max_tokens: 150,
        temperature: 0.85,
    });

    return completion.choices[0]?.message?.content?.trim() || "....";

}

//Admin Chike's Welcome Msg to New Users

export async function getWelcomeMessage (persona, username) {
    const completion = await groq.chat.completions.create ({
        model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: persona.personality },
      {
        role: "user",
        content: `A new user just joined. Their name is "${username}". 
        Welcome them using their EXACT name in 3-5 words (stay casual and friendly). 
        Never wrap your response in quotation marks.`,
      },
    ],
    max_tokens: 195,
    temperature: 0.8,
    })

    return completion.choices[0]?.message?.content?.trim() || "...";

}

 //Split responses into smaller chunks to mimick phone typing
export function splitIntoChunks (text) {
        const sentences = text.match(/[^.!?] + [.!?] + /g) || [text];

        //if only one sentence or coin flip says keep whole - send as one
        if (sentences.length <=1 || Math.random() > 0.5) return [text];

        //otherwise, let's split first sentence first, followed by the rest

        const first = sentences[0].trim();
        const rest = sentences.slice(1).join("").trim();
        return rest ? [first, rest] : [text];
    }

export default groq;