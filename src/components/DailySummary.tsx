import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Thermometer, Quote, Target, Users, Heart, Brain } from 'lucide-react';

interface DailySummaryProps {
  selectedDate: Date;
  darkMode: boolean;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ selectedDate, darkMode }) => {
  const [emotionalWellness, setEmotionalWellness] = useState<'great' | 'good' | 'okay' | 'stressed'>('good');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 200);
  }, []);

  const weatherData = {
    temperature: 72,
    condition: 'Partly Cloudy',
    icon: Sun
  };

  const dailyStats = {
    meetings: 3,
    tasks: 7,
    focusTime: '4h 30m',
    completedTasks: 4
  };

  const topTasks = [
    'Complete project proposal',
    'Review code submissions', 
    'Prepare presentation slides'
  ];

  const motivationalQuote = {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  };

  const wellnessColors = {
    great: 'from-green-400 to-emerald-500',
    good: 'from-blue-400 to-cyan-500',
    okay: 'from-yellow-400 to-orange-500',
    stressed: 'from-red-400 to-pink-500'
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Daily Overview</h2>
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <select 
            value={emotionalWellness}
            onChange={(e) => setEmotionalWellness(e.target.value as any)}
            className={`text-sm rounded-lg px-3 py-1 border transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="great">Feeling Great! 😊</option>
            <option value="good">Good 🙂</option>
            <option value="okay">Okay 😐</option>
            <option value="stressed">Stressed 😰</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Weather */}
        <div className={`p-4 rounded-xl transition-all duration-300 hover-lift ${
          isAnimated ? 'fade-in-up' : 'opacity-0'
        } ${darkMode ? 'bg-gradient-to-r from-blue-900 to-sky-900' : 'bg-gradient-to-r from-blue-50 to-sky-50'}`}>
          <div className="flex items-center space-x-3">
            <weatherData.icon className="w-8 h-8 text-blue-600 animate-pulse" />
            <div>
              <p className="text-2xl font-bold">{weatherData.temperature}°F</p>
              <p className="text-sm opacity-75">{weatherData.condition}</p>
            </div>
          </div>
        </div>

        {/* Meetings */}
        <div className={`p-4 rounded-xl transition-all duration-300 hover-lift ${
          isAnimated ? 'fade-in-up' : 'opacity-0'
        } ${darkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-purple-50 to-indigo-50'}`}
        style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{dailyStats.meetings}</p>
              <p className="text-sm opacity-75">Meetings Today</p>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className={`p-4 rounded-xl transition-all duration-300 hover-lift ${
          isAnimated ? 'fade-in-up' : 'opacity-0'
        } ${darkMode ? 'bg-gradient-to-r from-green-900 to-emerald-900' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}
        style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{dailyStats.completedTasks}/{dailyStats.tasks}</p>
              <p className="text-sm opacity-75">Tasks Complete</p>
            </div>
          </div>
        </div>

        {/* Focus Time */}
        <div className={`p-4 rounded-xl transition-all duration-300 hover-lift ${
          isAnimated ? 'fade-in-up' : 'opacity-0'
        } ${darkMode ? 'bg-gradient-to-r from-orange-900 to-amber-900' : 'bg-gradient-to-r from-orange-50 to-amber-50'}`}
        style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{dailyStats.focusTime}</p>
              <p className="text-sm opacity-75">Focus Time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 3 Priority Tasks */}
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-slate-50 to-gray-50'
        }`}>
          <h3 className="font-semibold mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Top 3 Priority Tasks
          </h3>
          <div className="space-y-2">
            {topTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-slate-50 to-gray-50'
        }`}>
          <div className="flex items-start space-x-3">
            <Quote className="w-6 h-6 text-slate-500 mt-1" />
            <div>
              <p className="italic mb-2">"{motivationalQuote.text}"</p>
              <p className="text-sm opacity-75">— {motivationalQuote.author}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Wellness Indicator */}
      <div className={`mt-4 p-3 rounded-xl bg-gradient-to-r ${wellnessColors[emotionalWellness]} bg-opacity-20`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Today's Wellness Check</span>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${wellnessColors[emotionalWellness]} text-white text-sm font-medium`}>
            {emotionalWellness.charAt(0).toUpperCase() + emotionalWellness.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
};