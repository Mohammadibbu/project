import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle2, 
  Plus,
  Sync,
  Focus,
  BarChart3,
  Settings,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Users,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Coffee
} from 'lucide-react';
import { toast } from 'sonner';
import IntegrationPanel from './IntegrationPanel';
import TaskManager from './TaskManager';
import ScheduleOptimizer from './ScheduleOptimizer';
import FocusMode from './FocusMode';
import ProductivityAnalytics from './ProductivityAnalytics';
import AIAssistant from './AIAssistant';

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

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  taskCount?: number;
  eventCount?: number;
}

const MainDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'google', name: 'Google Calendar', connected: false },
    { id: 'outlook', name: 'Microsoft Outlook', connected: false },
    { id: 'todoist', name: 'Todoist', connected: false },
    { id: 'asana', name: 'Asana', connected: false },
  ]);
  
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [currentFocusTask, setCurrentFocusTask] = useState<Task | null>(null);
  const [focusTimer, setFocusTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const [weeklyGoal, setWeeklyGoal] = useState(40); // hours
  const [weeklyProgress, setWeeklyProgress] = useState(28);
  const [productivityScore, setProductivityScore] = useState(85);

  // Sample data initialization
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Complete quarterly report',
        description: 'Analyze Q4 performance metrics and prepare presentation',
        priority: 'urgent',
        category: 'work',
        deadline: '2024-01-20',
        estimatedDuration: 120,
        completed: false,
        source: 'manual',
        aiSuggestion: 'Best completed during your peak focus hours (9-11 AM)',
        tags: ['report', 'quarterly', 'urgent']
      },
      {
        id: '2',
        title: 'Review code submissions',
        description: 'Review pull requests from team members',
        priority: 'important',
        category: 'work',
        estimatedDuration: 60,
        completed: false,
        source: 'asana',
        aiSuggestion: 'Schedule after morning standup for better context',
        tags: ['code-review', 'team']
      },
      {
        id: '3',
        title: 'Workout session',
        description: 'Cardio and strength training',
        priority: 'important',
        category: 'health',
        estimatedDuration: 60,
        completed: true,
        source: 'manual',
        tags: ['health', 'exercise']
      },
      {
        id: '4',
        title: 'Plan weekend trip',
        description: 'Research destinations and book accommodations',
        priority: 'low',
        category: 'personal',
        estimatedDuration: 45,
        completed: false,
        source: 'todoist',
        tags: ['travel', 'personal']
      }
    ];

    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Standup',
        startTime: '09:00',
        endTime: '09:30',
        date: '2024-01-15',
        source: 'google',
        type: 'meeting'
      },
      {
        id: '2',
        title: 'Deep Work Block',
        startTime: '10:00',
        endTime: '12:00',
        date: '2024-01-15',
        source: 'manual',
        type: 'focus'
      },
      {
        id: '3',
        title: 'Client Meeting',
        startTime: '14:00',
        endTime: '15:00',
        date: '2024-01-15',
        source: 'outlook',
        type: 'meeting'
      }
    ];

    setTasks(sampleTasks);
    setEvents(sampleEvents);
  }, []);

  // Timer effect for focus mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer(prev => prev - 1);
      }, 1000);
    } else if (focusTimer === 0) {
      setIsTimerRunning(false);
      toast.success('Focus session completed! 🎉', {
        description: 'Great job! Time for a well-deserved break.'
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTimer]);

  const handleConnectCalendar = async (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, connected: true, lastSync: new Date().toISOString() }
        : int
    ));
    
    toast.success(`${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)} connected successfully!`, {
      description: 'Your calendar and tasks will now sync automatically.'
    });
  };

  const handleSyncTasks = async () => {
    setIsSyncing(true);
    
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update integration stats
    setIntegrations(prev => prev.map(int => ({
      ...int,
      lastSync: int.connected ? new Date().toISOString() : int.lastSync,
      taskCount: int.connected ? Math.floor(Math.random() * 20) + 5 : int.taskCount,
      eventCount: int.connected ? Math.floor(Math.random() * 15) + 3 : int.eventCount
    })));
    
    setIsSyncing(false);
    toast.success('Tasks synced successfully!', {
      description: 'All your tasks and events are now up to date.'
    });
  };

  const handleGenerateSchedule = async () => {
    setIsGeneratingSchedule(true);
    
    // Simulate AI schedule generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGeneratingSchedule(false);
    toast.success('Daily schedule generated!', {
      description: 'AI has optimized your schedule based on priorities and availability.'
    });
  };

  const handlePrioritizeTasks = () => {
    const prioritizedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { urgent: 3, important: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    setTasks(prioritizedTasks);
    toast.success('Tasks prioritized!', {
      description: 'AI has reordered your tasks based on urgency and importance.'
    });
  };

  const handleRescheduleTasks = () => {
    toast.success('Tasks rescheduled!', {
      description: 'AI has adjusted your schedule to accommodate calendar changes.'
    });
  };

  const handleStartFocusMode = (task?: Task) => {
    setFocusModeActive(true);
    setCurrentFocusTask(task || tasks.find(t => !t.completed) || null);
    setFocusTimer(25 * 60); // Reset to 25 minutes
    setIsTimerRunning(true);
    
    toast.success('Focus mode activated!', {
      description: 'Distractions blocked. Time to get things done!'
    });
  };

  const handleStopFocusMode = () => {
    setFocusModeActive(false);
    setCurrentFocusTask(null);
    setIsTimerRunning(false);
    setFocusTimer(25 * 60);
    
    toast.info('Focus mode deactivated', {
      description: 'You can resume focus mode anytime.'
    });
  };

  const handleCreateTimeBlocks = () => {
    toast.success('Time blocks created!', {
      description: 'AI has scheduled optimal work blocks and break times.'
    });
  };

  const handleOptimizeWeek = () => {
    toast.success('Week optimized!', {
      description: 'AI has analyzed your schedule and suggested improvements.'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && !t.completed).length;
  const connectedIntegrations = integrations.filter(i => i.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">AI Task Manager</h1>
              <p className="text-muted-foreground">
                Smart scheduling • Intelligent prioritization • Seamless integration
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSyncTasks} 
                disabled={isSyncing}
                className="hover-glow"
              >
                <Sync className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync All'}
              </Button>
              
              <Button 
                onClick={handleGenerateSchedule}
                disabled={isGeneratingSchedule}
                className="hover-glow"
              >
                <Brain className={`h-4 w-4 mr-2 ${isGeneratingSchedule ? 'animate-pulse' : ''}`} />
                {isGeneratingSchedule ? 'Generating...' : 'Generate Schedule'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Task Completion</p>
                <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <Progress value={completionRate} className="mt-4" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </Card>

          <Card className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent Tasks</p>
                <p className="text-3xl font-bold text-danger">{urgentTasks}</p>
              </div>
              <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Require immediate attention
            </p>
          </Card>

          <Card className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Progress</p>
                <p className="text-3xl font-bold text-primary">{weeklyProgress}h</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Progress value={(weeklyProgress / weeklyGoal) * 100} className="mt-4" />
            <p className="text-xs text-muted-foreground mt-2">
              Goal: {weeklyGoal}h this week
            </p>
          </Card>

          <Card className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Integrations</p>
                <p className="text-3xl font-bold text-focus">{connectedIntegrations}</p>
              </div>
              <div className="w-12 h-12 bg-focus/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-focus" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Connected platforms
            </p>
          </Card>
        </div>

        {/* Focus Mode Banner */}
        {focusModeActive && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-focus/10 to-primary/10 border-focus/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-focus rounded-full flex items-center justify-center">
                  <Focus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-focus">Focus Mode Active</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentFocusTask ? `Working on: ${currentFocusTask.title}` : 'Deep work session in progress'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-focus">{formatTime(focusTimer)}</div>
                  <div className="text-xs text-muted-foreground">Time remaining</div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFocusTimer(25 * 60)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleStopFocusMode}
                  >
                    Stop Focus
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="p-6 mb-8 ai-suggestion">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-ai-primary to-ai-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ai-primary mb-3">AI Productivity Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    🎯 <strong>Peak Performance:</strong> Your productivity is highest between 9-11 AM. 
                    Schedule important tasks during this window.
                  </p>
                  <p className="text-muted-foreground">
                    ⚡ <strong>Task Batching:</strong> Group similar tasks together to reduce context switching by 40%.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    📅 <strong>Schedule Gap:</strong> You have a 2-hour window at 2 PM perfect for deep work.
                  </p>
                  <p className="text-muted-foreground">
                    🔔 <strong>Break Reminder:</strong> Take a 15-minute break after your next focus session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Button 
            onClick={handlePrioritizeTasks}
            className="h-20 flex-col gap-2 hover-glow"
            variant="outline"
          >
            <Target className="h-5 w-5" />
            <span className="text-xs">Prioritize Tasks</span>
          </Button>
          
          <Button 
            onClick={handleRescheduleTasks}
            className="h-20 flex-col gap-2 hover-glow"
            variant="outline"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Reschedule Tasks</span>
          </Button>
          
          <Button 
            onClick={() => handleStartFocusMode()}
            className="h-20 flex-col gap-2 hover-glow"
            variant="outline"
            disabled={focusModeActive}
          >
            <Focus className="h-5 w-5" />
            <span className="text-xs">Start Focus Mode</span>
          </Button>
          
          <Button 
            onClick={handleCreateTimeBlocks}
            className="h-20 flex-col gap-2 hover-glow"
            variant="outline"
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs">Create Time Blocks</span>
          </Button>
          
          <Button 
            onClick={handleOptimizeWeek}
            className="h-20 flex-col gap-2 hover-glow"
            variant="outline"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Optimize Week</span>
          </Button>
          
          <Button 
            className="h-20 flex-col gap-2 hover-glow"
            variant="outline"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">View Report</span>
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 glass-card">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskManager 
              tasks={tasks} 
              setTasks={setTasks}
              onStartFocus={handleStartFocusMode}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleOptimizer 
              tasks={tasks}
              events={events}
              setEvents={setEvents}
            />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationPanel 
              integrations={integrations}
              onConnect={handleConnectCalendar}
              onSync={handleSyncTasks}
              isSyncing={isSyncing}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <ProductivityAnalytics 
              tasks={tasks}
              weeklyProgress={weeklyProgress}
              weeklyGoal={weeklyGoal}
              productivityScore={productivityScore}
            />
          </TabsContent>

          <TabsContent value="assistant">
            <AIAssistant 
              tasks={tasks}
              events={events}
              onSuggestTask={(task) => setTasks(prev => [...prev, task])}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MainDashboard;