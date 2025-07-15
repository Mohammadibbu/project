import React, { useState, useRef } from 'react';
import { Clock, MoreVertical, Plus, Zap, Coffee } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  time: string;
  duration: number;
  category: 'work' | 'personal' | 'health' | 'meeting' | 'focus';
  description?: string;
  isCurrentTask?: boolean;
  isOverdue?: boolean;
}

interface InteractiveTimelineProps {
  selectedDate: Date;
  darkMode: boolean;
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ selectedDate, darkMode }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      title: 'Morning Workout',
      time: '06:00',
      duration: 60,
      category: 'health'
    },
    {
      id: '2',
      title: 'Team Standup',
      time: '09:00',
      duration: 30,
      category: 'meeting',
      isCurrentTask: true
    },
    {
      id: '3',
      title: 'Deep Work - Project Alpha',
      time: '10:00',
      duration: 120,
      category: 'focus'
    },
    {
      id: '4',
      title: 'Lunch Break',
      time: '12:30',
      duration: 60,
      category: 'personal'
    },
    {
      id: '5',
      title: 'Client Meeting',
      time: '14:00',
      duration: 90,
      category: 'meeting',
      isOverdue: true
    },
    {
      id: '6',
      title: 'Code Review',
      time: '16:00',
      duration: 45,
      category: 'work'
    }
  ]);

  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const categoryColors = {
    work: darkMode 
      ? 'bg-blue-900 border-blue-600 text-blue-200' 
      : 'bg-blue-100 border-blue-300 text-blue-800',
    personal: darkMode 
      ? 'bg-green-900 border-green-600 text-green-200' 
      : 'bg-green-100 border-green-300 text-green-800',
    health: darkMode 
      ? 'bg-pink-900 border-pink-600 text-pink-200' 
      : 'bg-pink-100 border-pink-300 text-pink-800',
    meeting: darkMode 
      ? 'bg-orange-900 border-orange-600 text-orange-200' 
      : 'bg-orange-100 border-orange-300 text-orange-800',
    focus: darkMode 
      ? 'bg-purple-900 border-purple-600 text-purple-200' 
      : 'bg-purple-100 border-purple-300 text-purple-800'
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getEventForTime = (time: string) => {
    return events.find(event => event.time === time);
  };

  const handleDragStart = (eventId: string) => {
    setDraggedEvent(eventId);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (time: string) => {
    if (draggedEvent) {
      setEvents(events.map(event => 
        event.id === draggedEvent 
          ? { ...event, time }
          : event
      ));
      setDraggedEvent(null);
    }
  };

  const aiSuggestions = [
    { time: '11:00', suggestion: 'Perfect time for deep work - your focus peaks now!' },
    { time: '15:30', suggestion: 'Consider a 15-min break - you\'ve been focused for 2 hours' },
    { time: '17:00', suggestion: 'Ideal time to wrap up tasks before evening wind-down' }
  ];

  const getSuggestionForTime = (time: string) => {
    return aiSuggestions.find(s => s.time === time);
  };

  return (
    <div className={`rounded-2xl shadow-lg border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-slate-200'
    }`}>
      <div className={`p-6 border-b transition-all duration-300 ${
        darkMode ? 'border-gray-700' : 'border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Interactive Timeline</h2>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <span className="text-sm opacity-75">5:00 AM - 11:00 PM</span>
            <button className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div 
          ref={timelineRef}
          className="space-y-1 custom-scrollbar max-h-96 overflow-y-auto"
        >
          {timeSlots.map((time, index) => {
            const event = getEventForTime(time);
            const suggestion = getSuggestionForTime(time);
            const isHour = time.endsWith(':00');
            
            return (
              <div key={time} className={`flex items-center ${isHour ? 'py-2' : 'py-1'}`}>
                <div className="w-16 text-sm font-medium opacity-75">
                  {time}
                </div>
                
                <div 
                  className="flex-1 ml-4 relative"
                  onDrop={() => handleDrop(time)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {event ? (
                    <div 
                      draggable
                      onDragStart={() => handleDragStart(event.id)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-lg border-l-4 transition-all duration-300 cursor-move group hover-lift ${
                        categoryColors[event.category]
                      } ${event.isCurrentTask ? 'glow-current' : ''} ${
                        event.isOverdue ? 'pulse-urgent' : ''
                      } ${draggedEvent === event.id ? 'dragging' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm opacity-75">{event.duration} min</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {event.isCurrentTask && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                          <button 
                            className="opacity-0 group-hover:opacity-100 transition-opacity interactive"
                            onClick={() => setShowSuggestions(showSuggestions === event.id ? null : event.id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {showSuggestions === event.id && (
                        <div className={`mt-3 p-2 rounded-lg text-sm slide-up ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        }`}>
                          <p className="flex items-center">
                            <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                            AI suggests moving this 30 minutes earlier for better flow
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className={`h-8 border-l-2 transition-all duration-200 hover:border-blue-400 group cursor-pointer relative ${
                        darkMode ? 'border-gray-600' : 'border-slate-200'
                      }`}
                      onDrop={() => handleDrop(time)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <button className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity interactive">
                        <Plus className="w-4 h-4 text-slate-400" />
                      </button>
                      
                      {suggestion && (
                        <div className={`absolute left-8 top-0 p-2 rounded-lg text-xs whitespace-nowrap z-10 slide-up ${
                          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-800'
                        }`}>
                          <div className="flex items-center">
                            <Coffee className="w-3 h-3 mr-1" />
                            {suggestion.suggestion}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};