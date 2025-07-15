import React, { useState } from 'react';
import { CheckCircle, Circle, Flag, Calendar, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  category: string;
}

export const TaskManager: React.FC = () => {
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

  const priorityColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Tasks</h2>
        <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border transition-all hover:shadow-md ${
              task.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-1 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                )}
              </button>
              
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Flag className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                    <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <span className="text-sm text-slate-500">{task.category}</span>
                  
                  {task.deadline && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {getDeadlineText(task.deadline)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};