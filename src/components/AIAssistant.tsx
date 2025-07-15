import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Mic, MicOff, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  darkMode: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, darkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI scheduling assistant. I can help you optimize your calendar, suggest better meeting times, and manage your tasks. What would you like to do?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiResponses = [
    "I've analyzed your calendar and found a 2-hour focus block available from 2-4 PM. Would you like me to block this time?",
    "Based on your meeting patterns, I suggest moving your 3 PM call to 4 PM to avoid back-to-back meetings.",
    "I notice you have a gap between meetings. Perfect time for a quick break or to tackle that high-priority task!",
    "Your energy levels are typically highest in the morning. Should I reschedule your creative work to 9-11 AM?",
    "I can help you prepare for your upcoming client meeting. Would you like me to create a quick agenda?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setInputText("Schedule a meeting with the design team for tomorrow");
        setIsListening(false);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 interactive ${
          darkMode 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white z-50`}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 z-50 slide-up">
      <div className={`rounded-2xl shadow-xl border h-full flex flex-col ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b rounded-t-2xl ${
          darkMode ? 'border-gray-700 bg-gray-750' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-75">Online</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className={`p-1 rounded-lg transition-colors interactive ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'opacity-50'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-slate-100'
                }`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-slate-300 text-slate-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg transition-all duration-200 interactive ${
                isListening 
                  ? 'bg-red-600 text-white' 
                  : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors interactive disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};