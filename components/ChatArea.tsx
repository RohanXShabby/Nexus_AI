import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, Role } from '../types';
import { createChatSession, sendMessageToGemini, generateTitle } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  conversation: Conversation;
  onUpdateMessages: (messages: Message[], newTitle?: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ conversation, onUpdateMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const session = createChatSession(conversation.messages);
    setChatSession(session);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userText = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: Message = {
      id: uuidv4(),
      role: Role.User,
      text: userText,
      timestamp: Date.now()
    };

    const newMessages = [...conversation.messages, userMsg];
    onUpdateMessages(newMessages);
    setIsLoading(true);

    try {
      let newTitle = undefined;
      if (conversation.messages.length === 0) {
          newTitle = await generateTitle(userText);
      }

      const responseText = await sendMessageToGemini(chatSession, userText);

      const modelMsg: Message = {
        id: uuidv4(),
        role: Role.Model,
        text: responseText,
        timestamp: Date.now()
      };

      onUpdateMessages([...newMessages, modelMsg], newTitle);

    } catch (error) {
      const errorMsg: Message = {
        id: uuidv4(),
        role: Role.Model,
        text: "Connection to Nexus core failed. Please check your configuration.",
        timestamp: Date.now(),
        isError: true
      };
      onUpdateMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-black">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
        {conversation.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 select-none">
            <div className="w-16 h-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/5">
              <i className="fas fa-bolt text-2xl text-orange-500"></i>
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">Nexus AI</h3>
            <p className="text-sm max-w-md text-center leading-relaxed text-zinc-500">
              Advanced reasoning capabilities online. Context is retained across this session.
            </p>
          </div>
        )}
        
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-3xl mx-auto w-full animate-pulse pl-2">
             <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center bg-zinc-800 border border-zinc-700">
               <i className="fas fa-circle-nodes text-orange-500 text-[10px]"></i>
             </div>
             <div className="flex-1 space-y-2 pt-1">
                <div className="h-1.5 bg-zinc-800 rounded w-24"></div>
                <div className="h-1.5 bg-zinc-800 rounded w-48"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-black bg-gradient-to-t from-black to-transparent">
        <div className="max-w-3xl mx-auto relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 shadow-2xl focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Input command or query..."
            rows={1}
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 text-[15px] p-4 pr-14 rounded-2xl focus:outline-none resize-none max-h-48 overflow-y-auto leading-relaxed"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200 flex items-center justify-center h-9 w-9 ${
              input.trim() && !isLoading
                ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-500/20'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-arrow-up text-xs"></i>
          </button>
        </div>
        <div className="text-center text-[10px] text-zinc-700 mt-3 font-medium">
          Nexus AI generated content may be inaccurate.
        </div>
      </div>
    </div>
  );
};