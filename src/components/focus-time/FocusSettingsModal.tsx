import React, { useState } from 'react';
import { Settings, Clock, User, Target, Shield, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

interface FocusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

const FocusSettingsModal: React.FC<FocusSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const roleDescriptions = {
    developer: 'Optimized for deep coding sessions and technical work',
    pm: 'Balanced approach for planning and stakeholder management',
    designer: 'Creative blocks with minimal interruptions',
    analyst: 'Data-focused sessions with research time',
    manager: 'Strategic thinking and team coordination blocks'
  };

  const modeDescriptions = {
    proactive: 'AI schedules focus time in advance based on your calendar',
    reactive: 'AI suggests focus time based on available slots',
    flexible: 'Manual scheduling with AI suggestions'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Focus Time Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4" />
                <h3 className="font-medium">Role & Preferences</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Select 
                    value={localSettings.role} 
                    onValueChange={(value: UserSettings['role']) => updateSetting('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="pm">Product Manager</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {roleDescriptions[localSettings.role]}
                  </p>
                </div>

                <div>
                  <Label htmlFor="session-length">Preferred Session Length (minutes)</Label>
                  <Select 
                    value={localSettings.preferredSessionLength.toString()} 
                    onValueChange={(value) => updateSetting('preferredSessionLength', parseInt(value))}
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
                  <Label htmlFor="mode">AI Mode</Label>
                  <Select 
                    value={localSettings.mode} 
                    onValueChange={(value: UserSettings['mode']) => updateSetting('mode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proactive">Proactive</SelectItem>
                      <SelectItem value="reactive">Reactive</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {modeDescriptions[localSettings.mode]}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" />
                <h3 className="font-medium">Work Hours</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={localSettings.workHours.start}
                    onChange={(e) => updateSetting('workHours', { 
                      ...localSettings.workHours, 
                      start: e.target.value 
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={localSettings.workHours.end}
                    onChange={(e) => updateSetting('workHours', { 
                      ...localSettings.workHours, 
                      end: e.target.value 
                    })}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-4 w-4" />
                <h3 className="font-medium">Focus Time Templates</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Morning Deep Work</span>
                    <Badge variant="secondary">9:00 - 11:00 AM</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optimal for complex problem-solving and creative work
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Afternoon Focus</span>
                    <Badge variant="secondary">2:00 - 4:00 PM</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Good for implementation and documentation
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4" />
                <h3 className="font-medium">Focus Protection</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-decline">Auto-decline meetings during focus time</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically decline overlapping meeting invitations
                    </p>
                  </div>
                  <Switch
                    id="auto-decline"
                    checked={localSettings.autoDeclineMeetings}
                    onCheckedChange={(checked) => updateSetting('autoDeclineMeetings', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="focus-behavior">Focus Behavior</Label>
                  <Select 
                    value={localSettings.focusBehavior} 
                    onValueChange={(value: UserSettings['focusBehavior']) => updateSetting('focusBehavior', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aggressive">Aggressive - Block all interruptions</SelectItem>
                      <SelectItem value="flexible">Flexible - Allow urgent interruptions</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {localSettings.focusBehavior === 'aggressive' 
                      ? 'Strictly protects focus time with minimal exceptions'
                      : 'Allows some flexibility for urgent matters'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4" />
                <h3 className="font-medium">Focus Time Goals</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="weekly-goal">Weekly Goal (hours)</Label>
                  <Input
                    id="weekly-goal"
                    type="number"
                    min="1"
                    max="40"
                    value={localSettings.weeklyGoal}
                    onChange={(e) => updateSetting('weeklyGoal', parseInt(e.target.value) || 20)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 15-25 hours per week for most roles
                  </p>
                </div>

                <div>
                  <Label htmlFor="monthly-goal">Monthly Goal (hours)</Label>
                  <Input
                    id="monthly-goal"
                    type="number"
                    min="4"
                    max="160"
                    value={localSettings.monthlyGoal}
                    onChange={(e) => updateSetting('monthlyGoal', parseInt(e.target.value) || 80)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically calculated as weekly goal × 4
                  </p>
                </div>

                <Separator />

                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium text-sm mb-2">Goal Recommendations</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Developers: 20-25 hours/week for deep coding</p>
                    <p>• PMs: 15-20 hours/week for strategic planning</p>
                    <p>• Designers: 18-22 hours/week for creative work</p>
                    <p>• Managers: 10-15 hours/week for high-level thinking</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FocusSettingsModal;