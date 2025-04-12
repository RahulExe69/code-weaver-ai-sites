
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Send, BrainCircuit } from 'lucide-react';

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
  const inputRef = useRef<HTMLInputElement>(null);
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
    
    if (isProcessing) {
      toast({
        title: "Processing in progress",
        description: "Please wait while I process your previous request.",
        variant: "default"
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus the input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <ChatMessage key={index} isUser={msg.isUser} message={msg.content} />
        ))}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 my-2 text-blue-300">
            <BrainCircuit size={18} className="animate-pulse" />
            <span className="text-sm italic">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask me to build or modify your website..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-slate-700/70 text-white border-slate-600 focus-visible:ring-blue-500 placeholder:text-slate-400"
          />
          <Button 
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-slate-500">
          Type your request and I'll generate the code for you instantly.
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
