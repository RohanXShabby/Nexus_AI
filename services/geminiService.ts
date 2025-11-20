import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message, Role } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Initializes a chat session with history.
 * @param history - Array of previous messages to restore context
 */
export const createChatSession = (history: Message[]): Chat => {
  // Convert internal Message format to SDK Content format
  // The SDK expects history to exclude the very last prompt if we were calling sendMessage,
  // but here we are just initializing the state.
  
  const sdkHistory: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: sdkHistory,
    config: {
      temperature: 0.7,
      // We don't set thinkingBudget here to keep it fast and standard
    }
  });
};

/**
 * Sends a message using an existing chat session.
 * @param chat - The active Chat instance
 * @param message - The user message text
 */
export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({
      message: message
    });
    
    if (!result.text) {
        throw new Error("Empty response from model");
    }
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Simple title generator based on the first user message
 */
export const generateTitle = async (firstMessage: string): Promise<string> => {
    try {
        // We create a stateless request just for the title
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize this message into a short 3-5 word title. Do not use quotes. Message: "${firstMessage}"`,
        });
        return response.text?.trim() || 'New Conversation';
    } catch (e) {
        return 'New Conversation';
    }
}