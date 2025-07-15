import React, { useState, useEffect } from 'react';
import { Droplets, Moon, Heart, Target, Zap } from 'lucide-react';

interface HabitData {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  current: number;
  target: number;
  unit: string;
  color: string;
  streak: number;
}

interface HabitTrackerProps {
  darkMode: boolean;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ darkMode }) => {
  const [habits, setHabits] = useState<HabitData[]>([
    {
      id: '1',
      name: 'Water Intake',
      icon: Droplets,
      current: 6,
      target: 8,
      unit: 'glasses',
      color: 'blue',
      streak: 5
    },
    {
      id: '2',
      name: 'Sleep',
      icon: Moon,
      current: 7.5,
      target: 8,
      unit: 'hours',
      color: 'purple',
      streak: 12
    },
    {
      id: '3',
      name: 'Mindfulness',
      icon: Heart,
      current: 15,
      target: 20,
      unit: 'minutes',
      color: 'pink',
      streak: 3
    },
    {
      id: '4',
      name: 'Exercise',
      icon: Target,
      current: 1,
      target: 1,
      unit: 'session',
      color: 'green',
      streak: 7
    }
  ]);

  const [celebratingHabit, setCelebratingHabit] = useState<string | null>(null);
  const [mindfulnessTimer, setMindfulnessTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && mindfulnessTimer > 0) {
      interval = setInterval(() => {
        setMindfulnessTimer(timer => timer - 1);
      }, 1000);
    } else if (mindfulnessTimer === 0 && isTimerActive) {
      setIsTimerActive(false);
      // Update mindfulness habit
      setHabits(prev => prev.map(habit => 
        habit.id === '3' 
          ? { ...habit, current: Math.min(habit.current + 1, habit.target) }
          : habit
      ));
    }
    return () => clearInterval(interval);
  }, [isTimerActive, mindfulnessTimer]);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800',
      purple: darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800',
      pink: darkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-800',
      green: darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getProgressBarColor = (color: string) => {
    const colors = {
      blue: 'from-blue-400 to-blue-600',
      purple: 'from-purple-400 to-purple-600',
      pink: 'from-pink-400 to-pink-600',
      green: 'from-green-400 to-green-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const incrementHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCurrent = Math.min(habit.current + (habit.unit === 'glasses' ? 1 : 0.5), habit.target);
        const wasCompleted = habit.current >= habit.target;
        const isNowCompleted = newCurrent >= habit.target;
        
        if (!wasCompleted && isNowCompleted) {
          setCelebratingHabit(id);
          setTimeout(() => setCelebratingHabit(null), 2000);
        }
        
        return { ...habit, current: newCurrent };
      }
      return habit;
    }));
  };

  const startMindfulnessTimer = () => {
    setMindfulnessTimer(60); // 1 minute
    setIsTimerActive(true);
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-slate-200'
    }`}>
      <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>
      
      <div className="space-y-4">
        {habits.map((habit) => {
          const IconComponent = habit.icon;
          const percentage = getProgressPercentage(habit.current, habit.target);
          const isCompleted = percentage >= 100;
          
          return (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${getColorClasses(habit.color)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-medium">{habit.name}</span>
                    <div className="flex items-center space-x-2 text-sm opacity-75">
                      <span>{habit.current}/{habit.target} {habit.unit}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {habit.id === '3' && (
                    <button
                      onClick={startMindfulnessTimer}
                      disabled={isTimerActive}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isTimerActive 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-pink-600 text-white hover:bg-pink-700 interactive'
                      }`}
                    >
                      {isTimerActive ? `${mindfulnessTimer}s` : '1min'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => incrementHabit(habit.id)}
                    className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors interactive"
                    disabled={isCompleted}
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  
                  {isCompleted && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  
                  {celebratingHabit === habit.id && (
                    <div className="firework-celebration">
                      <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                <div 
                  className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressBarColor(habit.color)} progress-animated`}
                  style={{ 
                    width: `${percentage}%`,
                    '--progress-width': `${percentage}%`
                  } as any}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mindfulness Timer with Ripple Effect */}
      {isTimerActive && (
        <div className={`mt-6 p-4 rounded-xl text-center ${
          darkMode ? 'bg-pink-900' : 'bg-pink-50'
        }`}>
          <div className="relative inline-block">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {mindfulnessTimer}
            </div>
            <div className="absolute inset-0 bg-pink-400 rounded-full ripple-effect"></div>
          </div>
          <p className="mt-2 text-sm font-medium">Mindfulness Session</p>
        </div>
      )}

      {/* AI Micro-Goals */}
      <div className={`mt-6 p-4 rounded-xl ${
        darkMode 
          ? 'bg-gradient-to-r from-blue-900 to-indigo-900' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50'
      }`}>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
          AI Micro-Goals
        </h3>
        <div className="space-y-2">
          <p className="text-sm opacity-75">• Drink water during your next meeting</p>
          <p className="text-sm opacity-75">• Take 3 deep breaths before your 2 PM call</p>
          <p className="text-sm opacity-75">• Stand and stretch every hour today</p>
        </div>
      </div>
    </div>
  );
};