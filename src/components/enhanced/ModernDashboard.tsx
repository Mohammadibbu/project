import React, { useState, useEffect } from 'react';
import { Calendar, Brain, BarChart3, Settings, Bell, Search, Filter, Plus } from 'lucide-react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccessibleTaskCard from './AccessibleTaskCard';

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
          title: 'Team Standup Meeting',
          category: 'meeting',
          priority: 'high',
          startTime: '09:00',
          endTime: '09:30',
          completed: false,
          description: 'Daily team sync and planning session',
          aiSuggestion: 'Consider preparing agenda items beforehand'
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
          aiSuggestion: 'Peak productivity time detected - minimize distractions'
        },
        {
          id: '3',
          title: 'Lunch & Walk',
          category: 'health',
          priority: 'medium',
          startTime: '12:30',
          endTime: '13:30',
          completed: true,
          description: 'Healthy break and movement'
        },
        {
          id: '4',
          title: 'Client Presentation',
          category: 'work',
          priority: 'high',
          startTime: '14:00',
          endTime: '15:00',
          completed: false,
          description: 'Project review and feedback session'
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
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task);
    // Implement edit functionality
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
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

  const isTaskOverdue = (task: Task) => {
    const now = new Date();
    const [hours, minutes] = task.endTime.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
    return !task.completed && now > taskTime;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Smart Calendar</h1>
                  <p className="text-sm text-muted-foreground">AI-powered productivity assistant</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                  aria-label="Search tasks"
                />
              </div>

              {/* Notifications */}
              <AccessibleButton variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <StatusBadge 
                    variant="danger" 
                    size="sm"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {notifications}
                  </StatusBadge>
                )}
                <span className="sr-only">{notifications} notifications</span>
              </AccessibleButton>

              {/* Settings */}
              <AccessibleButton variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </AccessibleButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <InteractiveCard className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </InteractiveCard>
          
          <InteractiveCard className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{completedTasks.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </InteractiveCard>
          
          <InteractiveCard className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">{pendingTasks.length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </InteractiveCard>
          
          <InteractiveCard className="p-6 text-center">
            <div className="text-3xl font-bold text-danger mb-2">{highPriorityTasks.length}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </InteractiveCard>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          <div className="flex gap-2">
            {['all', 'work', 'personal', 'health', 'focus', 'meeting'].map((category) => (
              <AccessibleButton
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </AccessibleButton>
            ))}
          </div>
        </div>

        {/* Tasks Content */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <InteractiveCard key={i} className="p-4">
                    <LoadingSkeleton avatar lines={2} button />
                  </InteractiveCard>
                ))}
              </div>
            ) : pendingTasks.length === 0 ? (
              <InteractiveCard className="p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground mb-4">No pending tasks found.</p>
                <AccessibleButton>
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
                  <InteractiveCard key={i} className="p-4">
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