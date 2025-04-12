
import { useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import TabButton from "./components/TabButton";
import Panel from "./components/Panel";
import ChatPanel from "./components/ChatPanel";
import CodePanel from "./components/CodePanel";
import PreviewPanel from "./components/PreviewPanel";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquareCode, Sparkles, Terminal, Laptop } from "lucide-react";

interface Message {
  isUser: boolean;
  content: string;
}

// Define the type for our files object
type FileSystem = Record<string, string>;

const initialFiles: FileSystem = {
  'src/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Portfolio</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  'src/styles/main.css': '/* Portfolio styles will be added here */',
  'src/scripts/main.js': '// Portfolio scripts will be added here'
};

const App = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [files, setFiles] = useState<FileSystem>(initialFiles);
  const [currentFile, setCurrentFile] = useState('src/index.html');
  const [messages, setMessages] = useState<Message[]>([
    { isUser: false, content: "Hi there! I'm your AI coding assistant. I'll help you build a portfolio website. What would you like to include in it?" }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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
    } else {
      setIsTyping(false);
    }
  };

  const processChatMessage = async (message: string) => {
    setIsProcessing(true);
    setIsTyping(true);
    
    // Add user message to chat
    setMessages(prev => [...prev, { isUser: true, content: message }]);
    
    try {
      // First add an empty AI message that will be filled character by character
      setMessages(prev => [...prev, { isUser: false, content: "" }]);
      
      // In a real app, this would be an API call to an AI service
      // For this demo, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Start with plan
      const aiPlan = generatePlan(message);
      simulateTyping(aiPlan);
      
      // Wait for plan typing to finish
      await new Promise(resolve => setTimeout(resolve, aiPlan.length * 20 + 500));
      
      // Add "I'm coding now" message
      setMessages(prev => [...prev, { isUser: false, content: "I'm coding now. Please wait while I implement these changes..." }]);
      
      // Simulate coding time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Apply code changes
      const updatedFiles = processAIResponse(message, files);
      setFiles(updatedFiles);
      
      // Add final summary message
      const summary = generateSummary(message);
      setMessages(prev => [...prev, { isUser: false, content: summary }]);
      
      // Navigate to preview tab
      setTimeout(() => setActiveTab("preview"), 1000);
      
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  // Generate AI plan for implementation
  const generatePlan = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Very simple logic for demonstration
    if (lowerMessage.includes("portfolio")) {
      return "I'll create a professional portfolio website for you. Here's my plan:\n\n1. Set up the HTML structure with proper sections (header, about, projects, skills, contact)\n2. Create modern, responsive CSS with animations\n3. Add JavaScript for interactive elements and micro-animations\n4. Organize files in proper folder structure\n5. Implement responsive design for all devices\n\nLet me start coding this for you!";
    } else if (lowerMessage.includes("gallery") || lowerMessage.includes("image")) {
      return "I'll create an image gallery for your portfolio. Here's my plan:\n\n1. Create a responsive grid layout for the gallery\n2. Add image placeholders and styling\n3. Implement lightbox functionality for image previews\n4. Add smooth animations for image transitions\n5. Ensure mobile-friendly touch interactions\n\nI'll start implementing this right away!";
    } else {
      return "I'll implement your requested changes. Here's my plan:\n\n1. Analyze your current codebase\n2. Create necessary files and folders\n3. Implement the requested features with clean code\n4. Add appropriate styling and animations\n5. Ensure everything is responsive and works on all devices\n\nStarting the implementation now!";
    }
  };

  // Generate AI summary after implementation
  const generateSummary = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("portfolio")) {
      return "✅ I've successfully created a responsive portfolio website with:\n\n• Modern, clean design with animations\n• Responsive navigation with smooth scrolling\n• About, Projects, Skills, and Contact sections\n• Interactive elements with micro-animations\n• Mobile-friendly layout\n\nYou can see the result in the preview tab. Let me know if you'd like any adjustments!";
    } else if (lowerMessage.includes("gallery") || lowerMessage.includes("image")) {
      return "✅ I've implemented a responsive image gallery with:\n\n• Grid layout that adapts to screen size\n• Smooth hover animations\n• Lightbox functionality for image viewing\n• Lazy loading for better performance\n• Touch-friendly interactions for mobile\n\nCheck out the preview tab to see it in action!";
    } else {
      return "✅ I've completed the requested changes:\n\n• Created necessary files and folders\n• Implemented the requested features\n• Added appropriate styling and animations\n• Ensured responsive design across devices\n\nYou can see the results in the preview tab. Let me know if you'd like any further adjustments!";
    }
  };

  // Simulate AI code changes based on user message
  const processAIResponse = (message: string, currentFiles: FileSystem): FileSystem => {
    const lowerMessage = message.toLowerCase();
    const newFiles = { ...currentFiles };
    
    // Create portfolio website structure
    if (lowerMessage.includes("portfolio")) {
      // Create HTML structure
      newFiles['src/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Portfolio</title>
  <link rel="stylesheet" href="styles/main.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="logo">DevPortfolio</div>
      <nav class="main-nav">
        <ul>
          <li><a href="#home" class="active">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div class="menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <div class="hero-content">
        <h1 class="animate-on-scroll">Hello, I'm <span class="highlight">Alex</span></h1>
        <h2 class="animate-on-scroll">Full Stack Developer</h2>
        <p class="animate-on-scroll">I build beautiful, responsive websites and applications</p>
        <div class="hero-buttons animate-on-scroll">
          <a href="#projects" class="btn btn-primary">View My Work</a>
          <a href="#contact" class="btn btn-secondary">Contact Me</a>
        </div>
      </div>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title">About Me</h2>
      <div class="about-content">
        <div class="about-text animate-on-scroll">
          <p>I'm a passionate full-stack developer with 5+ years of experience building web applications. I specialize in React, Node.js, and modern JavaScript.</p>
          <p>My approach combines technical expertise with an eye for design to create intuitive and engaging user experiences.</p>
          <a href="#" class="btn btn-outline">Download Resume</a>
        </div>
        <div class="about-image animate-on-scroll">
          <img src="https://via.placeholder.com/400x500" alt="Profile Image">
        </div>
      </div>
    </div>
  </section>

  <section id="projects" class="projects">
    <div class="container">
      <h2 class="section-title">My Projects</h2>
      <div class="project-grid">
        <div class="project-card animate-on-scroll">
          <div class="project-image">
            <img src="https://via.placeholder.com/600x400" alt="Project 1">
          </div>
          <div class="project-details">
            <h3>E-Commerce Platform</h3>
            <p>A full-featured online store with payment processing and inventory management.</p>
            <div class="tech-stack">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-small">Live Demo</a>
              <a href="#" class="btn btn-small btn-outline">View Code</a>
            </div>
          </div>
        </div>
        
        <div class="project-card animate-on-scroll">
          <div class="project-image">
            <img src="https://via.placeholder.com/600x400" alt="Project 2">
          </div>
          <div class="project-details">
            <h3>Social Media Dashboard</h3>
            <p>Analytics dashboard for social media management with real-time data.</p>
            <div class="tech-stack">
              <span>Vue.js</span>
              <span>Express</span>
              <span>D3.js</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-small">Live Demo</a>
              <a href="#" class="btn btn-small btn-outline">View Code</a>
            </div>
          </div>
        </div>
        
        <div class="project-card animate-on-scroll">
          <div class="project-image">
            <img src="https://via.placeholder.com/600x400" alt="Project 3">
          </div>
          <div class="project-details">
            <h3>Task Management App</h3>
            <p>Collaborative task manager with drag-and-drop interface and team features.</p>
            <div class="tech-stack">
              <span>React</span>
              <span>Firebase</span>
              <span>Redux</span>
            </div>
            <div class="project-links">
              <a href="#" class="btn btn-small">Live Demo</a>
              <a href="#" class="btn btn-small btn-outline">View Code</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="skills" class="skills">
    <div class="container">
      <h2 class="section-title">My Skills</h2>
      <div class="skills-container">
        <div class="skill-category animate-on-scroll">
          <h3>Frontend</h3>
          <div class="skill-items">
            <div class="skill-item">
              <span class="skill-name">HTML/CSS</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 95%"></div>
              </div>
            </div>
            <div class="skill-item">
              <span class="skill-name">JavaScript</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 90%"></div>
              </div>
            </div>
            <div class="skill-item">
              <span class="skill-name">React</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 88%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="skill-category animate-on-scroll">
          <h3>Backend</h3>
          <div class="skill-items">
            <div class="skill-item">
              <span class="skill-name">Node.js</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 85%"></div>
              </div>
            </div>
            <div class="skill-item">
              <span class="skill-name">Express</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 82%"></div>
              </div>
            </div>
            <div class="skill-item">
              <span class="skill-name">MongoDB</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 78%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="skill-category animate-on-scroll">
          <h3>Tools & Others</h3>
          <div class="skill-items">
            <div class="skill-item">
              <span class="skill-name">Git</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 92%"></div>
              </div>
            </div>
            <div class="skill-item">
              <span class="skill-name">Docker</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 75%"></div>
              </div>
            </div>
            <div class="skill-item">
              <span class="skill-name">AWS</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: 70%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title">Get In Touch</h2>
      <div class="contact-container">
        <div class="contact-info animate-on-scroll">
          <div class="contact-item">
            <i class="icon-email"></i>
            <div>
              <h3>Email</h3>
              <p>hello@example.com</p>
            </div>
          </div>
          <div class="contact-item">
            <i class="icon-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+1 234 567 890</p>
            </div>
          </div>
          <div class="contact-item">
            <i class="icon-location"></i>
            <div>
              <h3>Location</h3>
              <p>San Francisco, CA</p>
            </div>
          </div>
          <div class="social-links">
            <a href="#" class="social-link"><i class="icon-github"></i></a>
            <a href="#" class="social-link"><i class="icon-linkedin"></i></a>
            <a href="#" class="social-link"><i class="icon-twitter"></i></a>
          </div>
        </div>
        
        <form class="contact-form animate-on-scroll">
          <div class="form-group">
            <input type="text" id="name" placeholder="Your Name" required>
          </div>
          <div class="form-group">
            <input type="email" id="email" placeholder="Your Email" required>
          </div>
          <div class="form-group">
            <input type="text" id="subject" placeholder="Subject" required>
          </div>
          <div class="form-group">
            <textarea id="message" placeholder="Your Message" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2025 My Portfolio. All rights reserved.</p>
    </div>
  </footer>

  <script src="scripts/main.js"></script>
</body>
</html>`;

      // Create CSS file with animations
      newFiles['src/styles/main.css'] = `/* Modern Portfolio CSS with Animations */
:root {
  --primary-color: #3a86ff;
  --secondary-color: #8338ec;
  --dark-color: #1a1a2e;
  --light-color: #ffffff;
  --gray-color: #f8f9fa;
  --text-color: #333333;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-color);
  overflow-x: hidden;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Header styles */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.site-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 15px;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.main-nav ul {
  display: flex;
  list-style: none;
}

.main-nav ul li {
  margin-left: 2rem;
}

.main-nav ul li a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
}

.main-nav ul li a:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.main-nav ul li a:hover:before,
.main-nav ul li a.active:before {
  width: 100%;
}

.main-nav ul li a:hover,
.main-nav ul li a.active {
  color: var(--primary-color);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  cursor: pointer;
}

.menu-toggle span {
  height: 3px;
  width: 100%;
  background-color: var(--dark-color);
  transition: var(--transition);
}

/* Hero section */
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  position: relative;
  overflow: hidden;
}

.hero:after {
  content: '';
  position: absolute;
  bottom: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(58, 134, 255, 0.1) 0%, rgba(131, 56, 236, 0.1) 100%);
  border-radius: 50%;
  z-index: 0;
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, 20px) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.highlight {
  color: var(--primary-color);
  position: relative;
  display: inline-block;
}

.highlight:after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: rgba(58, 134, 255, 0.2);
  z-index: -1;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: 2px solid var(--primary-color);
}

