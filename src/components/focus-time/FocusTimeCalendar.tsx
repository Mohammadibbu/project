import React, { useState } from 'react';
import { Plus, Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FocusSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'ai-suggested' | 'manual' | 'rescheduled';
  priority: 'high' | 'medium' | 'low';
  role?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'in-progress';
  aiSuggestion?: string;
  conflicts?: string[];
}

interface UserSettings {
  role: 'developer' | 'pm' | 'designer' | 'analyst' | 'manager';
  workHours: { start: string; end: string };
  preferredSessionLength: number;
  mode: 'proactive' | 'reactive' | 'flexible';
  autoDeclineMeetings: boolean;
  focusBehavior: 'aggressive' | 'flexible';
  weeklyGoal: number;
  monthlyGoal: number;
}

interface FocusTimeCalendarProps {
  focusSessions: FocusSession[];
  userSettings: UserSettings;
  onUpdateSession: (sessionId: string, updates: Partial<FocusSession>) => void;
  onAddSession: (session: Omit<FocusSession, 'id'>) => void;
}

const FocusTimeCalendar: React.FC<FocusTimeCalendarProps> = ({
  focusSessions,
  userSettings,
  onUpdateSession,
  onAddSession
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ hour: number; date: string } | null>(null);
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    duration: 90,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  // Generate time slots for today (5 AM to 11 PM)
  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 5);
  const today = new Date().toISOString().split('T')[0];

  const getSessionForTimeSlot = (hour: number, date: string) => {
    return focusSessions.find(session => {
      const sessionHour = parseInt(session.startTime.split(':')[0]);
      return sessionHour === hour && session.date === date;
    });
  };

  const getTimeSlotStatus = (hour: number) => {
    const workStart = parseInt(userSettings.workHours.start.split(':')[0]);
    const workEnd = parseInt(userSettings.workHours.end.split(':')[0]);
    
    if (hour < workStart || hour >= workEnd) return 'outside-hours';
    
    const session = getSessionForTimeSlot(hour, today);
    if (session) return session.status;
    
    // AI optimal time suggestions (mock logic)
    const optimalHours = [9, 10, 14, 15];
    if (optimalHours.includes(hour)) return 'ai-optimal';
    
    return 'available';
  };

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'missed':
        return 'bg-destructive text-destructive-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'ai-optimal':
        return 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-200 text-purple-700';
      case 'outside-hours':
        return 'bg-muted text-muted-foreground opacity-50';
      default:
        return 'bg-background border border-border/50 hover:border-primary/30 hover:bg-primary/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'missed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'in-progress':
        return <Zap className="h-4 w-4" />;
      case 'ai-optimal':
        return <Zap className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleTimeSlotClick = (hour: number) => {
    const status = getTimeSlotStatus(hour);
    if (status === 'available' || status === 'ai-optimal') {
      setSelectedTimeSlot({ hour, date: today });
    }
  };

  const handleCreateSession = () => {
    if (!selectedTimeSlot) return;

    const endHour = selectedTimeSlot.hour + Math.floor(newSessionData.duration / 60);
    const endMinutes = newSessionData.duration % 60;

    onAddSession({
      title: newSessionData.title,
      startTime: `${selectedTimeSlot.hour.toString().padStart(2, '0')}:00`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`,
      date: selectedTimeSlot.date,
      type: 'manual',
      priority: newSessionData.priority,
      status: 'scheduled'
    });

    setSelectedTimeSlot(null);
    setNewSessionData({ title: '', duration: 90, priority: 'medium' });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Focus Time Calendar</h2>
          <p className="text-sm text-muted-foreground">Today • {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1 text-purple-600" />
            AI Optimal
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        {timeSlots.map((hour) => {
          const session = getSessionForTimeSlot(hour, today);
          const status = getTimeSlotStatus(hour);
          const isClickable = status === 'available' || status === 'ai-optimal';

          return (
            <div
              key={hour}
              className={`
                p-4 rounded-lg transition-all duration-200 cursor-pointer
                ${getSlotStatusColor(status)}
                ${isClickable ? 'hover:scale-[1.02] hover:shadow-sm' : ''}
                ${selectedTimeSlot?.hour === hour ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
              onClick={() => handleTimeSlotClick(hour)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                  {getStatusIcon(status)}
                  {session && (
                    <div>
                      <span className="font-medium">{session.title}</span>
                      {session.aiSuggestion && (
                        <p className="text-xs opacity-80 mt-1">{session.aiSuggestion}</p>
                      )}
                    </div>
                  )}
                  {status === 'ai-optimal' && !session && (
                    <span className="text-xs text-purple-600 font-medium">
                      AI Recommended Time
                    </span>
                  )}
                </div>
                
                {session && (
                  <Badge 
                    variant={session.priority === 'high' ? 'destructive' : 
                           session.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {session.priority}
                  </Badge>
                )}
              </div>
              
              {session?.conflicts && session.conflicts.length > 0 && (
                <div className="mt-2 text-xs text-orange-600">
                  ⚠️ Potential conflicts: {session.conflicts.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Session Dialog */}
      <Dialog open={!!selectedTimeSlot} onOpenChange={() => setSelectedTimeSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Focus Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-title">Session Title</Label>
              <Input
                id="session-title"
                value={newSessionData.title}
                onChange={(e) => setNewSessionData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Deep Work - Feature Development"
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select 
                value={newSessionData.duration.toString()} 
                onValueChange={(value) => setNewSessionData(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                  <SelectItem value="180">180 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={newSessionData.priority} 
                onValueChange={(value: 'high' | 'medium' | 'low') => setNewSessionData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedTimeSlot(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSession} disabled={!newSessionData.title}>
                Schedule Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FocusTimeCalendar;