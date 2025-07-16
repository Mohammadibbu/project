import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Send, 
  Lightbulb, 
  Calendar, 
  Target, 
  Clock,
  Zap,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Coffee,
  Focus
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'urgent' | 'important' | 'low';
  category: 'work' | 'personal' | 'health' | 'focus' | 'meeting';
  deadline?: string;
  estimatedDuration: number;
  completed: boolean;
  source: 'manual' | 'todoist' | 'asana' | 'google' | 'outlook';
  aiSuggestion?: string;
  tags: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  source: 'google' | 'outlook' | 'manual';
  type: 'meeting' | 'focus' | 'break' | 'personal';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'suggestion' | 'insight' | 'task' | 'schedule';
  actionable?: boolean;
  action?: () => void;
}

interface AIAssistantProps {
  tasks: Task[];
  events: CalendarEvent[];
  onSuggestTask: (task: Task) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ tasks, events, onSuggestTask }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: "Hi! I'm your AI productivity assistant. I can help you optimize your schedule, prioritize tasks, and provide personalized productivity insights. What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'insight'
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): Message => {
    const lowerInput = input.toLowerCase();
    
    // Task-related queries
    if (lowerInput.includes('task') || lowerInput.includes('todo')) {
      const urgentTasks = tasks.filter(t => t.priority === 'urgent' && !t.completed);
      if (urgentTasks.length > 0) {
        return {
          id: (Date.now() + 1).toString(),
          text: `You have ${urgentTasks.length} urgent tasks pending. I recommend starting with "${urgentTasks[0].title}" as it's high priority. Would you like me to schedule focus time for this?`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'task',
          actionable: true,
          action: () => toast.success('Focus time scheduled for urgent task!')
        };
      }
    }

    // Schedule-related queries
    if (lowerInput.includes('schedule') || lowerInput.includes('calendar')) {
      const todayEvents = events.filter(e => e.date === new Date().toISOString().split('T')[0]);
      return {
        id: (Date.now() + 1).toString(),
        text: `You have ${todayEvents.length} events scheduled for today. Your next free slot is at 2:00 PM - perfect for a 90-minute focus session. Shall I block this time for deep work?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'schedule',
        actionable: true,
        action: () => toast.success('Focus block scheduled for 2:00 PM!')
      };
    }

    // Productivity queries
    if (lowerInput.includes('productive') || lowerInput.includes('focus')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Based on your patterns, you're most productive between 9-11 AM. I notice you have some free time tomorrow morning - perfect for tackling that important project. Your focus sessions are 23% more effective when you take a 5-minute break every 25 minutes.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight'
      };
    }

    // Time management queries
    if (lowerInput.includes('time') || lowerInput.includes('manage')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "I've analyzed your time allocation and found you spend 65% on work tasks, 20% on meetings, and 15% on personal items. To optimize your schedule, try batching similar tasks together and blocking 2-hour chunks for deep work. Would you like me to reorganize your week?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion',
        actionable: true,
        action: () => toast.success('Schedule optimization applied!')
      };
    }

    // Break/wellness queries
    if (lowerInput.includes('break') || lowerInput.includes('tired') || lowerInput.includes('rest')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "It sounds like you need a break! Research shows that taking regular breaks improves focus by up to 40%. I recommend a 15-minute walk or some light stretching. You've been working for 2 hours straight - perfect timing for a refresh.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion',
        actionable: true,
        action: () => toast.success('Break reminder set for 15 minutes!')
      };
    }

    // Default responses
    const defaultResponses = [
      {
        text: "I can help you with task prioritization, schedule optimization, and productivity insights. What specific area would you like to focus on?",
        type: 'insight' as const
      },
      {
        text: "Based on your current workload, I suggest focusing on your urgent tasks first. You have 3 high-priority items that could benefit from dedicated focus time.",
        type: 'task' as const
      },
      {
        text: "Your productivity score is 78% this week. To improve, try scheduling your most important tasks during your peak energy hours (9-11 AM).",
        type: 'insight' as const
      }
    ];

    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return {
      id: (Date.now() + 1).toString(),
      text: randomResponse.text,
      sender: 'ai',
      timestamp: new Date(),
      type: randomResponse.type
    };
  };

  const quickActions = [
    {
      label: "Optimize my schedule",
      icon: <Calendar className="h-4 w-4" />,
      action: () => {
        const message: Message = {
          id: Date.now().toString(),
          text: "I've analyzed your calendar and found several optimization opportunities. Moving your deep work sessions to 9-11 AM could increase productivity by 35%. Shall I make these adjustments?",
          sender: 'ai',
          timestamp: new Date(),
          type: 'schedule',
          actionable: true,
          action: () => toast.success('Schedule optimized!')
        };
        setMessages(prev => [...prev, message]);
      }
    },
    {
      label: "Prioritize my tasks",
      icon: <Target className="h-4 w-4" />,
      action: () => {
        const message: Message = {
          id: Date.now().toString(),
          text: "I've reprioritized your tasks based on deadlines, importance, and your energy levels. Your top 3 priorities are now: 1) Complete quarterly report (urgent), 2) Review code submissions (important), 3) Plan weekend trip (low). Focus on #1 first!",
          sender: 'ai',
          timestamp: new Date(),
          type: 'task'
        };
        setMessages(prev => [...prev, message]);
      }
    },
    {
      label: "Suggest focus time",
      icon: <Focus className="h-4 w-4" />,
      action: () => {
        const message: Message = {
          id: Date.now().toString(),
          text: "Perfect timing! You have a 2-hour window from 10 AM to 12 PM tomorrow with no meetings. This aligns with your peak focus hours. I recommend using this time for your most challenging task. Shall I block this time?",
          sender: 'ai',
          timestamp: new Date(),
          type: 'suggestion',
          actionable: true,
          action: () => toast.success('Focus time blocked!')
        };
        setMessages(prev => [...prev, message]);
      }
    },
    {
      label: "Weekly insights",
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => {
        const message: Message = {
          id: Date.now().toString(),
          text: "This week you completed 85% of your planned tasks - great job! Your most productive day was Tuesday (95% completion). I notice you work best in 90-minute blocks with 15-minute breaks. Your focus time increased by 12% compared to last week.",
          sender: 'ai',
          timestamp: new Date(),
          type: 'insight'
        };
        setMessages(prev => [...prev, message]);
      }
    }
  ];

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'insight':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'task':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'schedule':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-ai-primary" />;
    }
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'suggestion':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'insight':
        return 'border-l-purple-500 bg-purple-50';
      case 'task':
        return 'border-l-blue-500 bg-blue-50';
      case 'schedule':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-ai-primary bg-ai-primary/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-ai-primary" />
            AI Assistant
          </h2>
          <p className="text-muted-foreground">
            Your intelligent productivity companion
          </p>
        </div>
        
        <Badge className="bg-ai-primary/10 text-ai-primary border-ai-primary/20">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="flex items-center gap-2 hover-glow"
            >
              {action.icon}
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-ai-primary" />
          <h3 className="font-semibold">Chat with AI Assistant</h3>
        </div>
        
        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : `border-l-4 ${getMessageTypeColor(message.type)}`
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    {getMessageIcon(message.type)}
                    <span className="text-xs font-medium text-ai-primary">AI Assistant</span>
                    {message.type && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {message.type}
                      </Badge>
                    )}
                  </div>
                )}
                
                <p className="text-sm">{message.text}</p>
                
                {message.actionable && message.action && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={message.action}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Apply Suggestion
                  </Button>
                )}
                
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg border-l-4 border-l-ai-primary">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-ai-primary animate-pulse" />
                  <span className="text-xs font-medium text-ai-primary">AI Assistant is typing...</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-ai-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about your tasks, schedule, or productivity..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* AI Capabilities */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">What I Can Help With</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Task prioritization and management</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>Schedule optimization and planning</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Focus className="h-4 w-4 text-purple-500" />
              <span>Focus time recommendations</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span>Productivity insights and analytics</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="h-4 w-4 text-brown-500" />
              <span>Break and wellness reminders</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>Personalized productivity tips</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;