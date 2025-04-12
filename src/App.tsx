
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import TabButton from "./components/TabButton";
import Panel from "./components/Panel";
import ChatPanel from "./components/ChatPanel";
import CodePanel from "./components/CodePanel";
import PreviewPanel from "./components/PreviewPanel";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  isUser: boolean;
  content: string;
}

const initialFiles = {
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
  const [files, setFiles] = useState(initialFiles);
  const [currentFile, setCurrentFile] = useState('index.html');
  const [messages, setMessages] = useState<Message[]>([
    { isUser: false, content: "Hello! Describe what you'd like me to build or change." }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Sample function to simulate AI processing (would be replaced with actual API call)
  const processChatMessage = async (message: string) => {
    setIsProcessing(true);
    
    // Add user message to chat
    setMessages(prev => [...prev, { isUser: true, content: message }]);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For this demo, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample hardcoded response for demonstration
      const aiResponse = "I've received your request. Here's what I can do:\n\n" +
        "1. First I'll analyze what you're asking for\n" +
        "2. Then I'll create or modify the necessary HTML, CSS, and JavaScript files\n" +
        "[Code Hidden]\n\n" +
        "I've updated your website based on your request. Check the preview tab to see the changes!";
      
      // Add AI response to chat
      setMessages(prev => [...prev, { isUser: false, content: aiResponse }]);
      
      // For demo purposes, let's update a file when the AI responds
      setFiles(prev => ({
        ...prev,
        'index.html': prev['index.html'].replace(
          '<h1>Welcome to the AI Website Builder</h1>',
          `<h1>Welcome to Your AI-Powered Website</h1>`
        )
      }));
      
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <div className="flex flex-col h-screen">
      {/* Tabs */}
      <div className="flex bg-darktab">
        <TabButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
          AI Chat
        </TabButton>
        <TabButton active={activeTab === "preview"} onClick={() => setActiveTab("preview")}>
          Preview
        </TabButton>
        <TabButton active={activeTab === "code"} onClick={() => setActiveTab("code")}>
          Code
        </TabButton>
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
