import React from 'react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { AccessibleButton } from '@/components/ui/accessible-button';

interface Task {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'health' | 'focus' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  startTime: string;
  endTime: string;
  completed: boolean;
  description?: string;
}

interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
}

interface DailySummaryProps {
  weatherInfo: WeatherInfo;
  topTasks: Task[];
  motivationalQuote: string;
  emotionalState: string;
  onEmotionalStateChange: (state: string) => void;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  weatherInfo,
  topTasks,
  motivationalQuote,
  emotionalState,
  onEmotionalStateChange
}) => {
  const emoticons = ['😊', '😃', '😐', '😔', '😴', '💪', '🧘', '🔥'];

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'work':
        return 'info';
      case 'personal':
        return 'success';
      case 'health':
        return 'danger';
      case 'focus':
        return 'default';
      case 'meeting':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Weather Card */}
        <InteractiveCard className="p-6 text-center" hover>
          <div className="text-4xl mb-3" role="img" aria-label={weatherInfo.condition}>
            {weatherInfo.icon}
          </div>
          <h3 className="font-semibold text-lg mb-1">{weatherInfo.temperature}°C</h3>
          <p className="text-muted-foreground text-sm">{weatherInfo.condition}</p>
        </InteractiveCard>

        {/* Top Tasks Card */}
        <InteractiveCard className="p-6 lg:col-span-2" hover>
          <h3 className="font-semibold text-lg mb-4">Today's Priority Tasks</h3>
          <div className="space-y-3">
            {topTasks.map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-medium flex-1">{task.title}</span>
                <StatusBadge 
                  variant={getCategoryVariant(task.category)}
                  size="sm"
                >
                  {task.startTime}
                </StatusBadge>
              </div>
            ))}
          </div>
        </InteractiveCard>

        {/* Emotional Check-in Card */}
        <InteractiveCard className="p-6" hover>
          <h3 className="font-semibold text-lg mb-4">How are you feeling?</h3>
          <div className="grid grid-cols-4 gap-2">
            {emoticons.map((emotion) => (
              <AccessibleButton
                key={emotion}
                variant={emotionalState === emotion ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onEmotionalStateChange(emotion)}
                className={`text-2xl h-12 w-12 ${
                  emotionalState === emotion ? 'scale-110 shadow-md' : 'hover:scale-105'
                } transition-all duration-200`}
                aria-label={`Select ${emotion} emotion`}
                aria-pressed={emotionalState === emotion}
              >
                {emotion}
              </AccessibleButton>
            ))}
          </div>
        </InteractiveCard>
      </div>

      {/* Motivational Quote */}
      <InteractiveCard className="p-6 mt-6 text-center" hover>
        <blockquote className="text-lg italic text-foreground/80 mb-4">
          "{motivationalQuote}"
        </blockquote>
        <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-success mx-auto" />
      </InteractiveCard>
    </div>
  );
};

export default DailySummary;