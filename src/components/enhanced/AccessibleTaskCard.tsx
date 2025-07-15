import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

interface AccessibleTaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isOverdue?: boolean;
  className?: string;
}

const AccessibleTaskCard: React.FC<AccessibleTaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isOverdue = false,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category: string) => {
    const icons = {
      work: '💼',
      personal: '🏠',
      health: '❤️',
      focus: '🎯',
      meeting: '👥'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'work':
        return 'info';
      case 'personal':
        return 'success';
      case 'health':
        return 'danger';
      case 'focus':
        return 'default';
      case 'meeting':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <InteractiveCard
      className={cn(
        "p-4 transition-all duration-200",
        {
          "ring-2 ring-danger ring-offset-2 animate-pulse": isOverdue,
          "opacity-60": task.completed,
        },
        className
      )}
      hover={!task.completed}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, !!checked)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            className="w-5 h-5"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg" role="img" aria-label={`${task.category} category`}>
              {getCategoryIcon(task.category)}
            </span>
            <h3 className={cn(
              "font-medium text-sm truncate",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {isOverdue && (
              <AlertTriangle 
                className="w-4 h-4 text-danger flex-shrink-0" 
                aria-label="Overdue task"
              />
            )}
          </div>

          {/* Time and Status */}
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time dateTime={`${task.startTime}-${task.endTime}`}>
              {task.startTime} - {task.endTime}
            </time>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge 
              variant={getCategoryVariant(task.category)}
              size="sm"
              aria-label={`Category: ${task.category}`}
            >
              {task.category}
            </StatusBadge>
            <StatusBadge 
              variant={getPriorityVariant(task.priority)}
              size="sm"
              aria-label={`Priority: ${task.priority}`}
            >
              {task.priority}
            </StatusBadge>
            {task.completed && (
              <StatusBadge variant="success" size="sm">
                <CheckCircle className="w-3 h-3" />
                Completed
              </StatusBadge>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* AI Suggestion */}
          {task.aiSuggestion && (
            <div className="ai-suggestion text-xs p-2 rounded-md mb-2">
              <div className="flex items-center gap-1 mb-1">
                <span className="w-3 h-3 text-ai-primary">🤖</span>
                <span className="font-medium text-ai-primary">AI Suggestion</span>
              </div>
              <p className="text-ai-primary/80">{task.aiSuggestion}</p>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <div className={cn(
          "flex-shrink-0 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AccessibleButton
                variant="ghost"
                size="icon-sm"
                aria-label={`More actions for ${task.title}`}
              >
                <MoreVertical className="w-4 h-4" />
              </AccessibleButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-danger focus:text-danger"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </InteractiveCard>
  );
};

export default AccessibleTaskCard;