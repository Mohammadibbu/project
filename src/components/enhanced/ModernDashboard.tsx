import React, { useState, useEffect } from 'react';
import { Calendar, Brain, BarChart3, Settings, Bell, Search, Filter, Plus, Zap, Target, Clock, CheckCircle2 } from 'lucide-react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AccessibleTaskCard from './AccessibleTaskCard';
import { toast } from 'sonner';

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

const ModernDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notifications, setNotifications] = useState(3);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks([
        {
          id: '1',
          title: 'Review quarterly performance metrics',
          category: 'work',
          priority: 'high',
          startTime: '09:00',
          endTime: '10:30',
          completed: false,
          description: 'Analyze Q4 performance data and prepare insights for leadership team',
          aiSuggestion: 'Best completed during your peak focus hours (9-11 AM)'
        },
        {
          id: '2',
          title: 'Deep work: Product feature development',
          category: 'focus',
          priority: 'high',
          startTime: '10:30',
          endTime: '12:30',
          completed: false,
          description: 'Implement user authentication system for the new dashboard',
          aiSuggestion: 'Block distractions and use focus mode for maximum productivity'
        },
        {
          id: '3',
          title: 'Team standup meeting',
          category: 'meeting',
          priority: 'medium',
          startTime: '13:00',
          endTime: '13:30',
          completed: true,
          description: 'Daily sync with development team'
        },
        {
          id: '4',
          title: 'Workout session',
          category: 'health',
          priority: 'medium',
          startTime: '18:00',
          endTime: '19:00',
          completed: false,
          description: 'Cardio and strength training at the gym'
        },
        {
          id: '5',
          title: 'Plan weekend trip',
          category: 'personal',
          priority: 'low',
          startTime: '20:00',
          endTime: '20:30',
          completed: false,
          description: 'Research destinations and book accommodations'
        }
      ]);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
    
    if (completed) {
      toast.success('Task completed! 🎉', {
        description: 'Great job staying productive!'
      });
    }
  };

  const handleEditTask = (task: Task) => {
    toast.info('Edit functionality coming soon!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  const todayProgress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const isTaskOverdue = (task: Task) => {
    const now = new Date();
    const [hours, minutes] = task.endTime.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
    return !task.completed && now > taskTime;
  };

  const categoryStats = {
    work: tasks.filter(t => t.category === 'work').length,
    personal: tasks.filter(t => t.category === 'personal').length,
    health: tasks.filter(t => t.category === 'health').length,
    focus: tasks.filter(t => t.category === 'focus').length,
    meeting: tasks.filter(t => t.category === 'meeting').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Enhanced Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Good morning, John! 👋</h1>
              <p className="text-muted-foreground">
                You have {pendingTasks.length} tasks pending and {highPriorityTasks.length} high priority items today.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 glass-card"
                  aria-label="Search tasks"
                />
              </div>

              <AccessibleButton className="hover-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </AccessibleButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InteractiveCard className="p-6 hover-glow" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={todayProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{todayProgress}% completed today</p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard className="p-6 hover-glow" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success">{completedTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              +{Math.round(Math.random() * 20)}% from yesterday
            </p>
          </InteractiveCard>
          
          <InteractiveCard className="p-6 hover-glow" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {highPriorityTasks.length} high priority
            </p>
          </InteractiveCard>
          
          <InteractiveCard className="p-6 hover-glow" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Focus Time</p>
                <p className="text-3xl font-bold text-focus">4.2h</p>
              </div>
              <div className="w-12 h-12 bg-focus/10 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-focus" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Peak: 10:00 - 12:00 AM
            </p>
          </InteractiveCard>
        </div>

        {/* AI Insights Panel */}
        <InteractiveCard className="p-6 mb-8 ai-suggestion">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-ai-primary to-ai-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ai-primary mb-2">AI Productivity Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    🎯 <strong>Optimal Focus Window:</strong> Your productivity peaks between 9-11 AM. 
                    Consider scheduling deep work during this time.
                  </p>
                  <p className="text-muted-foreground">
                    ⚡ <strong>Task Batching:</strong> Group similar tasks together to reduce context switching.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    📅 <strong>Schedule Optimization:</strong> Move your workout to 6 PM for better energy levels.
                  </p>
                  <p className="text-muted-foreground">
                    🔔 <strong>Break Reminder:</strong> Take a 15-minute break after your next focus session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </InteractiveCard>

        {/* Category Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['all', 'work', 'personal', 'health', 'focus', 'meeting'].map((category) => (
              <AccessibleButton
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className="capitalize"
              >
                {category === 'all' ? 'All' : category}
                {category !== 'all' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {categoryStats[category as keyof typeof categoryStats]}
                  </Badge>
                )}
              </AccessibleButton>
            ))}
          </div>
        </div>

        {/* Tasks Content */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 glass-card">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <InteractiveCard key={i} className="p-6">
                    <LoadingSkeleton avatar lines={2} button />
                  </InteractiveCard>
                ))}
              </div>
            ) : pendingTasks.length === 0 ? (
              <InteractiveCard className="p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground mb-4">No pending tasks found.</p>
                <AccessibleButton className="hover-glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Task
                </AccessibleButton>
              </InteractiveCard>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <AccessibleTaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    isOverdue={isTaskOverdue(task)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <InteractiveCard key={i} className="p-6">
                    <LoadingSkeleton avatar lines={2} />
                  </InteractiveCard>
                ))}
              </div>
            ) : completedTasks.length === 0 ? (
              <InteractiveCard className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No completed tasks yet</h3>
                <p className="text-muted-foreground">Complete some tasks to see them here.</p>
              </InteractiveCard>
            ) : (
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <AccessibleTaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button */}
      <AccessibleButton className="floating-action" aria-label="Add new task">
        <Plus className="h-6 w-6" />
      </AccessibleButton>
    </div>
  );
};

export default ModernDashboard;