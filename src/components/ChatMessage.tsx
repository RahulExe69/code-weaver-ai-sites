
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  isUser: boolean;
  message: string;
}

const ChatMessage = ({ isUser, message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[90%] md:max-w-[80%] animate-fade-in",
        isUser ? "self-end ml-auto" : "self-start mr-auto"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "p-3 rounded-lg shadow-sm break-words",
          isUser ? 
            "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none" : 
            "bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-tl-none border border-slate-600/50"
        )}
      >
        <div className="text-sm font-medium mb-1">
          {isUser ? "You" : "AI Assistant"}
        </div>
        <div 
          className="text-sm whitespace-pre-wrap" 
          dangerouslySetInnerHTML={{ 
            __html: message.replace(/\n/g, '<br/>').replace(
              /\[Code Hidden\]/g, 
              '<span class="px-2 py-1 bg-slate-600/50 rounded text-xs font-mono">[Code applied to files]</span>'
            )
          }} 
        />
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
