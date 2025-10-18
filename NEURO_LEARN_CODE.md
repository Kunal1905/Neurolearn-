# NeuroLearn - Brain-Dominance Adaptive Learning Platform

## Table of Contents
1. [Project Structure](#project-structure)
2. [Core Components](#core-components)
3. [API Routes](#api-routes)
4. [Database Schema](#database-schema)
5. [Middleware](#middleware)
6. [UI Components](#ui-components)
7. [Configuration Files](#configuration-files)

---

## Project Structure

```
learner/
├── app/
│   ├── api/
│   │   ├── assessment/
│   │   ├── chat/
│   │   ├── chat-gemini/
│   │   ├── test-chatbot/
│   │   ├── test-db/
│   │   ├── user/
│   │   │   └── [userId]/
│   │   │       ├── assessment/
│   │   │       ├── dominant/
│   │   │       └── stats/
│   ├── sign-in/
│   ├── sign-up/
│   ├── workspace/
│   │   ├── assessment/
│   │   │   ├── results/
│   │   │   ├── start/
│   │   ├── chat-assistant/
│   │   └── profile/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── ui/
│   └── theme-provider.jsx
├── config/
│   ├── db.js
│   └── schema.js
├── public/
│   └── logo.svg
├── middleware.js
└── package.json
```

---

## Core Components

### 1. Main Landing Page (`app/page.js`)

```javascript
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, Target, Zap, TrendingUp, Award, Sparkles, ChevronRight, Play, CheckCircle, ArrowRight, Menu, X, Rocket, LineChart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !section.classList.contains('animated')) {
          section.classList.add('animated');
          setVisibleSections(prev => new Set(prev).add(section.id));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <style>{\`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        [data-animate] {
          opacity: 0;
        }

        [data-animate].animated {
          animation-duration: 0.8s;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-animate="fade-up"].animated {
          animation-name: fadeInUp;
        }

        [data-animate="scale"].animated {
          animation-name: scaleIn;
        }

        [data-animate="slide-left"].animated {
          animation-name: slideInLeft;
        }

        [data-animate="slide-right"].animated {
          animation-name: slideInRight;
        }

        [data-delay="100"].animated { animation-delay: 0.1s; }
        [data-delay="200"].animated { animation-delay: 0.2s; }
        [data-delay="300"].animated { animation-delay: 0.3s; }
        [data-delay="400"].animated { animation-delay: 0.4s; }
        [data-delay="500"].animated { animation-delay: 0.5s; }
        [data-delay="600"].animated { animation-delay: 0.6s; }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .btn-glow {
          transition: all 0.3s ease;
        }

        .btn-glow:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .mesh-gradient {
          background: 
            radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
        }

        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }

        .stat-card:hover::before {
          left: 100%;
        }
      \`}</style>

      {/* Header */}
<header
  className={\`border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300 \${
    scrolled ? "bg-background/95 shadow-md" : "bg-background/80"
  }\`}
>
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    {/* Logo */}
    <div
      className="flex items-center space-x-2"
      data-animate="slide-left"
    >
      <Image
        src="/logo.svg"
        width={300}
        height={140}
        alt="NeuroLearn Logo"
        className="object-contain h-12 w-auto sm:h-16"
        priority
        style={{ backgroundColor: 'transparent' }}
      />
    </div>

    {/* Desktop Nav Button */}
    <div
      className="hidden md:flex items-center space-x-4"
      data-animate="slide-right"
    >
    <Button asChild className="btn-glow">
  <Link href="/sign-in">Get Started</Link>
</Button>

    </div>

    {/* Mobile Menu Button */}
    <button
      className="md:hidden"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  </div>

  {/* Mobile Menu Dropdown */}
  {mobileMenuOpen && (
    <div className="md:hidden border-t bg-background p-4 space-y-3">
      <div className="pt-3 space-y-2">
        <Button className="w-full" asChild>
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </div>
    </div>
  )}
</header>


      {/* Hero Section */}
      <section className="py-20 md:py-32 mesh-gradient overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div data-animate="fade-up" id="hero-badge">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Learning Revolution
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" data-animate="fade-up" data-delay="100" id="hero-title">
                Unlock Your Brain's{" "}
                <span className="gradient-text">Learning Potential</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-animate="fade-up" data-delay="200" id="hero-desc">
                Experience personalized education that adapts to your unique learning style. 
                NeuroLearn uses cutting-edge neuroscience research to optimize your learning journey.
              </p>
            
            </div>
            
            <div className="relative" data-animate="scale" data-delay="200" id="hero-image">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl floating">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80" 
                  alt="Student learning with laptop"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-animate="fade-up" id="features-title">
              Why Choose NeuroLearn?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-animate="fade-up" data-delay="100" id="features-desc">
              Our platform combines neuroscience research with modern technology to create 
              the most effective learning experience possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Adaptive Learning',
                description: 'Our AI analyzes your learning patterns and adapts content difficulty and pace to optimize retention and understanding.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Target,
                title: 'Personalized Paths',
                description: 'Get a learning journey tailored specifically to your goals, learning style, and knowledge gaps.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Accelerated Results',
                description: 'Learn 3x faster with scientifically-proven techniques that enhance memory retention and comprehension.',
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((feature, i) => (
              <div key={i} data-animate="fade-up" data-delay={\`\${(i + 1) * 100}\`} id={\`feature-\${i}\`}>
                <Card className="border-0 shadow-xl hover-lift h-full bg-gradient-to-br from-white to-secondary/30 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader>
                    <div className={\`w-14 h-14 bg-gradient-to-br \${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg\`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 mesh-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-animate="fade-up" id="how-title">
              How NeuroLearn Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-animate="fade-up" data-delay="100" id="how-desc">
              Simple steps to transform your learning experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div data-animate="slide-left" data-delay="200" id="how-image-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80" 
                  alt="Team learning together"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  num: '1',
                  title: 'Assessment & Goal Setting',
                  desc: 'Complete a brief assessment to identify your learning style, knowledge level, and personal learning goals.'
                },
                {
                  num: '2',
                  title: 'Personalized Learning Path',
                  desc: 'Our AI creates a customized curriculum with lessons, exercises, and assessments tailored to your needs.'
                },
                {
                  num: '3',
                  title: 'Adaptive Learning Experience',
                  desc: 'Learn through interactive content that adapts in real-time based on your progress and performance.'
                }
              ].map((step, i) => (
                <div key={i} className="flex items-start space-x-4" data-animate="slide-right" data-delay={\`\${200 + (i * 100)}\`} id={\`step-\${i}\`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div data-animate="fade-up" id="cta-icon">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6" data-animate="fade-up" data-delay="100" id="cta-title">
            Ready to Transform Your Learning?
          </h2>
          
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed" data-animate="fade-up" data-delay="200" id="cta-desc">
            Join thousands of learners who are already experiencing the power of 
            neuroscience-based education. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate="fade-up" data-delay="300" id="cta-buttons">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-2xl" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 2. Chat Assistant (`app/workspace/chat-assistant/page.jsx`)

```javascript
"use client";

import { User, Bot, Send, Brain, MessageCircle, Plus, Clock, Sparkles, Zap, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../_components/AppSidebar";

function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [brainDominance, setBrainDominance] = useState(null);
  const [relevantStrategies, setRelevantStrategies] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showMobileChatHistory, setShowMobileChatHistory] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom when messages change, but also handle loading previous chats
  useEffect(() => {
    if (messages.length > 0) {
      // For new messages, scroll to bottom
      // For loaded chats, maintain scroll position or scroll to bottom if it's a new chat
      scrollToBottom();
    }
  }, [messages]);

  // Load user's chats on component mount
  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
        setBrainDominance(data.brainDominance);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const response = await fetch(\`/api/chat?chatId=\${chatId}\`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setCurrentChatId(chatId);
        setBrainDominance(data.brainDominance);
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setRelevantStrategies([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date()
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          chatId: currentChatId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Check if response indicates API quota issues
      const isQuotaResponse = data.reply && data.reply.includes('experiencing high API usage');
      
      // Add AI response to UI
      const aiMessage = {
        id: data.messageId?.toString() || Date.now().toString(),
        role: 'assistant',
        content: data.reply,
        createdAt: new Date(),
        isQuotaResponse // Flag to style differently
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setCurrentChatId(data.chatId);
      setBrainDominance(data.brainDominance);
      setRelevantStrategies(data.relevantStrategies || []);
      
      // Refresh chats list if this was a new chat
      if (!currentChatId) {
        loadChats();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to UI with specific handling for API quota issues
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message && error.message.includes('quota')) {
        errorContent = 'I\'m currently experiencing high demand due to API usage limits. I\'ve provided a basic response above, but please try again later for more detailed AI assistance.';
      }
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

 return (
  <SidebarProvider>
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* App Sidebar (Left) */}
      <div className="flex-shrink-0">
        <AppSidebar />
      </div>

      {/* Main Chat Section */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden w-full">
        {/* Chat Sidebar (Recent Chats) - Add toggle button for desktop */}
        <aside className="hidden md:flex md:w-80 flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <button
              onClick={startNewChat}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
            {/* Add button to show/hide sidebar */}
            <button className="md:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all">
              <MessageCircle className="w-4 h-4" />
              <span>Chats</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-gray-600 font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Recent Chats
            </h3>
            <div className="space-y-2">
              {chats.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-4">
                  No recent chats yet
                </p>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => loadChatMessages(chat.id)}
                    className={\`w-full text-left p-3 rounded-lg transition \${
                      currentChatId === chat.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }\`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm truncate">
                        Chat {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col min-w-0 w-full max-w-full">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Mobile sidebar trigger */}
              <SidebarTrigger className="md:hidden flex-shrink-0" />
              
              {/* Desktop sidebar toggle button */}
              <button 
                className="hidden md:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all"
                onClick={() => document.querySelector('.flex-shrink-0').classList.toggle('hidden')}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Toggle Sidebar</span>
              </button>
              
              {/* Mobile chat history buttons - Compact */}
              <div className="flex items-center gap-1.5 md:hidden flex-shrink-0">
                <button 
                  onClick={() => setShowMobileChatHistory(true)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-xs shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Chats</span>
                  <span className="text-xs font-medium">({chats.length})</span>
                </button>
                <button 
                  onClick={startNewChat}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg transition-all duration-200 text-xs shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">New</span>
                </button>
              </div>
              
              <h1 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl font-bold text-gray-900 truncate min-w-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="truncate">AI Assistant</span>
              </h1>
            </div>
            {brainDominance && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full border border-gray-200 flex-shrink-0">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm capitalize font-medium text-gray-700">
                  {brainDominance} Brain
                </span>
              </div>
            )}
          </header>

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 w-full max-w-full"
            ref={(el) => {
              if (el) {
                // Ensure we can scroll to the bottom
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center text-gray-500">
                  <Brain className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Welcome to your AI Learning Assistant!
                  </h3>
                  <p className="text-sm mb-4">
                    {brainDominance
                      ? \`🧠 Personalized for \${brainDominance}-brain learners\`
                      : "🚀 Ask me anything about learning!"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                      🎯 Personalized Responses
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                      🧠 Brain-Aware Learning
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                      💡 Smart Suggestions
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3 max-w-full">
                  <div
                    className={\`w-8 h-8 flex items-center justify-center rounded-full \${
                      m.role === "user" ? "bg-blue-600" : "bg-gray-500"
                    }\`}
                  >
                    {m.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={\`p-4 rounded-xl shadow-sm border max-w-full break-words \${
                      m.role === "user"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-white text-gray-900 border-gray-200"
                    }\`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {m.content}
                    </p>
                    <span className="text-xs opacity-60 mt-2 block">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <footer className="p-4 bg-white border-t border-gray-200 w-full max-w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="text"
                className="flex-1 p-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about learning... 🧠"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  <Send className="w-5 h-5 mx-auto" />
                )}
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              <span>Powered by brain-dominance aware AI</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
    
    {/* Mobile Chat History Modal */}
    {showMobileChatHistory && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden">
        <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform border-r border-gray-200 flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Previous Chats
            </h3>
            <button
              onClick={() => setShowMobileChatHistory(false)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button and Switch Chats Button */}
          <div className="p-4 border-b border-gray-200 flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => {
                startNewChat();
                setShowMobileChatHistory(false);
              }}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
            <button
              onClick={() => {
                setShowMobileChatHistory(false);
                // Show sidebar or main chat view
              }}
              className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Back to Chat
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4">
            {chats.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="mb-4">
                  <MessageCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                </div>
                <p className="text-sm font-medium">No previous chats yet</p>
                <p className="text-xs mt-1 text-gray-400">Start a conversation to see your chat history</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      loadChatMessages(chat.id);
                      setShowMobileChatHistory(false);
                    }}
                    className={\`w-full text-left p-3 rounded-lg transition-all duration-200 \${
                      currentChatId === chat.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-sm'
                    }\`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm truncate font-medium">
                        Chat {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs opacity-70 font-mono">
                      {new Date(chat.createdAt).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Backdrop */}
        <div 
          className="absolute inset-0 -z-10" 
          onClick={() => setShowMobileChatHistory(false)}
        />
      </div>
    )}
  </SidebarProvider>
);

}

export default Chat;
```

### 3. Assessment Results (`app/workspace/assessment/results/ResultsClient.jsx`)

```javascript
"use client";

import React, { useEffect, useState } from "react";
import { Brain, Lightbulb, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// ✅ Brain Type Info
const brainTypeInfo = {
  left: {
    label: "Left-Brain Dominant",
    description:
      "You thrive with logic, analysis, and structured approaches to learning.",
    strengths: [
      "Analytical thinking",
      "Detail orientation",
      "Mathematical reasoning",
      "Structured problem-solving",
    ],
    tags: [
      "logical learning",
      "step-by-step methods",
      "structured exercises",
      "data analysis",
    ],
    color: "from-blue-500 to-indigo-500",
  },
  right: {
    label: "Right-Brain Dominant",
    description:
      "You thrive with creative thinking, intuition, and holistic approaches to learning.",
    strengths: [
      "Creative problem-solving",
      "Visual processing",
      "Intuitive understanding",
      "Pattern recognition",
    ],
    tags: ["visual learning", "creative examples", "storytelling", "mind maps"],
    color: "from-purple-500 to-pink-500",
  },
  balanced: {
    label: "Balanced Brain",
    description:
      "You balance logic and creativity, thriving with both structured and open-ended approaches.",
    strengths: [
      "Adaptability",
      "Critical thinking",
      "Collaboration",
      "Holistic problem-solving",
    ],
    tags: [
      "mixed learning methods",
      "group work",
      "case studies",
      "practical projects",
    ],
    color: "from-green-500 to-teal-500",
  },
};

export default function BrainResults({ left: propLeft, right: propRight, dominant: propDominant }) {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  // ✅ Use props if passed, else from URL
  const [left, setLeft] = useState(propLeft ?? parseInt(searchParams.get("left") || "0", 10));
  const [right, setRight] = useState(propRight ?? parseInt(searchParams.get("right") || "0", 10));
  const [dominant_side, setDominantSide] = useState(propDominant || null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch assessment results from database if no props provided
  useEffect(() => {
    const fetchAssessmentResults = async () => {
      if (!isLoaded || !user?.id) {
        setIsLoading(false);
        return;
      }

      // If we have props, use them directly (coming from assessment completion)
      if (propLeft !== undefined && propRight !== undefined && propDominant) {
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from database
      try {
        const response = await fetch(\`/api/user/\${user.id}/assessment\`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.leftScore !== undefined) {
            // Use database values
            const dbLeft = data.leftScore || 0;
            const dbRight = data.rightScore || 0;
            
            // Determine dominant side from database scores
            let dominantSide = data.dominantSide || "balanced";
            if (!data.dominantSide) {
              if (dbLeft > dbRight) dominantSide = "left";
              else if (dbRight > dbLeft) dominantSide = "right";
              else dominantSide = "balanced";
            }
            
            // Update state with database values
            setLeft(dbLeft);
            setRight(dbRight);
            setDominantSide(dominantSide);
            console.log("✅ Loaded assessment from database:", { dbLeft, dbRight, dominantSide });
          }
        }
      } catch (error) {
        console.error("❌ Error fetching assessment results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentResults();
  }, [user, isLoaded, propLeft, propRight, propDominant]);

  // ✅ Determine dominant side from URL params if not from props or database
  useEffect(() => {
    if (dominant_side === null && !isLoading) {
      if (left > right) setDominantSide("left");
      else if (right > left) setDominantSide("right");
      else setDominantSide("balanced");
    }
  }, [left, right, dominant_side, isLoading]);

  // ✅ Save only if this is a *new* test (no props)
  useEffect(() => {
    const saveResults = async () => {
      if (!isLoaded || !user?.id || propDominant) return; // Skip if result exists in DB

      try {
        // Save assessment results using the simplified API
        const resAssessment = await fetch(\`/api/assessment\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            left,
            right,
            dominant_side,
          }),
        });

        if (!resAssessment.ok) {
          const errorData = await resAssessment.json();
          console.error("❌ Failed to save assessment:", errorData);
        } else {
          const result = await resAssessment.json();
          console.log("✅ Assessment saved successfully!", result);
        }
      } catch (error) {
        console.error("❌ Error saving brain results:", error);
      }
    };

    saveResults();
  }, [dominant_side, user, isLoaded, propDominant, left, right]);

  // ✅ Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 py-10">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assessment results...</p>
        </div>
      </div>
    );
  }

  // ✅ Display info (use actual scores from state)
  const brainType = brainTypeInfo[dominant_side || "balanced"];
  
  const total = left + right || 1;
  const leftPercent = Math.round((left / total) * 100);
  const rightPercent = Math.round((right / total) * 100);

return (
  <div className="min-h-screen flex justify-center items-center px-4 py-10">
    <div className="w-full max-w-4xl bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md mb-4">
          <Lightbulb className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold">Assessment Complete!</h2>
        <p
          className={\`text-lg font-semibold bg-gradient-to-r \${brainType.color} bg-clip-text text-transparent\`}
        >
          {brainType.label}
        </p>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {brainType.description}
        </p>
      </div>

      {/* Assessment Result Box - Moved below header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="font-medium flex items-center gap-2 mb-4 text-blue-800">
          <Brain className="w-5 h-5" /> Your Brain Dominance Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-blue-700 mb-1">Left Brain: {leftPercent}%</p>
            <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: \`\${leftPercent}%\` }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-blue-700 mb-1">Right Brain: {rightPercent}%</p>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: \`\${rightPercent}%\` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scores + Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Your Strengths
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm sm:text-base">
            {brainType.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Learning Style */}
        <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" /> Learning Style
          </h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{brainType.description}</p>
          <div className="flex flex-wrap gap-2">
            {brainType.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs sm:text-sm bg-gray-100 border rounded-full text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Fixed CTA - Fully Responsive with proper mobile spacing */}
      <div className="mt-8 text-center">
        <Link
          href="/workspace/chat-assistant"
          className="inline-block w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 text-center"
        >
          Start Your Personalized AI Chat
        </Link>
        <p className="mt-3 text-sm text-gray-500">
          Your AI tutor will adapt to your {brainType.label.toLowerCase()} style.
        </p>
      </div>
      
      {/* Add padding at bottom for mobile to ensure button is visible */}
      <div className="h-6 sm:h-0"></div>
    </div>
  </div>
);

}
```

---

## API Routes

### 1. User API (`app/api/user/route.js`)

```javascript
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    const clerkUserId = clerkUser?.id;
    const { name, email } = await req.json();

    if (!email || !clerkUserId) {
      return NextResponse.json({ success: false, error: "Email or user ID missing" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    let user;

    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      const inserted = await db.insert(usersTable).values({
        id: clerkUserId,
        name: name || "Unnamed User",
        email,
      }).returning();

      user = inserted[0];
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ Error creating/fetching user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

### 2. Middleware (`middleware.js`)

```javascript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect selected routes
  if (isProtectedRoute(req)) {
    auth.protect();
    
    // If user is accessing the root workspace path, redirect based on assessment status
    if (req.nextUrl.pathname === '/workspace') {
      const { userId } = auth;
      if (userId) {
        try {
          // For now, we'll redirect to assessment start by default
          // In a real implementation, you would check if the user has completed the assessment
          const url = req.nextUrl.clone();
          url.pathname = '/workspace/assessment/start';
          return Response.redirect(url);
        } catch (error) {
          // If there's an error checking assessment, redirect to start
          const url = req.nextUrl.clone();
          url.pathname = '/workspace/assessment/start';
          return Response.redirect(url);
        }
      }
    }
  }
});

// ✅ Define what to match (Clerk official config)
export const config = {
  matcher: [
    // Run middleware on all routes except Next internals and static files
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
```

---

## Database Schema

### 1. Database Configuration (`config/db.js`)

```javascript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// ✅ Create Postgres client
const client = postgres(process.env.DATABASE_URL);

// ✅ Create Drizzle ORM instance
export const db = drizzle(client, { schema });
```

### 2. Schema Definition (`config/schema.js`)

```javascript
import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

// ✅ Users table
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  dominant_side: text("dominant_side"), // left, right, balanced
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ✅ Assessments table
export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  leftScore: integer("left_score").notNull(),
  rightScore: integer("right_score").notNull(),
  dominantSide: text("dominant_side").notNull(), // left, right, balanced
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ✅ Chats table
export const chatsTable = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ✅ Messages table
export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .notNull()
    .references(() => chatsTable.id),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## UI Components

### 1. App Sidebar (`app/workspace/_components/AppSidebar.jsx`)

```javascript
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Brain, MessageSquare, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SideBarOptions = [
  { title: "Assessment", icon: Brain, path: "/workspace/assessment" },
  { title: "Chat Assistant", icon: MessageSquare, path: "/workspace/chat-assistant" },
  { title: "Profile", icon: User, path: "/workspace/profile" },
];

export default function AppSidebar() {
  const path = usePathname();
  const { user, isLoaded } = useUser();
  const [dominantSide, setDominantSide] = useState(null);

  // ✅ Fetch dominant side from DB
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchDominantSide = async () => {
      try {
        const res = await fetch(\`/api/user/\${user.id}/dominant\`);
        const data = await res.json();
        if (data.success) {
          setDominantSide(data.dominant_side);
        }
      } catch (error) {
        console.error("❌ Error fetching dominant side:", error);
      }
    };

    fetchDominantSide();
  }, [isLoaded, user]);

  return (
    <Sidebar className="w-64 min-h-screen bg-white border-r shadow-sm">
      {/* Logo */}
      <SidebarHeader className="flex items-center justify-center border-b py-4">
        <Image src="/logo.svg" width={300} height={140} alt="logo" />
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <h2 className="text-xs font-bold text-gray-500 mb-2">LEARNING HUB</h2>
              {SideBarOptions.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.path}
                      className={\`flex items-center gap-3 p-2 rounded-md \${
                        path === item.path ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                      }\`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Brain Type Card */}
        <SidebarGroup className="mt-6">
          <SidebarGroupContent>
            <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
              <div className="flex items-center gap-2">
                <Brain className="text-blue-500 w-5 h-5" />
                <h3 className="text-sm font-medium text-gray-700">Brain Type</h3>
              </div>
              <p className="mt-1 font-semibold text-sm">
                {dominantSide ? dominantSide : "Not tested yet"}
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user?.fullName || "User"}</span>
            <span className="text-xs text-gray-500">Neural Learner</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```

---

## Configuration Files

### 1. Global CSS (`app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
body {
  @apply bg-white;
}

@layer base {
  :root {
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
  }

  .dark {
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.439 0 0);
  }
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Responsive utilities */
@media (max-width: 640px) {
  .container {
    @apply px-4;
  }
}

@media (max-width: 768px) {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}
```

---

## Summary

This comprehensive documentation covers all the key components of the NeuroLearn brain-dominance adaptive learning platform. The application features:

1. **Personalized Learning**: Adapts to left-brain, right-brain, or balanced learning styles
2. **AI-Powered Chat Assistant**: Gemini-based conversational AI that personalizes responses
3. **Assessment System**: Brain dominance assessment with detailed results
4. **Chat History Management**: Persistent chat sessions with easy navigation
5. **Responsive Design**: Works seamlessly across all device sizes
6. **Secure Authentication**: Clerk-based user authentication and management
7. **Database Integration**: PostgreSQL with Drizzle ORM for data persistence

The platform provides a complete learning experience that adapts to each user's cognitive preferences, making education more effective and engaging.