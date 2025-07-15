import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, Moon, Brain, Target, Flame, Plus, Minus } from 'lucide-react';

interface WellnessData {
  hydration: number; // glasses of water
  sleep: number; // hours
  mindfulness: number; // minutes
}

interface WellnessTrackersProps {
  wellnessData: WellnessData;
  onUpdateWellness: (type: keyof WellnessData, value: number) => void;
}

const WellnessTrackers: React.FC<WellnessTrackersProps> = ({
  wellnessData,
  onUpdateWellness
}) => {
  const [mindfulnessTimer, setMindfulnessTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [goalStreak, setGoalStreak] = useState(7);

  // Mindfulness timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && mindfulnessTimer > 0) {
      interval = setInterval(() => {
        setMindfulnessTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            onUpdateWellness('mindfulness', wellnessData.mindfulness + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, mindfulnessTimer, wellnessData.mindfulness, onUpdateWellness]);

  const startMindfulnessTimer = (minutes: number) => {
    setMindfulnessTimer(minutes * 60);
    setIsTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHydrationProgress = () => (wellnessData.hydration / 8) * 100; // 8 glasses goal
  const getSleepProgress = () => (wellnessData.sleep / 8) * 100; // 8 hours goal
  const getMindfulnessProgress = () => (wellnessData.mindfulness / 20) * 100; // 20 minutes goal

  const getWellnessInsight = () => {
    const insights = [];
    
    if (wellnessData.hydration < 4) {
      insights.push('💧 Consider drinking more water');
    }
    if (wellnessData.sleep < 7) {
      insights.push('😴 Prioritize better sleep tonight');
    }
    if (wellnessData.mindfulness < 10) {
      insights.push('🧘 Take a mindfulness break');
    }
    if (wellnessData.hydration >= 8 && wellnessData.sleep >= 7 && wellnessData.mindfulness >= 20) {
      insights.push('🌟 Excellent wellness balance!');
    }

    return insights;
  };

  return (
    <div className="h-full bg-surface p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-poppins text-xl font-bold mb-2">Wellness Hub</h2>
        <p className="text-muted-foreground text-sm">Track your daily wellness goals</p>
      </div>

      {/* Hydration Tracker */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold">Hydration</h3>
            <p className="text-sm text-muted-foreground">{wellnessData.hydration}/8 glasses</p>
          </div>
        </div>
        
        <Progress value={getHydrationProgress()} className="mb-4" />
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateWellness('hydration', Math.max(0, wellnessData.hydration - 1))}
            disabled={wellnessData.hydration === 0}
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <div className="flex-1 grid grid-cols-4 gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`h-8 rounded transition-all duration-300 ${
                  i < wellnessData.hydration 
                    ? 'bg-blue-500 animate-pulse-glow' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateWellness('hydration', Math.min(8, wellnessData.hydration + 1))}
            disabled={wellnessData.hydration === 8}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </Card>

      {/* Sleep Tracker */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Moon className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold">Sleep Quality</h3>
            <p className="text-sm text-muted-foreground">{wellnessData.sleep}/8 hours</p>
          </div>
        </div>
        
        <Progress value={getSleepProgress()} className="mb-4" />
        
        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: 8 }, (_, i) => (
            <Moon
              key={i}
              className={`w-4 h-4 transition-all duration-300 ${
                i < wellnessData.sleep 
                  ? 'text-purple-500 animate-fade-in' 
                  : 'text-gray-300'
              }`}
              fill={i < wellnessData.sleep ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateWellness('sleep', Math.max(0, wellnessData.sleep - 0.5))}
            className="flex-1"
          >
            -30m
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateWellness('sleep', Math.min(8, wellnessData.sleep + 0.5))}
            className="flex-1"
          >
            +30m
          </Button>
        </div>
      </Card>

      {/* Mindfulness Tracker */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Brain className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold">Mindfulness</h3>
            <p className="text-sm text-muted-foreground">{wellnessData.mindfulness}/20 minutes</p>
          </div>
        </div>
        
        <Progress value={getMindfulnessProgress()} className="mb-4" />
        
        {isTimerActive ? (
          <div className="text-center">
            <div className="text-3xl font-poppins font-bold text-green-500 mb-3">
              {formatTime(mindfulnessTimer)}
            </div>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
            <Button
              variant="outline"
              onClick={() => setIsTimerActive(false)}
              className="w-full"
            >
              Stop Timer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => startMindfulnessTimer(1)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              1 min
            </Button>
            <Button
              size="sm"
              onClick={() => startMindfulnessTimer(5)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              5 min
            </Button>
            <Button
              size="sm"
              onClick={() => startMindfulnessTimer(10)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              10 min
            </Button>
            <Button
              size="sm"
              onClick={() => startMindfulnessTimer(15)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              15 min
            </Button>
          </div>
        )}
      </Card>

      {/* Goals & Habits */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold">Daily Goals</h3>
            <p className="text-sm text-muted-foreground">Streak: {goalStreak} days</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-accent/20 rounded">
            <span className="text-sm">💧 Stay hydrated</span>
            <Badge className={wellnessData.hydration >= 8 ? 'bg-success' : 'bg-muted'}>
              {wellnessData.hydration >= 8 ? '✓' : `${wellnessData.hydration}/8`}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-accent/20 rounded">
            <span className="text-sm">😴 Quality sleep</span>
            <Badge className={wellnessData.sleep >= 7 ? 'bg-success' : 'bg-muted'}>
              {wellnessData.sleep >= 7 ? '✓' : `${wellnessData.sleep}/8h`}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-accent/20 rounded">
            <span className="text-sm">🧘 Mindful moments</span>
            <Badge className={wellnessData.mindfulness >= 10 ? 'bg-success' : 'bg-muted'}>
              {wellnessData.mindfulness >= 10 ? '✓' : `${wellnessData.mindfulness}/20m`}
            </Badge>
          </div>
        </div>

        {goalStreak > 0 && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-500">
                {goalStreak} day streak!
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* AI Wellness Insights */}
      <Card className="glass-card p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-ai-primary" />
          Wellness Insights
        </h3>
        
        <div className="space-y-2">
          {getWellnessInsight().map((insight, index) => (
            <div key={index} className="text-sm p-2 bg-ai-primary/5 rounded text-ai-primary">
              {insight}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WellnessTrackers;