
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  isUser: boolean;
  message: string;
}

const ChatMessage = ({ isUser, message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "p-3 rounded-md max-w-[80%] break-words",
        isUser ? 
          "bg-[#2980b9] self-end" : 
          "bg-navy self-start"
      )}
    >
      <strong>{isUser ? "You" : "AI"}:</strong> 
      <span dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br/>') }} />
    </div>
  );
};

export default ChatMessage;
