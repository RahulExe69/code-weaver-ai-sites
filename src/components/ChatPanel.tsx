
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Send, BrainCircuit, Stars, Sparkles } from 'lucide-react';

interface Message {
  isUser: boolean;
  content: string;
  animate?: boolean;
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

  // Suggestions for users
  const suggestions = [
    "Create a portfolio with animations",
    "Build a photo gallery",
    "Add a contact form",
    "Make my site mobile-friendly"
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="p-4 border-b border-slate-800 bg-slate-900 backdrop-blur-sm">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-medium">AI Website Builder</h2>
            <p className="text-slate-400 text-sm">Describe what you want, and I'll build it for you</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={index} 
            isUser={msg.isUser} 
            message={msg.content} 
            animate={msg.animate !== false}
          />
        ))}
        
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 my-4 px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700 max-w-[80%] mx-auto">
            <BrainCircuit size={18} className="text-indigo-400 animate-pulse" />
            <span className="text-sm text-indigo-200">AI is generating code...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {!isProcessing && messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 text-sm mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Stars size={16} className="text-indigo-400" />
              <h3 className="font-medium text-white">Quick suggestions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="py-2 px-3 text-left rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-colors text-sm"
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask me to build or modify your website..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-slate-800 text-white border-slate-700 focus-visible:ring-indigo-500 placeholder:text-slate-400"
          />
          <Button 
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
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
