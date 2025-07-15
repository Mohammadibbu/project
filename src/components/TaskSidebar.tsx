import React, { useState } from 'react';
import { CheckCircle, Circle, Flag, Calendar, Plus, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  category: string;
}

interface TaskSidebarProps {
  darkMode: boolean;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ darkMode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      completed: false,
      priority: 'high',
      deadline: '2024-01-15',
      category: 'Work'
    },
    {
      id: '2',
      title: 'Review code submissions',
      completed: true,
      priority: 'medium',
      deadline: '2024-01-14',
      category: 'Work'
    },
    {
      id: '3',
      title: 'Schedule dentist appointment',
      completed: false,
      priority: 'low',
      deadline: '2024-01-20',
      category: 'Personal'
    },
    {
      id: '4',
      title: 'Prepare presentation slides',
      completed: false,
      priority: 'high',
      deadline: '2024-01-16',
      category: 'Work'
    },
    {
      id: '5',
      title: 'Update portfolio website',
      completed: false,
      priority: 'medium',
      category: 'Personal'
    }
  ]);

  const [swipedTask, setSwipedTask] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    setSwipedTask(null);
  };

  const getDeadlineText = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    const date = new Date(deadline);
    const today = new Date();
    return date < today;
  };

  return (
    <div className={`rounded-2xl shadow-lg p-6 border transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button className={`p-2 rounded-lg transition-all duration-200 interactive ${
          darkMode ? 'bg-blue-900 hover:bg-blue-800' : 'bg-blue-100 hover:bg-blue-200'
        }`}>
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`relative transition-all duration-300 hover-lift ${
              task.completed ? 'opacity-75' : ''
            }`}
            onTouchStart={() => setSwipedTask(task.id)}
            onTouchEnd={() => setTimeout(() => setSwipedTask(null), 3000)}
          >
            <div className={`p-3 rounded-lg border transition-all duration-300 ${
              task.completed 
                ? darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'
                : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-slate-200'
            } ${isOverdue(task.deadline) && !task.completed ? 'pulse-urgent' : ''}`}>
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 transition-all duration-200 interactive"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-medium transition-all duration-300 ${
                    task.completed ? 'line-through opacity-60' : ''
                  }`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>
                      <Flag className="w-3 h-3 inline mr-1" />
                      {task.priority}
                    </div>
                    
                    <span className="text-sm opacity-75">{task.category}</span>
                    
                    {task.deadline && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className={`text-sm ${
                          isOverdue(task.deadline) ? 'text-red-500 font-medium' : 'opacity-75'
                        }`}>
                          {getDeadlineText(task.deadline)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile swipe action */}
            {swipedTask === task.id && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 slide-up">
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Task completion progress */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Daily Progress</span>
          <span className="text-sm opacity-75">
            {tasks.filter(t => t.completed).length}/{tasks.length}
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full progress-animated transition-all duration-500"
            style={{ 
              width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`,
              '--progress-width': `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`
            } as any}
          ></div>
        </div>
      </div>
    </div>
  );
};