import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Flag, 
  Tag, 
  Brain, 
  Focus,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

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

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onStartFocus: (task: Task) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks, onStartFocus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'important' as Task['priority'],
    category: 'work' as Task['category'],
    deadline: '',
    estimatedDuration: 60,
    tags: [] as string[]
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesCompleted = showCompleted || !task.completed;
    
    return matchesSearch && matchesPriority && matchesCategory && matchesCompleted;
  });

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast.success('Task completed! 🎉', {
        description: `Great job completing "${task.title}"`
      });
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      deadline: newTask.deadline || undefined,
      estimatedDuration: newTask.estimatedDuration,
      completed: false,
      source: 'manual',
      tags: newTask.tags,
      aiSuggestion: generateAISuggestion(newTask)
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'important',
      category: 'work',
      deadline: '',
      estimatedDuration: 60,
      tags: []
    });
    setIsAddingTask(false);
    
    toast.success('Task added successfully!', {
      description: 'AI has analyzed your task and provided optimization suggestions.'
    });
  };

  const generateAISuggestion = (task: typeof newTask): string => {
    const suggestions = [
      'Best completed during your peak focus hours (9-11 AM)',
      'Consider breaking this into smaller subtasks',
      'Schedule after your morning routine for better focus',
      'Pair with similar tasks to reduce context switching',
      'Block distractions and use focus mode for this task'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  };

  const handleTagTasks = () => {
    // AI-powered task tagging
    setTasks(prev => prev.map(task => {
      const aiTags = [];
      if (task.title.toLowerCase().includes('meeting')) aiTags.push('meeting');
      if (task.title.toLowerCase().includes('report')) aiTags.push('report');
      if (task.priority === 'urgent') aiTags.push('urgent');
      if (task.estimatedDuration > 120) aiTags.push('long-task');
      
      return { ...task, tags: [...new Set([...task.tags, ...aiTags])] };
    }));
    
    toast.success('Tasks tagged automatically!', {
      description: 'AI has analyzed and categorized your tasks.'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'important': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '🏠';
      case 'health': return '❤️';
      case 'focus': return '🎯';
      case 'meeting': return '👥';
      default: return '📋';
    }
  };

  const getSourceBadge = (source: string) => {
    const colors = {
      manual: 'bg-blue-500/10 text-blue-700',
      todoist: 'bg-red-500/10 text-red-700',
      asana: 'bg-pink-500/10 text-pink-700',
      google: 'bg-green-500/10 text-green-700',
      outlook: 'bg-blue-600/10 text-blue-700'
    };
    return colors[source as keyof typeof colors] || colors.manual;
  };

  const urgentTasks = filteredTasks.filter(t => t.priority === 'urgent' && !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);
  const pendingTasks = filteredTasks.filter(t => !t.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">
            AI-powered task prioritization and smart scheduling
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleTagTasks} variant="outline" className="hover-glow">
            <Tag className="h-4 w-4 mr-2" />
            Tag Tasks
          </Button>
          
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="hover-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add details..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newTask.category} onValueChange={(value: Task['category']) => setNewTask(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="focus">Focus</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Deadline</label>
                    <Input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Duration (min)</label>
                    <Input
                      type="number"
                      value={newTask.estimatedDuration}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 60 }))}
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddTask} className="flex-1">
                    <Brain className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="focus">Focus</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <label htmlFor="show-completed" className="text-sm">
                Show completed
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
              <p className="text-2xl font-bold">{pendingTasks.length}</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Urgent Tasks</p>
              <p className="text-2xl font-bold text-red-600">{urgentTasks.length}</p>
            </div>
            <Flag className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </Badge>
          </div>
        </Card>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first task to get started'}
            </p>
            <Button onClick={() => setIsAddingTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={`p-4 hover-glow transition-all ${task.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleComplete(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getSourceBadge(task.source)}>
                        {task.source}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.estimatedDuration} min
                    </div>
                    
                    {task.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {task.aiSuggestion && (
                    <div className="ai-suggestion text-xs p-2 rounded-md">
                      <div className="flex items-center gap-1 mb-1">
                        <Brain className="h-3 w-3 text-ai-primary" />
                        <span className="font-medium text-ai-primary">AI Suggestion</span>
                      </div>
                      <p className="text-ai-primary/80">{task.aiSuggestion}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {!task.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStartFocus(task)}
                      className="hover-glow"
                    >
                      <Focus className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;