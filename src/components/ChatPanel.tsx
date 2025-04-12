
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  isUser: boolean;
  content: string;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isProcessing: boolean;
}

const ChatPanel = ({ onSendMessage, messages, isProcessing }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (input.trim() === '') {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <ChatMessage key={index} isUser={msg.isUser} message={msg.content} />
        ))}
        {isProcessing && (
          <div className="text-center my-2 italic text-gray-400">
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-darkborder flex gap-2">
        <Input
          placeholder="Describe your website..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-darktab text-white border-darkborder"
        />
        <Button 
          onClick={handleSend}
          disabled={isProcessing}
          className="bg-navy hover:bg-navy/80 text-white"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
