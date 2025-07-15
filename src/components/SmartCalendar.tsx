import React, { useState, useEffect } from 'react';
import DailySummary from './calendar/DailySummary';
import TimeBlockCalendar from './calendar/TimeBlockCalendar';
import TaskSidebar from './calendar/TaskSidebar';
import WellnessTrackers from './calendar/WellnessTrackers';
import AIAssistant from './calendar/AIAssistant';
import IntegrationPanel from './calendar/IntegrationPanel';

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

interface CalendarData {
  tasks: Task[];
  weatherInfo: {
    temperature: number;
    condition: string;
    icon: string;
  };
  motivationalQuote: string;
  wellnessData: {
    hydration: number;
    sleep: number;
    mindfulness: number;
  };
}

const SmartCalendar: React.FC = () => {
  const [calendarData, setCalendarData] = useState<CalendarData>({
    tasks: [
      {
        id: '1',
        title: 'Team Standup',
        category: 'work',
        priority: 'high',
        startTime: '09:00',
        endTime: '09:30',
        completed: false,
        description: 'Daily team sync and planning'
      },
      {
        id: '2',
        title: 'Deep Work Session',
        category: 'focus',
        priority: 'high',
        startTime: '10:00',
        endTime: '12:00',
        completed: false,
        description: 'Product feature development',
        aiSuggestion: 'Best productivity time detected - maintain focus'
      },
      {
        id: '3',
        title: 'Lunch & Walk',
        category: 'health',
        priority: 'medium',
        startTime: '12:30',
        endTime: '13:30',
        completed: false,
        description: 'Healthy break and movement'
      },
      {
        id: '4',
        title: 'Client Meeting',
        category: 'meeting',
        priority: 'high',
        startTime: '14:00',
        endTime: '15:00',
        completed: false,
        description: 'Project review and feedback'
      },
      {
        id: '5',
        title: 'Personal Project',
        category: 'personal',
        priority: 'low',
        startTime: '19:00',
        endTime: '20:30',
        completed: false,
        description: 'Side project development'
      }
    ],
    weatherInfo: {
      temperature: 22,
      condition: 'Partly Cloudy',
      icon: '⛅'
    },
    motivationalQuote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    wellnessData: {
      hydration: 6,
      sleep: 7.5,
      mindfulness: 10
    }
  });

  const [emotionalState, setEmotionalState] = useState<string>('😊');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 5));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setCalendarData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask
    };
    setCalendarData(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
  };

  const updateWellness = (type: keyof CalendarData['wellnessData'], value: number) => {
    setCalendarData(prev => ({
      ...prev,
      wellnessData: {
        ...prev.wellnessData,
        [type]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Sidebar - Tasks */}
        <div className="lg:w-80 lg:min-h-screen border-r border-border/50">
          <TaskSidebar 
            tasks={calendarData.tasks}
            onUpdateTask={updateTask}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Section - Daily Summary */}
          <div className="border-b border-border/50">
            <DailySummary
              weatherInfo={calendarData.weatherInfo}
              topTasks={calendarData.tasks.slice(0, 3)}
              motivationalQuote={calendarData.motivationalQuote}
              emotionalState={emotionalState}
              onEmotionalStateChange={setEmotionalState}
            />
          </div>

          {/* Middle Section - Calendar and Wellness */}
          <div className="flex-1 flex flex-col xl:flex-row">
            
            {/* Time Block Calendar */}
            <div className="flex-1 p-6">
              <TimeBlockCalendar
                tasks={calendarData.tasks}
                currentTime={currentTime}
                onUpdateTask={updateTask}
                onAddTask={addTask}
              />
            </div>

            {/* Right Sidebar - Wellness */}
            <div className="xl:w-80 border-l border-border/50">
              <WellnessTrackers
                wellnessData={calendarData.wellnessData}
                onUpdateWellness={updateWellness}
              />
            </div>
          </div>

          {/* Bottom Section - Integrations */}
          <div className="border-t border-border/50">
            <IntegrationPanel />
          </div>
        </div>
      </div>

      {/* AI Assistant - Floating */}
      <AIAssistant tasks={calendarData.tasks} currentTime={currentTime} />
    </div>
  );
};

export default SmartCalendar;