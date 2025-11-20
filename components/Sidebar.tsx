import React from 'react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  conversations, 
  currentId, 
  onSelect, 
  onNewChat, 
  onDelete
}) => {
  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header / New Chat */}
      <div className="p-4 border-b border-zinc-900">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-zinc-200 text-black rounded-lg transition-all font-medium text-sm group"
        >
          <span className="flex items-center gap-2">
              <i className="fas fa-plus text-orange-600"></i>
              New Session
          </span>
          <span className="bg-zinc-200 group-hover:bg-white text-xs px-1.5 py-0.5 rounded text-zinc-600 font-mono">⌘N</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <div className="px-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600">History</div>
        
        {sorted.length === 0 && (
            <div className="px-4 py-8 text-zinc-600 text-xs text-center italic border-2 border-dashed border-zinc-900 rounded-lg mx-2">
                No active sessions
            </div>
        )}
        
        {sorted.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
              currentId === conv.id
                ? 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300 border-transparent'
            }`}
          >
            {currentId === conv.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-orange-500 rounded-r-full"></div>
            )}
            
            <div className="flex flex-col overflow-hidden pl-2">
                <span className={`text-sm font-medium truncate block w-full ${currentId === conv.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                  {conv.title || 'Untitled Session'}
                </span>
                <span className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                   <i className="far fa-clock text-[10px]"></i> {formatDate(conv.updatedAt)}
                </span>
            </div>
            
            <button
              onClick={(e) => onDelete(e, conv.id)}
              className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 text-zinc-600 transition-all"
            >
              <i className="fas fa-trash-alt text-xs"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Branding */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
        <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-900/10">
                <i className="fas fa-dna text-xs"></i>
            </div>
            <div className="flex flex-col">
                <span className="text-zinc-200 text-xs font-medium">Nexus AI</span>
                <span className="text-[10px] text-zinc-600">Neural Interface v1.0</span>
            </div>
        </div>
      </div>
    </div>
  );
};