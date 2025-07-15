import React from 'react';
import { BarChart3, TrendingUp, Target, Clock, Calendar, Download, Award, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface GoalsAnalyticsDashboardProps {
  focusSessions: FocusSession[];
  userSettings: UserSettings;
  weeklyProgress: number;
  monthlyProgress: number;
}

const GoalsAnalyticsDashboard: React.FC<GoalsAnalyticsDashboardProps> = ({
  focusSessions,
  userSettings,
  weeklyProgress,
  monthlyProgress
}) => {
  // Mock analytics data
  const weeklyData = [
    { day: 'Mon', hours: 3.5, goal: 4 },
    { day: 'Tue', hours: 4.2, goal: 4 },
    { day: 'Wed', hours: 2.8, goal: 4 },
    { day: 'Thu', hours: 4.5, goal: 4 },
    { day: 'Fri', hours: 1.2, goal: 4 },
    { day: 'Sat', hours: 0, goal: 0 },
    { day: 'Sun', hours: 0, goal: 0 }
  ];

  const monthlyStats = {
    totalHours: monthlyProgress,
    completionRate: 85,
    avgSessionLength: 105,
    bestDay: 'Tuesday',
    productiveTime: '9:00 AM',
    streak: 12
  };

  const insights = [
    {
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      title: 'Productivity Trend',
      value: '+15%',
      description: 'vs last month'
    },
    {
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      title: 'Avg Session',
      value: '105 min',
      description: 'optimal length'
    },
    {
      icon: <Award className="h-4 w-4 text-purple-500" />,
      title: 'Success Rate',
      value: '85%',
      description: 'sessions completed'
    },
    {
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      title: 'Current Streak',
      value: '12 days',
      description: 'keep it up!'
    }
  ];

  const exportData = () => {
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Goals</h2>
          <p className="text-muted-foreground">Track your focus time progress and insights</p>
        </div>
        <Button variant="outline" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {insight.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">{insight.value}</div>
                <div className="text-sm text-muted-foreground">{insight.title}</div>
                <div className="text-xs text-muted-foreground">{insight.description}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Goals Progress</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Goal */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Weekly Goal</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{weeklyProgress}h</span>
                  <Badge variant={weeklyProgress >= userSettings.weeklyGoal ? "default" : "secondary"}>
                    {Math.round((weeklyProgress / userSettings.weeklyGoal) * 100)}%
                  </Badge>
                </div>
                <Progress value={(weeklyProgress / userSettings.weeklyGoal) * 100} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0h</span>
                  <span>Goal: {userSettings.weeklyGoal}h</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Remaining: </span>
                  <span className="font-medium">
                    {Math.max(0, userSettings.weeklyGoal - weeklyProgress)}h
                  </span>
                </div>
              </div>
            </Card>

            {/* Monthly Goal */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold">Monthly Goal</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{monthlyProgress}h</span>
                  <Badge variant={monthlyProgress >= userSettings.monthlyGoal ? "default" : "secondary"}>
                    {Math.round((monthlyProgress / userSettings.monthlyGoal) * 100)}%
                  </Badge>
                </div>
                <Progress value={(monthlyProgress / userSettings.monthlyGoal) * 100} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0h</span>
                  <span>Goal: {userSettings.monthlyGoal}h</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Remaining: </span>
                  <span className="font-medium">
                    {Math.max(0, userSettings.monthlyGoal - monthlyProgress)}h
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Goal Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Focus Streak</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700">12 days</p>
                <p className="text-xs text-muted-foreground">Personal best!</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Weekly Goal</span>
                </div>
                <p className="text-2xl font-bold text-green-700">3/4</p>
                <p className="text-xs text-muted-foreground">weeks achieved</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Deep Work</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">45h</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">This Week's Progress</h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{day.hours}h</span>
                      {day.goal > 0 && (
                        <span className="text-xs text-muted-foreground">Goal: {day.goal}h</span>
                      )}
                    </div>
                    {day.goal > 0 && (
                      <Progress value={(day.hours / day.goal) * 100} className="h-2" />
                    )}
                  </div>
                  <div className="w-16 text-right">
                    {day.goal > 0 && (
                      <Badge 
                        variant={day.hours >= day.goal ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {Math.round((day.hours / day.goal) * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Best Performing Days</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Tuesday</span>
                  <span className="font-medium">4.2h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thursday</span>
                  <span className="font-medium">4.5h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monday</span>
                  <span className="font-medium">3.5h</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Focus Time Patterns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Most Productive</span>
                  <span className="font-medium">9:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg Session</span>
                  <span className="font-medium">105 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="font-medium">85%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Productivity Insights</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Peak Performance Window</h4>
                  <p className="text-sm text-blue-700">
                    Your focus sessions between 9-11 AM show 40% higher completion rates. 
                    Consider scheduling your most important work during this time.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Optimal Session Length</h4>
                  <p className="text-sm text-green-700">
                    90-minute sessions work best for your role. Sessions longer than 120 minutes 
                    show decreased productivity.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Weekly Pattern</h4>
                  <p className="text-sm text-purple-700">
                    Tuesday and Thursday are your most productive days. Consider scheduling 
                    critical work during these periods.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">🎯 Goal Adjustment</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your current progress, consider increasing your weekly goal 
                    to 25 hours for better productivity outcomes.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">⏰ Schedule Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Block Friday afternoons for lighter tasks. Your data shows 
                    decreased focus performance during this time.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">🔄 Break Patterns</h4>
                  <p className="text-sm text-muted-foreground">
                    Add 15-minute breaks between back-to-back focus sessions 
                    to maintain high performance levels.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsAnalyticsDashboard;