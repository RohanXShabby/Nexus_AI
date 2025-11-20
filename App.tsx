import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Conversation, Message } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'nexus_chat_portfolio_v1';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          const sorted = [...parsed].sort((a: Conversation, b: Conversation) => b.updatedAt - a.updatedAt);
          setCurrentConversationId(sorted[0].id);
        } else {
          createNewConversation();
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
        createNewConversation();
      }
    } else {
      createNewConversation();
    }
    setIsLoaded(true);
  }, []);

  // Save history
  useEffect(() => {
    if (isLoaded && conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations, isLoaded]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'New Session',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const updateConversationMessages = (id: string, newMessages: Message[], newTitle?: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          messages: newMessages,
          title: newTitle || c.title,
          updatedAt: Date.now()
        };
      }
      return c;
    }));
  };

  const activeConversation = conversations.find(c => c.id === currentConversationId);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-black text-zinc-200 font-sans selection:bg-orange-500/30">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-80 bg-zinc-950 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-zinc-900 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          conversations={conversations}
          currentId={currentConversationId}
          onSelect={(id) => {
            setCurrentConversationId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onNewChat={createNewConversation}
          onDelete={deleteConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full bg-black">
        {/* Header */}
        <header className="h-16 border-b border-zinc-900 flex items-center px-6 justify-between bg-black/50 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-zinc-900 text-zinc-400 md:hidden transition-colors"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="flex flex-col">
               <h1 className="font-semibold text-zinc-100 truncate flex items-center gap-2">
                 {activeConversation?.title || 'Nexus Workspace'}
               </h1>
               {activeConversation && (
                   <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                       Nexus AI v1.0 Stable
                   </span>
               )}
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
             <span className="text-xs font-medium text-zinc-500">Connected</span>
          </div>
        </header>

        {/* Chat Area */}
        {activeConversation ? (
          <ChatArea 
            conversation={activeConversation}
            onUpdateMessages={(msgs, title) => updateConversationMessages(activeConversation.id, msgs, title)}
          />
        ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600 flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl shadow-orange-900/20">
                    <i className="fas fa-network-wired text-3xl text-orange-500"></i>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">Nexus AI</p>
                    <p className="text-xs text-zinc-600 mt-1">Next Generation Intelligence</p>
                </div>
                <button 
                    onClick={createNewConversation}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-all text-sm shadow-lg shadow-orange-900/20"
                >
                    Initialize Session
                </button>
            </div>
        )}
      </div>
    </div>
  );
}