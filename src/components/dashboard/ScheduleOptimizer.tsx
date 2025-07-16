import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Brain, 
  Zap, 
  Plus, 
  RotateCcw,
  TrendingUp,
  Coffee,
  Focus,
  Users,
  AlertTriangle,
  CheckCircle
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

interface ScheduleOptimizerProps {
  tasks: Task[];
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const ScheduleOptimizer: React.FC<ScheduleOptimizerProps> = ({ tasks, events, setEvents }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(78);
  const [suggestedTimeSlots, setSuggestedTimeSlots] = useState<any[]>([]);

  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // 8 AM to 9 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const getEventForTimeSlot = (time: string, date: string) => {
    return events.find(event => 
      event.date === date && 
      event.startTime <= time && 
      event.endTime > time
    );
  };

  const handleOptimizeSchedule = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate optimized schedule
    const optimizedEvents: CalendarEvent[] = [
      {
        id: 'opt-1',
        title: 'Deep Work Block',
        startTime: '09:00',
        endTime: '11:00',
        date: selectedDate,
        source: 'manual',
        type: 'focus'
      },
      {
        id: 'opt-2',
        title: 'Break & Movement',
        startTime: '11:00',
        endTime: '11:15',
        date: selectedDate,
        source: 'manual',
        type: 'break'
      },
      {
        id: 'opt-3',
        title: 'Email & Admin Tasks',
        startTime: '11:15',
        endTime: '12:00',
        date: selectedDate,
        source: 'manual',
        type: 'focus'
      }
    ];

    setEvents(prev => [...prev.filter(e => e.date !== selectedDate || e.source !== 'manual'), ...optimizedEvents]);
    setOptimizationScore(Math.min(95, optimizationScore + Math.floor(Math.random() * 15) + 5));
    setIsOptimizing(false);
    
    toast.success('Schedule optimized!', {
      description: 'AI has created an optimal schedule based on your tasks and preferences.'
    });
  };

  const handleSuggestFreeTime = () => {
    const freeSlots = timeSlots.filter(time => 
      !getEventForTimeSlot(time, selectedDate)
    ).slice(0, 3);

    const suggestions = freeSlots.map(time => ({
      time,
      suggestion: getTaskSuggestionForTime(time),
      duration: 60
    }));

    setSuggestedTimeSlots(suggestions);
    
    toast.success('Free time suggestions generated!', {
      description: `Found ${suggestions.length} available slots for productive work.`
    });
  };

  const getTaskSuggestionForTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const uncompletedTasks = tasks.filter(t => !t.completed);
    
    if (hour >= 9 && hour <= 11) {
      const focusTasks = uncompletedTasks.filter(t => t.category === 'focus' || t.priority === 'urgent');
      return focusTasks[0] || uncompletedTasks[0];
    } else if (hour >= 14 && hour <= 16) {
      const meetingTasks = uncompletedTasks.filter(t => t.category === 'meeting');
      return meetingTasks[0] || uncompletedTasks[0];
    } else {
      const personalTasks = uncompletedTasks.filter(t => t.category === 'personal');
      return personalTasks[0] || uncompletedTasks[0];
    }
  };

  const handleRescheduleConflicts = () => {
    toast.success('Conflicts resolved!', {
      description: 'AI has automatically rescheduled overlapping events.'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'focus': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'break': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'personal': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'focus': return <Focus className="h-4 w-4" />;
      case 'break': return <Coffee className="h-4 w-4" />;
      case 'personal': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const todayEvents = getEventsForDate(selectedDate);
  const busyHours = todayEvents.length;
  const freeHours = timeSlots.length - busyHours;
  const utilizationRate = Math.round((busyHours / timeSlots.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Schedule Optimizer</h2>
          <p className="text-muted-foreground">
            AI-powered schedule optimization and time management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          
          <Button 
            onClick={handleOptimizeSchedule}
            disabled={isOptimizing}
            className="hover-glow"
          >
            <Brain className={`h-4 w-4 mr-2 ${isOptimizing ? 'animate-pulse' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize Schedule'}
          </Button>
        </div>
      </div>

      {/* Optimization Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Schedule Optimization Score</h3>
            <p className="text-sm text-muted-foreground">
              Based on task priorities, energy levels, and calendar efficiency
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{optimizationScore}%</div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
          </div>
        </div>
        
        <Progress value={optimizationScore} className="mb-4" />
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold">{busyHours}h</div>
            <div className="text-muted-foreground">Scheduled</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{freeHours}h</div>
            <div className="text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{utilizationRate}%</div>
            <div className="text-muted-foreground">Utilization</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          onClick={handleSuggestFreeTime}
          className="h-20 flex-col gap-2 hover-glow"
          variant="outline"
        >
          <Zap className="h-5 w-5" />
          <span className="text-xs">Suggest Free Time</span>
        </Button>
        
        <Button 
          onClick={handleRescheduleConflicts}
          className="h-20 flex-col gap-2 hover-glow"
          variant="outline"
        >
          <RotateCcw className="h-5 w-5" />
          <span className="text-xs">Reschedule Conflicts</span>
        </Button>
        
        <Button 
          className="h-20 flex-col gap-2 hover-glow"
          variant="outline"
        >
          <Coffee className="h-5 w-5" />
          <span className="text-xs">Schedule Breaks</span>
        </Button>
        
        <Button 
          className="h-20 flex-col gap-2 hover-glow"
          variant="outline"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs">Analyze Patterns</span>
        </Button>
      </div>

      {/* AI Suggestions */}
      {suggestedTimeSlots.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-ai-primary" />
            AI Suggestions for Free Time
          </h3>
          
          <div className="space-y-3">
            {suggestedTimeSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{slot.time}</div>
                  <div className="text-sm text-muted-foreground">
                    {slot.suggestion ? `Perfect for: ${slot.suggestion.title}` : 'Available for tasks'}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Schedule Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daily Schedule</h3>
        
        <div className="space-y-2">
          {timeSlots.map((time) => {
            const event = getEventForTimeSlot(time, selectedDate);
            
            return (
              <div key={time} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-16 text-sm font-medium text-muted-foreground">
                  {time}
                </div>
                
                <div className="flex-1">
                  {event ? (
                    <div className="flex items-center gap-3">
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeIcon(event.type)}
                        <span className="ml-1">{event.type}</span>
                      </Badge>
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </span>
                      {event.source !== 'manual' && (
                        <Badge variant="outline" className="text-xs">
                          {event.source}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                      <span className="text-sm">Available</span>
                      <Button size="sm" variant="ghost" className="ml-auto">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Schedule Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Productivity Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Peak focus time: 9:00 - 11:00 AM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span>Energy dip expected around 2:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="h-4 w-4 text-blue-600" />
              <span>Schedule break after 2-hour focus blocks</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Optimization Tips</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <strong>Time Blocking:</strong> Group similar tasks together to reduce context switching
            </div>
            <div className="text-sm">
              <strong>Buffer Time:</strong> Add 15-minute buffers between meetings
            </div>
            <div className="text-sm">
              <strong>Energy Management:</strong> Schedule demanding tasks during peak hours
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleOptimizer;