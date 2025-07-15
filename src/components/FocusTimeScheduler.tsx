import React, { useState } from 'react';
import { Calendar, Brain, Settings, BarChart3, Users, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FocusTimeCalendar from './focus-time/FocusTimeCalendar';
import AISchedulerPanel from './focus-time/AISchedulerPanel';
import FocusSettingsModal from './focus-time/FocusSettingsModal';
import GoalsAnalyticsDashboard from './focus-time/GoalsAnalyticsDashboard';
import TeamTemplatesBrowser from './focus-time/TeamTemplatesBrowser';

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

const FocusTimeScheduler: React.FC = () => {
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([
    {
      id: '1',
      title: 'Deep Work - Code Review',
      startTime: '09:00',
      endTime: '11:00',
      date: '2024-01-15',
      type: 'ai-suggested',
      priority: 'high',
      role: 'developer',
      status: 'scheduled',
      aiSuggestion: 'Optimal time based on your productivity patterns',
      conflicts: []
    },
    {
      id: '2',
      title: 'Strategic Planning Session',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-01-15',
      type: 'manual',
      priority: 'medium',
      status: 'scheduled'
    }
  ]);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    role: 'developer',
    workHours: { start: '09:00', end: '17:00' },
    preferredSessionLength: 90,
    mode: 'proactive',
    autoDeclineMeetings: true,
    focusBehavior: 'flexible',
    weeklyGoal: 20,
    monthlyGoal: 80
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      message: 'AI moved your focus session to 3pm to avoid conflict with team standup',
      timestamp: '10 min ago'
    }
  ]);

  const updateFocusSession = (sessionId: string, updates: Partial<FocusSession>) => {
    setFocusSessions(prev => 
      prev.map(session => 
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  };

  const addFocusSession = (newSession: Omit<FocusSession, 'id'>) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      ...newSession
    };
    setFocusSessions(prev => [...prev, session]);
  };

  const weeklyProgress = 16; // Current week progress
  const monthlyProgress = 65; // Current month progress

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Focus Time Scheduler</h1>
                <p className="text-sm text-muted-foreground">Intelligent focus planning for maximum productivity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Progress Indicators */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Week:</span>
                  <Badge variant="secondary">{weeklyProgress}/{userSettings.weeklyGoal}h</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Month:</span>
                  <Badge variant="secondary">{monthlyProgress}/{userSettings.monthlyGoal}h</Badge>
                </div>
              </div>

              {/* Settings */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Calendar */}
              <div className="lg:col-span-2">
                <FocusTimeCalendar
                  focusSessions={focusSessions}
                  userSettings={userSettings}
                  onUpdateSession={updateFocusSession}
                  onAddSession={addFocusSession}
                />
              </div>

              {/* AI Assistant Panel */}
              <div className="lg:col-span-1">
                <AISchedulerPanel
                  focusSessions={focusSessions}
                  userSettings={userSettings}
                  onScheduleSession={addFocusSession}
                  onUpdateSession={updateFocusSession}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <GoalsAnalyticsDashboard
              focusSessions={focusSessions}
              userSettings={userSettings}
              weeklyProgress={weeklyProgress}
              monthlyProgress={monthlyProgress}
            />
          </TabsContent>

          <TabsContent value="templates">
            <TeamTemplatesBrowser
              userSettings={userSettings}
              onApplyTemplate={(template) => {
                // Apply template logic
                console.log('Applying template:', template);
              }}
            />
          </TabsContent>

          <TabsContent value="assistant">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AISchedulerPanel
                focusSessions={focusSessions}
                userSettings={userSettings}
                onScheduleSession={addFocusSession}
                onUpdateSession={updateFocusSession}
                expanded={true}
              />
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-muted-foreground">
                      Based on your productivity patterns, mornings (9-11 AM) show 40% higher focus completion rates.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/50 border border-accent">
                    <p className="text-sm text-muted-foreground">
                      Consider blocking Tuesday/Thursday 2-4 PM for deep work - historically your least interrupted times.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Modal */}
      <FocusSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onUpdateSettings={setUserSettings}
      />
    </div>
  );
};

export default FocusTimeScheduler;