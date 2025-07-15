import React, { useState } from 'react';
import { Brain, Lightbulb, Calendar, Clock, Zap, Target, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface FocusSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'ai-suggested' | 'manual' | 'rescheduled';
  priority: 'high' | 'medium' | 'low';
  role?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'in-progress';
  aiSuggestion?: string;
  conflicts?: string[];
}

interface UserSettings {
  role: 'developer' | 'pm' | 'designer' | 'analyst' | 'manager';
  workHours: { start: string; end: string };
  preferredSessionLength: number;
  mode: 'proactive' | 'reactive' | 'flexible';
  autoDeclineMeetings: boolean;
  focusBehavior: 'aggressive' | 'flexible';
  weeklyGoal: number;
  monthlyGoal: number;
}

interface AISuggestion {
  id: string;
  type: 'schedule' | 'reschedule' | 'optimization' | 'conflict';
  title: string;
  description: string;
  confidence: number;
  action?: {
    label: string;
    sessionData?: Partial<FocusSession>;
  };
}

interface AISchedulerPanelProps {
  focusSessions: FocusSession[];
  userSettings: UserSettings;
  onScheduleSession: (session: Omit<FocusSession, 'id'>) => void;
  onUpdateSession: (sessionId: string, updates: Partial<FocusSession>) => void;
  expanded?: boolean;
}

const AISchedulerPanel: React.FC<AISchedulerPanelProps> = ({
  focusSessions,
  userSettings,
  onScheduleSession,
  onUpdateSession,
  expanded = false
}) => {
  const [aiSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      type: 'schedule',
      title: 'Optimal Focus Window Detected',
      description: 'Tuesday 9-11 AM shows 40% higher completion rates for developers',
      confidence: 85,
      action: {
        label: 'Schedule Now',
        sessionData: {
          title: 'Deep Work Block',
          startTime: '09:00',
          endTime: '11:00',
          date: '2024-01-16',
          type: 'ai-suggested',
          priority: 'high',
          status: 'scheduled'
        }
      }
    },
    {
      id: '2',
      type: 'conflict',
      title: 'Meeting Conflict Detected',
      description: 'Your 2 PM focus session conflicts with "Team Standup"',
      confidence: 95,
      action: {
        label: 'Reschedule to 3 PM'
      }
    },
    {
      id: '3',
      type: 'optimization',
      title: 'Session Length Optimization',
      description: 'Based on your role, 90-min sessions show better results than 60-min',
      confidence: 72,
      action: {
        label: 'Update Preferences'
      }
    }
  ]);

  const todayProgress = Math.round((focusSessions.filter(s => s.status === 'completed').length / Math.max(focusSessions.length, 1)) * 100);
  const weeklyHours = 16; // Mock data
  const weeklyGoal = userSettings.weeklyGoal;

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    if (suggestion.action?.sessionData) {
      onScheduleSession(suggestion.action.sessionData as Omit<FocusSession, 'id'>);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'reschedule':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'optimization':
        return <Zap className="h-4 w-4 text-purple-500" />;
      case 'conflict':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* AI Assistant Header */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Scheduler Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {userSettings.mode === 'proactive' ? 'Proactive Mode' : 
               userSettings.mode === 'reactive' ? 'Reactive Mode' : 'Flexible Mode'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="text-lg font-bold text-primary">{todayProgress}%</div>
            <div className="text-xs text-muted-foreground">Today's Progress</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="text-lg font-bold text-purple-600">{weeklyHours}h</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>
      </Card>

      {/* Weekly Goal Progress */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-medium">Weekly Goal</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{weeklyHours}h / {weeklyGoal}h</span>
            <span className={getConfidenceColor((weeklyHours / weeklyGoal) * 100)}>
              {Math.round((weeklyHours / weeklyGoal) * 100)}%
            </span>
          </div>
          <Progress value={(weeklyHours / weeklyGoal) * 100} className="h-2" />
        </div>
      </Card>

      {/* AI Suggestions */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">AI Suggestions</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {aiSuggestions.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {aiSuggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <div className="p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/30 transition-colors">
                <div className="flex items-start gap-3">
                  {getTypeIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{suggestion.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                      >
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.action && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => handleAcceptSuggestion(suggestion)}
                        >
                          {suggestion.action.label}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {index < aiSuggestions.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      {expanded && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Daily Focus Block
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Reschedule Conflicted Sessions
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Optimize Schedule for Tomorrow
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Target className="h-4 w-4 mr-2" />
              Update Weekly Goals
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AISchedulerPanel;