.btn-primary:hover {
  background-color: transparent;
  color: var(--primary-color);
}

.btn-secondary {
  background-color: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
}

.btn-secondary:hover {
  background-color: var(--secondary-color);
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Section styles */
section {
  padding: 6rem 0;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

/* About section */
.about-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.about-text {
  flex: 1;
}

.about-text p {
  margin-bottom: 1.5rem;
  color: #555;
}

.about-image {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.about-image:before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: -20px;
  bottom: -20px;
  border: 3px solid var(--primary-color);
  z-index: -1;
  border-radius: 10px;
  transition: var(--transition);
}

.about-image:hover:before {
  top: 10px;
  left: 10px;
}

.about-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: var(--transition);
}

.about-image:hover img {
  transform: scale(1.05);
}

/* Projects section */
.projects {
  background-color: var(--gray-color);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: var(--transition);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.project-image {
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: var(--transition);
}

.project-card:hover .project-image img {
  transform: scale(1.1);
}

.project-details {
  padding: 1.5rem;
}

.project-details h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
}

.project-details p {
  color: #666;
  margin-bottom: 1rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-stack span {
  background-color: rgba(58, 134, 255, 0.1);
  color: var(--primary-color);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 1rem;
}

/* Skills section */
.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
}

.skill-category h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  position: relative;
  display: inline-block;
}

