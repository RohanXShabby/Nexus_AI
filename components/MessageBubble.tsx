import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.User;

  return (
    <div className={`flex gap-5 max-w-3xl mx-auto w-full group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm mt-1 border ${
        isUser 
          ? 'bg-zinc-800 text-zinc-400 border-zinc-700' 
          : message.isError 
            ? 'bg-red-950 text-red-500 border-red-900'
            : 'bg-zinc-900 text-orange-500 border-zinc-800 shadow-orange-500/5'
      }`}>
        <i className={`fas ${isUser ? 'fa-user text-xs' : message.isError ? 'fa-exclamation' : 'fa-circle-nodes text-xs'}`}></i>
      </div>

      {/* Content */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[88%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            {isUser ? 'You' : 'Nexus AI'}
          </span>
          <span className="text-[10px] text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        
        <div 
          className={`text-[15px] leading-7 tracking-wide ${
            isUser 
              ? 'bg-zinc-800/80 text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-sm border border-zinc-700/50' 
              : message.isError 
                ? 'text-red-400 bg-red-950/30 border border-red-900/50 px-4 py-3 rounded-lg'
                : 'text-zinc-300 pl-0' // AI text blends into background
          }`}
        >
           <div className="whitespace-pre-wrap font-normal">
             {message.text}
           </div>
        </div>
        
        {!isUser && !message.isError && (
            <div className="flex gap-3 mt-2 pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-zinc-600 hover:text-zinc-400 text-xs"><i className="fas fa-copy"></i></button>
                <button className="text-zinc-600 hover:text-zinc-400 text-xs"><i className="fas fa-thumbs-up"></i></button>
                <button className="text-zinc-600 hover:text-zinc-400 text-xs"><i className="fas fa-redo"></i></button>
            </div>
        )}
      </div>
    </div>
  );
};