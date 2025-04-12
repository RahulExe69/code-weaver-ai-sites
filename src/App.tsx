
import { useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import TabButton from "./components/TabButton";
import Panel from "./components/Panel";
import ChatPanel from "./components/ChatPanel";
import CodePanel from "./components/CodePanel";
import PreviewPanel from "./components/PreviewPanel";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquareCode, Sparkles } from "lucide-react";

interface Message {
  isUser: boolean;
  content: string;
}

// Define the type for our files object
type FileSystem = Record<string, string>;

const initialFiles: FileSystem = {
  'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>My AI Website</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <h1>Welcome to the AI Website Builder</h1>
  <p>Describe what you want to build in the chat!</p>
</body>
</html>`,
  'style.css': 'body { margin: 0; padding: 20px; font-family: sans-serif; }',
  'script.js': '// JavaScript code here'
};

const App = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [files, setFiles] = useState<FileSystem>(initialFiles);
  const [currentFile, setCurrentFile] = useState('index.html');
  const [messages, setMessages] = useState<Message[]>([
    { isUser: false, content: "Hi there! I'm your AI coding assistant. What would you like me to build for you today?" }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const currentMessageRef = useRef<string>("");
  const { toast } = useToast();

  // Function to simulate typing effect for AI messages
  const simulateTyping = (fullMessage: string, partialMessage: string = "", charIndex: number = 0) => {
    if (charIndex < fullMessage.length) {
      const nextChar = fullMessage.charAt(charIndex);
      const newPartial = partialMessage + nextChar;
      
      // Update the latest AI message with the partial content
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          ...newMessages[newMessages.length - 1], 
          content: newPartial 
        };
        return newMessages;
      });
      
      // Schedule next character with variable timing for natural effect
      const delay = Math.floor(Math.random() * 15) + 5; // 5-20ms
      typingRef.current = setTimeout(() => {
        simulateTyping(fullMessage, newPartial, charIndex + 1);
      }, delay);
    }
  };

  const processChatMessage = async (message: string) => {
    setIsProcessing(true);
    
    // Add user message to chat
    setMessages(prev => [...prev, { isUser: true, content: message }]);
    
    try {
      // First add an empty AI message that will be filled character by character
      setMessages(prev => [...prev, { isUser: false, content: "" }]);
      
      // In a real app, this would be an API call to an AI service
      // For this demo, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample analysis and response that mimics a more sophisticated AI
      const aiResponse = analyzeAndGenerateResponse(message, files);
      
      // Start typing effect with the full message
      simulateTyping(aiResponse);
      
      // For demo purposes, let's update a file when the AI responds
      const updatedFiles = processAIResponse(message, files);
      setFiles(updatedFiles);
      
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
      
      // Remove the empty AI message in case of error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate AI analysis and response generation
  const analyzeAndGenerateResponse = (message: string, files: Record<string, string>) => {
    const lowerMessage = message.toLowerCase();
    
    // Very simple logic for demonstration - in reality this would be handled by the AI model
    if (lowerMessage.includes("header") || lowerMessage.includes("navbar")) {
      return "I've analyzed your request to add a header/navbar. Let me implement that for you.\n\nI've updated the HTML with a responsive navigation bar that includes links and a mobile menu toggle. I've also added the necessary CSS to style it properly and make it responsive on all devices.\n\nCheck the preview to see how it looks!";
    } else if (lowerMessage.includes("color") || lowerMessage.includes("style") || lowerMessage.includes("css")) {
      return "I've examined your styling request and updated the CSS accordingly.\n\nI've implemented a modern color scheme with improved typography and spacing. The changes should make the site feel more professional and engaging.\n\nTake a look at the preview to see the new styling!";
    } else if (lowerMessage.includes("button") || lowerMessage.includes("click")) {
      return "Based on your request, I've added interactive buttons to the page.\n\nI've implemented both the HTML elements and the JavaScript event handlers to make them fully functional. The buttons have hover effects and proper styling.\n\nCheck the preview and try clicking them!";
    } else {
      return "I've analyzed your request and made the requested changes to the codebase.\n\nI've updated the HTML structure, added appropriate styling, and implemented any necessary JavaScript functionality. The implementation follows best practices for web development.\n\nPlease check the preview to see the changes in action!";
    }
  };

  // Simulate AI code changes based on user message
  const processAIResponse = (message: string, currentFiles: FileSystem): FileSystem => {
    const lowerMessage = message.toLowerCase();
    const newFiles = { ...currentFiles };
    
    // Very simple logic for demonstration - in reality this would be handled by the AI model
    if (lowerMessage.includes("header") || lowerMessage.includes("navbar")) {
      newFiles['index.html'] = newFiles['index.html'].replace(
        '<body>',
        `<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="logo">AI Website Builder</div>
      <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <div class="mobile-menu-btn">≡</div>
    </nav>
  </header>`
      );
      
      newFiles['style.css'] += `
.site-header {
  background: linear-gradient(90deg, #2c3e50, #34495e);
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #3498db;
}

.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}`;
    }
    
    return newFiles;
  };

  const handleFileSelect = (filename: string) => {
    setCurrentFile(filename);
  };

  const handleFileUpdate = (content: string) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: content
    }));
  };

  // Cleanup typing effect on unmount
  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header with tabs */}
      <div className="flex bg-gradient-to-r from-[#1a1a2e] to-[#16213e] shadow-md">
        <div className="flex items-center px-4 py-2 bg-[#0f3460] text-white">
          <Sparkles size={18} className="mr-2 text-yellow-400" />
          <span className="font-semibold">CodeWeaver AI</span>
        </div>
        <div className="flex">
          <TabButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
            <MessageSquareCode size={16} className="mr-2" />
            AI Chat
          </TabButton>
          <TabButton active={activeTab === "preview"} onClick={() => setActiveTab("preview")}>
            Preview
          </TabButton>
          <TabButton active={activeTab === "code"} onClick={() => setActiveTab("code")}>
            Code
          </TabButton>
        </div>
      </div>
      
      {/* Panels */}
      <Panel active={activeTab === "chat"} id="chat">
        <ChatPanel 
          messages={messages} 
          onSendMessage={processChatMessage}
          isProcessing={isProcessing}
        />
      </Panel>
      
      <Panel active={activeTab === "preview"} id="preview">
        <PreviewPanel 
          html={files['index.html']} 
          css={files['style.css']} 
          js={files['script.js']} 
        />
      </Panel>
      
      <Panel active={activeTab === "code"} id="code">
        <CodePanel 
          files={files}
          currentFile={currentFile}
          onSelectFile={handleFileSelect}
          onUpdateFile={handleFileUpdate}
        />
      </Panel>
      
      <Toaster />
    </div>
  );
};

export default App;
