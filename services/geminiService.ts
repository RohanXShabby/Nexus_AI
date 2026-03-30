import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Role } from "../types";

// Vite uses import.meta.env for variables prefixed with VITE_
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Initializes a chat session with history.
 * @param history - Array of previous messages to restore context
 */
export const createChatSession = (history: Message[]) => {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
  });

  const sdkHistory = history
     .filter(msg => !msg.isError) // Don't include error messages in context
     .map(msg => ({
        role: msg.role === Role.User ? 'user' : 'model',
        parts: [{ text: msg.text }]
  }));

  return model.startChat({
    history: sdkHistory,
    generationConfig: {
      temperature: 0.7,
    }
  });
};

/**
 * Sends a message using an existing chat session.
 * @param chat - The active ChatSession instance
 * @param message - The user message text
 */
export const sendMessageToGemini = async (chat: any, message: string): Promise<string> => {
  try {
    if (!apiKey) {
        throw new Error("Missing Gemini API Key. Please check your .env file.");
    }
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
        throw new Error("Empty response from model");
    }
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Explicitly handle common errors like invalid keys
    if (error.message?.includes("API_KEY_INVALID")) {
        throw new Error("Invalid API Key. Please update your VITE_GEMINI_API_KEY in .env");
    }
    throw error;
  }
};

/**
 * Simple title generator based on the first user message
 */
export const generateTitle = async (firstMessage: string): Promise<string> => {
    try {
        if (!apiKey) return 'New Conversation';
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(`Summarize this message into a short 3-5 word title. Do not use quotes. Message: "${firstMessage}"`);
        const result = await response.response;
        return result.text()?.trim() || 'New Conversation';
    } catch (e) {
        return 'New Conversation';
    }
}