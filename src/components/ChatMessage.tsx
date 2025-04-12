
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  isUser: boolean;
  message: string;
  animate?: boolean;
}

const ChatMessage = ({ isUser, message, animate = false }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState(isUser ? message : '');
  const [isTyping, setIsTyping] = useState(!isUser && animate);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isUser || !animate) {
      setDisplayedText(message);
      return;
    }
    
    let index = 0;
    setIsTyping(true);
    
    const typeNextChar = () => {
      if (index < message.length) {
        setDisplayedText(prev => prev + message.charAt(index));
        index++;
        
        // Vary the typing speed slightly for a more natural effect
        const delay = Math.random() * 30 + 20; // 20-50ms
        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
      }
    };
    
    // Start with empty text
    setDisplayedText('');
    // Short delay before starting to type
    setTimeout(typeNextChar, 300);
    
    return () => {
      setIsTyping(false);
    };
  }, [message, isUser, animate]);
  
  // Auto-scroll as typing happens
  useEffect(() => {
    if (isTyping && textRef.current) {
      textRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [displayedText, isTyping]);

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[90%] md:max-w-[80%]",
        isUser ? "self-end ml-auto" : "self-start mr-auto",
        !isUser && animate ? "animate-fade-in" : ""
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
          <Bot size={18} className={cn("text-white", isTyping && "animate-pulse")} />
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
        <div className="text-sm font-medium mb-1 flex items-center gap-2">
          {isUser ? "You" : "AI Assistant"}
          {isTyping && (
            <span className="inline-flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
          )}
        </div>
        <div 
          ref={textRef}
          className="text-sm whitespace-pre-wrap" 
          dangerouslySetInnerHTML={{ 
            __html: displayedText.replace(/\n/g, '<br/>').replace(
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
