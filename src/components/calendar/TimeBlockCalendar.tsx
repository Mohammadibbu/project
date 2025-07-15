import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, Lightbulb } from 'lucide-react';

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

interface TimeBlockCalendarProps {
  tasks: Task[];
  currentTime: string;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const TimeBlockCalendar: React.FC<TimeBlockCalendarProps> = ({
  tasks,
  currentTime,
  onUpdateTask,
  onAddTask
}) => {
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    category: 'work' as Task['category'],
    priority: 'medium' as Task['priority'],
    duration: 60
  });
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 5; // 5AM to 11PM
    return hour.toString().padStart(2, '0') + ':00';
  });

  const getCurrentTimePosition = () => {
    if (!currentTime) return 0;
    const [hours, minutes] = currentTime.split(':').map(Number);
    const startHour = 5; // 5AM start
    const position = ((hours - startHour) * 60 + minutes) / 60;
    return Math.max(0, position * 80); // 80px per hour
  };

  const getTasksForHour = (hour: string) => {
    return tasks.filter(task => {
      const taskHour = task.startTime.split(':')[0].padStart(2, '0') + ':00';
      return taskHour === hour;
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-primary text-primary-foreground',
      personal: 'bg-success text-success-foreground',
      health: 'bg-danger text-danger-foreground',
      focus: 'bg-focus text-focus-foreground',
      meeting: 'bg-warning text-warning-foreground'
    };
    return colors[category as keyof typeof colors] || 'bg-primary text-primary-foreground';
  };

  const getPriorityIndicator = (priority: string) => {
    const indicators = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return indicators[priority as keyof typeof indicators] || '🟡';
  };

  const handleAddTask = () => {
    if (!newTaskData.title || !selectedHour) return;

    const startTime = selectedHour;
    const endHour = (parseInt(selectedHour.split(':')[0]) + Math.floor(newTaskData.duration / 60)).toString().padStart(2, '0');
    const endMinutes = (newTaskData.duration % 60).toString().padStart(2, '0');
    const endTime = `${endHour}:${endMinutes}`;

    onAddTask({
      ...newTaskData,
      startTime,
      endTime,
      completed: false,
      description: `${newTaskData.duration} minute ${newTaskData.category} session`
    });

    setNewTaskData({
      title: '',
      category: 'work',
      priority: 'medium',
      duration: 60
    });
    setSelectedHour('');
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (targetHour: string) => {
    if (!draggedTask) return;

    const duration = calculateTaskDuration(draggedTask.startTime, draggedTask.endTime);
    const endHour = (parseInt(targetHour.split(':')[0]) + Math.floor(duration / 60)).toString().padStart(2, '0');
    const endMinutes = (duration % 60).toString().padStart(2, '0');
    const endTime = `${endHour}:${endMinutes}`;

    onUpdateTask(draggedTask.id, {
      startTime: targetHour,
      endTime
    });
  };

  const calculateTaskDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return (endHour - startHour) * 60 + (endMin - startMin);
  };

  const getAISuggestions = (hour: string) => {
    const hourNum = parseInt(hour.split(':')[0]);
    const suggestions = [];

    if (hourNum >= 10 && hourNum <= 12) {
      suggestions.push('🧠 Peak focus time - Perfect for deep work');
    }
    if (hourNum >= 14 && hourNum <= 16) {
      suggestions.push('🤝 Great for meetings and collaboration');
    }
    if (hourNum >= 18 && hourNum <= 20) {
      suggestions.push('💪 Ideal for personal projects or exercise');
    }
    if (getTasksForHour(hour).length === 0) {
      suggestions.push('📅 Free slot - Consider scheduling a break');
    }

    return suggestions;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Task */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-poppins text-2xl font-bold">Time Block Calendar</h2>
          <p className="text-muted-foreground">Drag and drop tasks to reschedule</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 hover-glow">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle className="font-poppins">Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTaskData.title}
                onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select value={selectedHour} onValueChange={setSelectedHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(hour => (
                      <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newTaskData.duration.toString()} onValueChange={(value) => setNewTaskData(prev => ({ ...prev, duration: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select value={newTaskData.category} onValueChange={(value: Task['category']) => setNewTaskData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="focus">Deep Focus</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={newTaskData.priority} onValueChange={(value: Task['priority']) => setNewTaskData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <Card className="glass-card p-6 relative">
        <div ref={calendarRef} className="relative">
          {/* Current Time Indicator */}
          <div 
            className="absolute left-0 w-full z-20 time-indicator"
            style={{ top: `${getCurrentTimePosition()}px` }}
          >
            <div className="flex items-center">
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {currentTime}
              </Badge>
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            {hours.map((hour) => {
              const hourTasks = getTasksForHour(hour);
              const aiSuggestions = getAISuggestions(hour);
              
              return (
                <div
                  key={hour}
                  className="min-h-[80px] border border-border/30 rounded-lg p-3 transition-all duration-200 hover:bg-accent/20"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(hour)}
                >
                  <div className="flex items-start gap-4">
                    {/* Time Label */}
                    <div className="w-16 text-center">
                      <div className="font-medium text-sm">{hour}</div>
                      <Clock className="w-3 h-3 mx-auto mt-1 text-muted-foreground" />
                    </div>

                    {/* Tasks */}
                    <div className="flex-1 space-y-2">
                      {hourTasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={() => handleDragStart(task)}
                          onDragEnd={handleDragEnd}
                          className={`${getCategoryColor(task.category)} p-3 rounded-lg cursor-move transition-all duration-200 hover:scale-105 hover:shadow-medium`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{task.title}</span>
                            <span className="text-sm">{getPriorityIndicator(task.priority)}</span>
                          </div>
                          <div className="text-sm opacity-90">
                            {task.startTime} - {task.endTime}
                          </div>
                          {task.aiSuggestion && (
                            <div className="mt-2 text-xs opacity-80 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" />
                              {task.aiSuggestion}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* AI Suggestions */}
                      {hourTasks.length === 0 && aiSuggestions.length > 0 && (
                        <div className="ai-suggestion">
                          {aiSuggestions.map((suggestion, index) => (
                            <div key={index} className="text-xs flex items-center gap-2">
                              <Lightbulb className="w-3 h-3 text-ai-primary" />
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimeBlockCalendar;