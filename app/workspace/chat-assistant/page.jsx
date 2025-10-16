"use client";

import { User, Bot, Send, Brain, MessageCircle, Plus, Clock, Sparkles, Zap, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../_components/AppSidebar";

export default function Chat() {
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
      const response = await fetch(`/api/chat?chatId=${chatId}`);
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
        {/* Chat Sidebar (Recent Chats) */}
        <aside className="hidden md:flex md:w-80 flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Chat
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
                    className={`w-full text-left p-3 rounded-lg transition ${
                      currentChatId === chat.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
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
          <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {/* Mobile sidebar trigger */}
              <SidebarTrigger className="sm:hidden" />
              <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                AI Learning Assistant
              </h1>
            </div>
            {brainDominance && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full border border-gray-200">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm capitalize font-medium text-gray-700">
                  {brainDominance} Brain
                </span>
              </div>
            )}
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 w-full max-w-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center text-gray-500">
                  <Brain className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Welcome to your AI Learning Assistant!
                  </h3>
                  <p className="text-sm mb-4">
                    {brainDominance
                      ? `🧠 Personalized for ${brainDominance}-brain learners`
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
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      m.role === "user" ? "bg-blue-600" : "bg-gray-500"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-xl shadow-sm border max-w-full break-words ${
                      m.role === "user"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-white text-gray-900 border-gray-200"
                    }`}
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
  </SidebarProvider>
);

}