.skill-category h3:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-name {
  font-weight: 500;
  color: var(--text-color);
}

.skill-bar {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.skill-level {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
  position: relative;
  width: 0;
  animation: skill-fill 2s ease-out forwards;
}

@keyframes skill-fill {
  from { width: 0; }
  to { width: var(--width, 50%); }
}

/* Contact section */
.contact {
  background-color: var(--gray-color);
}

.contact-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.contact-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  color: var(--dark-color);
}

.contact-item p {
  color: #666;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary-color);
  transition: var(--transition);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.contact-form input,
.contact-form textarea {
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  outline: none;
  transition: var(--transition);
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
}

.contact-form textarea {
  min-height: 150px;
  resize: vertical;
}

/* Footer */
.site-footer {
  background-color: var(--dark-color);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* Animation utilities */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.animate-on-scroll.show {
  opacity: 1;
  transform: translateY(0);
}

/* Micro animations */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

/* Responsive styles */
@media (max-width: 992px) {
  .hero h1 {
    font-size: 3rem;
  }
  
  .hero h2 {
    font-size: 1.8rem;
  }
  
  .about-content {
    flex-direction: column;
  }
  
  .about-image {
    margin-top: 2rem;
  }
  
  .about-image:before {
    top: 10px;
    left: 10px;
    right: -10px;
    bottom: -10px;
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .main-nav {
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100vh;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: var(--transition);
    z-index: 1001;
  }
  
  .main-nav.active {
    right: 0;
  }
  
  .main-nav ul {
    flex-direction: column;
    padding: 2rem;
    height: 100%;
  }
  
  .main-nav ul li {
    margin: 1rem 0;
    width: 100%;
  }
  
  .main-nav ul li a {
    display: block;
    padding: 0.5rem 0;
    width: 100%;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero h2 {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .project-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .hero-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero h2 {
    font-size: 1.3rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .skills-container,
  .contact-container {
    grid-template-columns: 1fr;
  }
  
  .contact-form button {
    width: 100%;
  }
}`;

      // Create JavaScript file with animations and interactivity
      newFiles['src/scripts/main.js'] = `// Portfolio Website JavaScript with Animations

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
  
  // Smooth scroll for nav links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Offset for fixed header
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Highlight active nav link based on scroll position
  function highlightNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      
      if (window.pageYOffset >= sectionTop - headerHeight - 100) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      }
    });
  }
  
  // Handle scroll animations
  function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight * 0.85) {
        element.classList.add('show');
      }
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrollPosition = window.pageYOffset;
      hero.style.backgroundPosition = \`50% \${scrollPosition * 0.4}px\`;
    }
    
    // Update nav highlighting
    highlightNavLink();
  }
  
  // Initialize animations on load
  handleScrollAnimations();
  
  // Handle scroll events
  window.addEventListener('scroll', () => {
    handleScrollAnimations();
    
    // Header shrink effect
    const header = document.querySelector('.site-header');
    if (window.pageYOffset > 50) {
      header.style.padding = '0.5rem 0';
      header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.padding = '1rem 0';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  });
  
  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple form validation
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff3860';
          
          // Reset border after 3 seconds
          setTimeout(() => {
            input.style.borderColor = '#ddd';
          }, 3000);
        }
      });
      
      if (isValid) {
        // In a real app, you'd send data to a server here
        // For demo, show success message
        contactForm.innerHTML = \`
          <div class="success-message" style="text-align: center; padding: 2rem;">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 style="margin-top: 1rem; color: #4CAF50;">Message Sent Successfully!</h3>
            <p style="margin-top: 0.5rem; color: #666;">Thank you for reaching out. I'll get back to you soon.</p>
          </div>
        \`;
      }
    });
  }
  
  // Add animation to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
  });
  
  // Initialize skill bar animations
  const skillLevels = document.querySelectorAll('.skill-level');
  skillLevels.forEach(level => {
    const width = level.style.width;
    level.style.width = '0';
    
    setTimeout(() => {
      level.style.width = width;
    }, 500);
  });
});

// Add custom cursor effect (micro-animation)
const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
cursorDot.style.cssText = \`
  position: fixed;
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
\`;
document.body.appendChild(cursorDot);

const cursorOutline = document.createElement('div');
cursorOutline.classList.add('cursor-outline');
cursorOutline.style.cssText = \`
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(58, 134, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease;
\`;
document.body.appendChild(cursorOutline);

document.addEventListener('mousemove', function(e) {
  cursorDot.style.left = \`\${e.clientX}px\`;
  cursorDot.style.top = \`\${e.clientY}px\`;
  
  cursorOutline.style.left = \`\${e.clientX}px\`;
  cursorOutline.style.top = \`\${e.clientY}px\`;
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', function() {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorOutline.style.width = '60px';
    cursorOutline.style.height = '60px';
    cursorOutline.style.borderColor = 'rgba(58, 134, 255, 0.8)';
  });
  
  el.addEventListener('mouseleave', function() {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorOutline.style.width = '40px';
    cursorOutline.style.height = '40px';
    cursorOutline.style.borderColor = 'rgba(58, 134, 255, 0.5)';
  });
});

// Add particles background effect to hero section
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('particles-container');
  particlesContainer.style.cssText = \`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  \`;
  
  hero.prepend(particlesContainer);
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    
    // Random size between 4px and 10px
    const size = Math.random() * 6 + 4;
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random opacity between 0.1 and 0.3
    const opacity = Math.random() * 0.2 + 0.1;
    
    // Random animation duration between 20s and 40s
    const duration = Math.random() * 20 + 20;
    
    particle.style.cssText = \`
      position: absolute;
      background-color: #fff;
      width: \${size}px;
      height: \${size}px;
      border-radius: 50%;
      left: \${posX}%;
      top: \${posY}%;
      opacity: \${opacity};
      animation: float \${duration}s infinite linear;
    \`;
    
    particlesContainer.appendChild(particle);
  }
}

// Initialize particles on page load
window.addEventListener('load', createParticles);`;

      return newFiles;
    }
    
    // If user wants a gallery
    if (lowerMessage.includes("gallery") || lowerMessage.includes("image")) {
      // Create a gallery page
      newFiles['src/gallery.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Gallery</title>
  <link rel="stylesheet" href="styles/gallery.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap">
</head>
<body>
  <header class="gallery-header">
    <div class="container">
      <h1>Image Gallery</h1>
      <nav>
        <a href="index.html">Home</a>
        <a href="#" class="active">Gallery</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
    </div>
  </header>

  <section class="gallery-controls">
    <div class="container">
      <div class="search-filter">
        <input type="text" placeholder="Search images..." id="search-input">
        <button id="search-btn">Search</button>
      </div>
      <div class="filter-buttons">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="nature">Nature</button>
        <button class="filter-btn" data-filter="architecture">Architecture</button>
        <button class="filter-btn" data-filter="travel">Travel</button>
      </div>
    </div>
  </section>

  <section class="gallery-container">
    <div class="container">
      <div class="gallery-grid" id="gallery-grid">
        <!-- Gallery items will be generated here -->
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <div class="lightbox" id="lightbox">
    <div class="lightbox-content">
      <span class="close-lightbox">&times;</span>
      <img id="lightbox-img" src="" alt="Lightbox Image">
      <div class="lightbox-caption" id="lightbox-caption"></div>
      <div class="lightbox-controls">
        <button id="prev-btn">&lt;</button>
        <button id="next-btn">&gt;</button>
      </div>
    </div>
  </div>

  <footer class="gallery-footer">
    <div class="container">
      <p>&copy; 2025 My Portfolio. All rights reserved.</p>
    </div>
  </footer>

  <script src="scripts/gallery.js"></script>
</body>
</html>`;

      // Create a CSS file for the gallery
      newFiles['src/styles/gallery.css'] = `/* Gallery Page CSS with Animations */
:root {
  --primary-color: #3a86ff;
  --secondary-color: #8338ec;
  --dark-color: #1a1a2e;
  --light-color: #ffffff;
  --gray-color: #f8f9fa;
  --text-color: #333333;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--gray-color);
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Header */
.gallery-header {
  background-color: var(--dark-color);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.gallery-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.gallery-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 8s infinite linear;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gallery-header nav {
  display: flex;
  gap: 1.5rem;
}

.gallery-header nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  padding-bottom: 5px;
  position: relative;
}

.gallery-header nav a:hover,
.gallery-header nav a.active {
  color: var(--primary-color);
}

.gallery-header nav a:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.gallery-header nav a:hover:after,
.gallery-header nav a.active:after {
  width: 100%;
}

/* Gallery Controls */
.gallery-controls {
  padding: 2rem 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.gallery-controls .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-filter {
  display: flex;
  gap: 0.5rem;
}

#search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  width: 250px;
  transition: var(--transition);
}

#search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
}

#search-btn {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
}

#search-btn:hover {
  background-color: #2563eb;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn:hover,
.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Gallery Grid */
.gallery-container {
  padding: 3rem 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: var(--transition);
  transform: translateY(30px);
  opacity: 0;
  animation: fade-in 0.5s forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
  transition: var(--transition);
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  transform: translateY(100%);
  transition: var(--transition);
}

.gallery-item:hover .gallery-item-overlay {
  transform: translateY(0);
}

.gallery-item-overlay h3 {
  margin-bottom: 0.5rem;
}

.gallery-item-overlay p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.gallery-item-category {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.3rem 0.8rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.lightbox.active {
  opacity: 1;
  visibility: visible;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 80vh;
  padding: 20px;
  text-align: center;
}

#lightbox-img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

.close-lightbox {
  position: absolute;
  top: -40px;
  right: 0;
  font-size: 30px;
  color: white;
  cursor: pointer;
  transition: var(--transition);
}

.close-lightbox:hover {
  color: var(--primary-color);
}

.lightbox-caption {
  color: white;
  margin-top: 20px;
  font-size: 1.2rem;
}

.lightbox-controls {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding: 0 20px;
}

.lightbox-controls button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.lightbox-controls button:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

/* Footer */
.gallery-footer {
  background-color: var(--dark-color);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  .gallery-header .container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .gallery-controls .container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    width: 100%;
  }
  
  #search-input {
    flex: 1;
  }
  
  .filter-buttons {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .lightbox-controls button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  
  .gallery-item img {
    height: 200px;
  }
}`;

      // Create a JavaScript file for the gallery
      newFiles['src/scripts/gallery.js'] = `// Gallery JavaScript with Animations and Interactions

// Sample gallery data
const galleryData = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'Mountain Landscape',
    description: 'Beautiful mountain range with a lake',
    category: 'nature'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    title: 'Forest Path',
    description: 'Serene path through a misty forest',
    category: 'nature'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
    title: 'Coastal Sunset',
    description: 'Breathtaking sunset over the ocean',
    category: 'nature'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    title: 'Modern Building',
    description: 'Contemporary architecture with clean lines',
    category: 'architecture'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1486718448742-163732cd1544',
    title: 'Historic Cathedral',
    description: 'Gothic cathedral with intricate details',
    category: 'architecture'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1',
    title: 'City Skyline',
    description: 'Urban landscape with skyscrapers',
    category: 'architecture'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd',
    title: 'Beach Retreat',
    description: 'Tropical beach with palm trees',
    category: 'travel'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
    title: 'Venice Canals',
    description: 'Iconic waterways of Venice, Italy',
    category: 'travel'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d',
    title: 'Desert Adventure',
    description: 'Expansive sand dunes at sunset',
    category: 'travel'
  }
];

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightbox = document.querySelector('.close-lightbox');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Initialize gallery
let filteredGallery = [...galleryData];
let currentImageIndex = 0;

