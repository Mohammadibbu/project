import React, { useState } from 'react';
import { Clock, MoreVertical, Plus } from 'lucide-react';

interface TimelineViewProps {
  selectedDate: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number;
  category: 'work' | 'personal' | 'health' | 'meeting' | 'focus';
  description?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ selectedDate }) => {
  const [events] = useState<CalendarEvent[]>([
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
      category: 'meeting'
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
      category: 'meeting'
    },
    {
      id: '6',
      title: 'Code Review',
      time: '16:00',
      duration: 45,
      category: 'work'
    }
  ]);

  const categoryColors = {
    work: 'bg-blue-100 border-blue-300 text-blue-800',
    personal: 'bg-green-100 border-green-300 text-green-800',
    health: 'bg-pink-100 border-pink-300 text-pink-800',
    meeting: 'bg-purple-100 border-purple-300 text-purple-800',
    focus: 'bg-orange-100 border-orange-300 text-orange-800'
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Timeline</h2>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-500" />
            <span className="text-sm text-slate-600">5:00 AM - 11:00 PM</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-1">
          {timeSlots.map((time, index) => {
            const event = getEventForTime(time);
            const isHour = time.endsWith(':00');
            
            return (
              <div key={time} className={`flex items-center ${isHour ? 'py-2' : 'py-1'}`}>
                <div className="w-16 text-sm text-slate-500 font-medium">
                  {time}
                </div>
                
                <div className="flex-1 ml-4 relative">
                  {event ? (
                    <div className={`p-3 rounded-lg border-l-4 ${categoryColors[event.category]} hover:shadow-md transition-shadow cursor-pointer group`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm opacity-75">{event.duration} min</p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 border-l-2 border-slate-200 hover:border-blue-300 transition-colors group cursor-pointer">
                      <button className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity">
                        <Plus className="w-4 h-4 text-slate-400" />
                      </button>
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