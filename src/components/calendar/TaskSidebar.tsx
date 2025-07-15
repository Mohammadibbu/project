import React, { useState } from 'react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, CheckCircle2, Circle, Plus } from 'lucide-react';
import AccessibleTaskCard from '@/components/enhanced/AccessibleTaskCard';

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

interface TaskSidebarProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ tasks, onUpdateTask }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  const handleCompleteTask = (taskId: string, completed: boolean) => {
    onUpdateTask(taskId, { completed });
  };

  const isTaskOverdue = (task: Task) => {
    const now = new Date();
    const [hours, minutes] = task.endTime.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
    return !task.completed && now > taskTime;
  };

  return (
    <div className="h-full bg-surface border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Task Management</h2>
          <AccessibleButton size="icon-sm" aria-label="Add new task">
            <Plus className="w-4 h-4" />
          </AccessibleButton>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search tasks"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="focus">Deep Focus</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-2">
          <InteractiveCard className="p-3 text-center">
            <div className="font-bold text-lg text-primary">{tasks.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </InteractiveCard>
          <InteractiveCard className="p-3 text-center">
            <div className="font-bold text-lg text-success">{completedTasks.length}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </InteractiveCard>
          <InteractiveCard className="p-3 text-center">
            <div className="font-bold text-lg text-warning">{pendingTasks.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </InteractiveCard>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Pending Tasks */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Pending Tasks ({pendingTasks.length})
          </h3>
          
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <AccessibleTaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleCompleteTask}
                isOverdue={isTaskOverdue(task)}
                className="text-sm"
              />
            ))}
            
            {pendingTasks.length === 0 && (
              <InteractiveCard className="p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-sm text-muted-foreground">No pending tasks!</p>
              </InteractiveCard>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="p-4 border-t border-border">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Completed Tasks ({completedTasks.length})
            </h3>
            
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <AccessibleTaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleCompleteTask}
                  className="text-sm opacity-75"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSidebar;