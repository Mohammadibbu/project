import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, Lightbulb, Clock, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'health' | 'focus' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  startTime: string;
  endTime: string;
  completed: boolean;
  description?: string;
  aiSuggestion?: string;
}

interface AIAssistantProps {
  tasks: Task[];
  currentTime: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'suggestion' | 'alert' | 'insight';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ tasks, currentTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "👋 Hi! I'm your AI calendar assistant. I can help you optimize your schedule, detect conflicts, and provide productivity insights.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight'
      }
    ]);
  }, []);

  // Monitor for conflicts and suggestions
  useEffect(() => {
    const checkForInsights = () => {
      const insights = generateAIInsights();
      if (insights.length > 0) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: insights[0],
          sender: 'ai',
          timestamp: new Date(),
          type: 'suggestion'
        };
        setMessages(prev => [...prev, newMessage]);
      }
    };

    const interval = setInterval(checkForInsights, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks, currentTime]);

  const generateAIInsights = (): string[] => {
    const insights: string[] = [];
    
    // Check for conflicts
    const sortedTasks = tasks.filter(t => !t.completed).sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      const current = sortedTasks[i];
      const next = sortedTasks[i + 1];
      
      if (current.endTime > next.startTime) {
        insights.push(`⚠️ Conflict detected: "${current.title}" overlaps with "${next.title}". Consider rescheduling.`);
      }
    }

    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (task.completed) return false;
      const [hours, minutes] = task.endTime.split(':').map(Number);
      const taskTime = new Date();
      taskTime.setHours(hours, minutes, 0, 0);
      return new Date() > taskTime;
    });

    if (overdueTasks.length > 0) {
      insights.push(`🕐 You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Shall I help you reschedule?`);
    }

    // Productivity suggestions
    const currentHour = parseInt(currentTime.split(':')[0]);
    if (currentHour >= 10 && currentHour <= 12) {
      const focusTasks = tasks.filter(t => t.category === 'focus' && !t.completed);
      if (focusTasks.length > 0) {
        insights.push(`🧠 It's peak focus time! Consider tackling "${focusTasks[0].title}" for maximum productivity.`);
      }
    }

    // Wellness reminders
    if (currentHour === 14 || currentHour === 16) {
      insights.push(`💧 Hydration reminder: Don't forget to drink water and take a short break!`);
    }

    return insights.slice(0, 1); // Return only the most relevant insight
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('schedule') || lowerInput.includes('reschedule')) {
      return "I can help you reschedule tasks! I notice you have some conflicts. Would you like me to suggest optimal time slots based on your productivity patterns?";
    }
    
    if (lowerInput.includes('productivity') || lowerInput.includes('focus')) {
      return "Based on your schedule, your peak focus hours are 10 AM - 12 PM. I recommend scheduling deep work tasks during this time and lighter tasks in the afternoon.";
    }
    
    if (lowerInput.includes('break') || lowerInput.includes('rest')) {
      return "Great question! I suggest taking a 5-minute break every hour and a longer 15-20 minute break every 2-3 hours. Would you like me to add break reminders to your calendar?";
    }
    
    if (lowerInput.includes('conflict') || lowerInput.includes('overlap')) {
      const conflicts = tasks.filter((task, index) => {
        const nextTask = tasks[index + 1];
        return nextTask && task.endTime > nextTask.startTime;
      });
      
      if (conflicts.length > 0) {
        return `I found ${conflicts.length} scheduling conflict${conflicts.length > 1 ? 's' : ''}. Shall I suggest some alternative time slots?`;
      }
      return "No conflicts detected in your current schedule! 🎉";
    }
    
    if (lowerInput.includes('wellness') || lowerInput.includes('health')) {
      return "Don't forget about your wellness goals! Make sure to stay hydrated, take breaks, and maintain good posture during long work sessions.";
    }
    
    return "I'm here to help optimize your schedule and boost productivity! You can ask me about scheduling conflicts, productivity tips, or wellness reminders.";
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bot className="w-4 h-4 text-ai-primary" />;
    }
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-ai-primary hover:bg-ai-primary/90 text-white shadow-glow animate-pulse-glow z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* AI Assistant Panel */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 glass-card z-50 transition-all duration-300 animate-slide-up ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ai-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Smart Calendar Helper</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent/50 text-foreground'
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <div className="flex items-center gap-2 mb-1">
                          {getMessageIcon(message.type)}
                          <span className="text-xs font-medium">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString().slice(0, 5)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-accent/50 p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about your schedule..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue('Check for conflicts')}
                    className="text-xs"
                  >
                    Check Conflicts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue('Productivity tips')}
                    className="text-xs"
                  >
                    Tips
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default AIAssistant;