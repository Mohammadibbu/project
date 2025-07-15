export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'health' | 'focus' | 'personal' | 'meeting';
  description?: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  isHabit?: boolean;
  duration: number; // in minutes
  priority?: 'high' | 'medium' | 'low';
}

export interface TimeSlot {
  time: string;
  available: boolean;
  event?: CalendarEvent;
}

export interface AIAction {
  id: string;
  type: 'move' | 'split' | 'reschedule' | 'break';
  description: string;
  originalEvent?: CalendarEvent;
  suggestedTime?: string;
  reason: string;
}