// Generate gallery items
function generateGallery(items) {
  galleryGrid.innerHTML = '';
  
  if (items.length === 0) {
    galleryGrid.innerHTML = '<p class="no-results">No images found. Please try a different search.</p>';
    return;
  }
  
  items.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
    galleryItem.style.animationDelay = \`\${index * 0.1}s\`;
    
    galleryItem.innerHTML = \`
      <img src="\${item.src}" alt="\${item.title}">
      <div class="gallery-item-overlay">
        <h3>\${item.title}</h3>
        <p>\${item.description}</p>
      </div>
      <span class="gallery-item-category">\${item.category}</span>
    \`;
    
    galleryItem.addEventListener('click', () => {
      openLightbox(items, index);
    });
    
    galleryGrid.appendChild(galleryItem);
  });
}

// Filter gallery items
function filterGallery(category) {
  if (category === 'all') {
    filteredGallery = [...galleryData];
  } else {
    filteredGallery = galleryData.filter(item => item.category === category);
  }
  
  generateGallery(filteredGallery);
}

// Search gallery items
function searchGallery(query) {
  query = query.toLowerCase().trim();
  
  if (query === '') {
    filterGallery('all');
    return;
  }
  
  const searchResults = galleryData.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.description.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
  
  filteredGallery = searchResults;
  generateGallery(searchResults);
}

// Open lightbox
function openLightbox(items, index) {
  currentImageIndex = index;
  const currentItem = items[index];
  
  lightboxImg.src = currentItem.src;
  lightboxCaption.textContent = \`\${currentItem.title} - \${currentItem.description}\`;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightboxFn() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Navigate to previous image
function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + filteredGallery.length) % filteredGallery.length;
  const currentItem = filteredGallery[currentImageIndex];
  
  // Add slide transition
  lightboxImg.style.opacity = '0';
  lightboxCaption.style.opacity = '0';
  
  setTimeout(() => {
    lightboxImg.src = currentItem.src;
    lightboxCaption.textContent = \`\${currentItem.title} - \${currentItem.description}\`;
    
    lightboxImg.style.opacity = '1';
    lightboxCaption.style.opacity = '1';
  }, 300);
}

// Navigate to next image
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % filteredGallery.length;
  const currentItem = filteredGallery[currentImageIndex];
  
  // Add slide transition
  lightboxImg.style.opacity = '0';
  lightboxCaption.style.opacity = '0';
  
  setTimeout(() => {
    lightboxImg.src = currentItem.src;
    lightboxCaption.textContent = \`\${currentItem.title} - \${currentItem.description}\`;
    
    lightboxImg.style.opacity = '1';
    lightboxCaption.style.opacity = '1';
  }, 300);
}

// Event Listeners
// Filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Filter gallery
    const category = button.getAttribute('data-filter');
    filterGallery(category);
  });
});

// Search button
searchBtn.addEventListener('click', () => {
  searchGallery(searchInput.value);
});

// Search input (search as you type)
searchInput.addEventListener('input', () => {
  searchGallery(searchInput.value);
});

// Lightbox events
closeLightbox.addEventListener('click', closeLightboxFn);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightboxFn();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') {
    closeLightboxFn();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  }
});

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  generateGallery(galleryData);
  
  // Add intersection observer for animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe gallery items
  setTimeout(() => {
    document.querySelectorAll('.gallery-item').forEach(item => {
      observer.observe(item);
    });
  }, 100);
});`;

      return newFiles;
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
            <Laptop size={16} className="mr-2" />
            Preview
          </TabButton>
          <TabButton active={activeTab === "code"} onClick={() => setActiveTab("code")}>
            <Terminal size={16} className="mr-2" />
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
          html={files['src/index.html']} 
          css={files['src/styles/main.css']} 
          js={files['src/scripts/main.js']} 
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
