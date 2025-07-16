import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar,
  Award,
  Zap,
  Brain,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  Coffee,
  Focus
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'urgent' | 'important' | 'low';
  category: 'work' | 'personal' | 'health' | 'focus' | 'meeting';
  completed: boolean;
  estimatedDuration: number;
}

interface ProductivityAnalyticsProps {
  tasks: Task[];
  weeklyProgress: number;
  weeklyGoal: number;
  productivityScore: number;
}

const ProductivityAnalytics: React.FC<ProductivityAnalyticsProps> = ({
  tasks,
  weeklyProgress,
  weeklyGoal,
  productivityScore
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [showGoalSettings, setShowGoalSettings] = useState(false);

  // Mock data for charts and analytics
  const weeklyData = [
    { day: 'Mon', completed: 5, planned: 7, focusTime: 3.5 },
    { day: 'Tue', completed: 8, planned: 9, focusTime: 4.2 },
    { day: 'Wed', completed: 6, planned: 8, focusTime: 2.8 },
    { day: 'Thu', completed: 9, planned: 10, focusTime: 4.5 },
    { day: 'Fri', completed: 4, planned: 6, focusTime: 2.1 },
    { day: 'Sat', completed: 2, planned: 3, focusTime: 1.0 },
    { day: 'Sun', completed: 1, planned: 2, focusTime: 0.5 }
  ];

  const categoryStats = {
    work: { completed: 12, total: 18, avgTime: 85 },
    personal: { completed: 5, total: 7, avgTime: 45 },
    health: { completed: 4, total: 5, avgTime: 60 },
    focus: { completed: 8, total: 10, avgTime: 120 },
    meeting: { completed: 6, total: 8, avgTime: 50 }
  };

  const achievements = [
    { id: 1, title: 'Focus Master', description: 'Completed 10 focus sessions', icon: '🎯', earned: true },
    { id: 2, title: 'Early Bird', description: 'Started work before 8 AM for 5 days', icon: '🌅', earned: true },
    { id: 3, title: 'Task Crusher', description: 'Completed 50 tasks this month', icon: '💪', earned: false },
    { id: 4, title: 'Consistency King', description: 'Met daily goals for 7 days straight', icon: '👑', earned: false }
  ];

  const insights = [
    {
      type: 'positive',
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      title: 'Productivity Trending Up',
      description: 'Your task completion rate increased by 23% this week compared to last week.'
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      title: 'Focus Time Declining',
      description: 'Your deep work sessions are 15% shorter than your optimal range. Consider longer blocks.'
    },
    {
      type: 'tip',
      icon: <Brain className="h-4 w-4 text-blue-600" />,
      title: 'Optimal Schedule Detected',
      description: 'You\'re most productive on Tuesdays and Thursdays. Schedule important tasks on these days.'
    },
    {
      type: 'positive',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      title: 'Goal Achievement',
      description: 'You\'ve exceeded your weekly focus time goal by 2.5 hours. Great job!'
    }
  ];

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgTaskDuration = tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + t.estimatedDuration, 0) / tasks.length) : 0;

  const handleSetWeeklyGoal = (goal: number) => {
    // In a real app, this would update the user's settings
    console.log('Setting weekly goal to:', goal);
  };

  const handleExportReport = () => {
    // Generate and download productivity report
    const reportData = {
      period: selectedPeriod,
      completionRate,
      productivityScore,
      weeklyProgress,
      weeklyGoal,
      insights,
      categoryStats,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity-report-${selectedPeriod}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Productivity Analytics</h2>
          <p className="text-muted-foreground">
            Insights and reports to optimize your productivity
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <Button onClick={handleExportReport} variant="outline" className="hover-glow">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          
          <Button onClick={() => setShowGoalSettings(true)} className="hover-glow">
            <Settings className="h-4 w-4 mr-2" />
            Set Goals
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Productivity Score</p>
              <p className="text-3xl font-bold text-primary">{productivityScore}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <Progress value={productivityScore} className="mb-2" />
          <p className="text-xs text-muted-foreground">+5 points from last week</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Task Completion</p>
              <p className="text-3xl font-bold text-success">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
          <Progress value={completionRate} className="mb-2" />
          <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Focus Time</p>
              <p className="text-3xl font-bold text-focus">{weeklyProgress}h</p>
            </div>
            <div className="w-12 h-12 bg-focus/10 rounded-xl flex items-center justify-center">
              <Focus className="w-6 h-6 text-focus" />
            </div>
          </div>
          <Progress value={(weeklyProgress / weeklyGoal) * 100} className="mb-2" />
          <p className="text-xs text-muted-foreground">Goal: {weeklyGoal}h this week</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Task Time</p>
              <p className="text-3xl font-bold text-warning">{avgTaskDuration}m</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Optimal range: 45-90 min</p>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Weekly Progress</h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Tasks: {day.completed}/{day.planned}</span>
                      <span className="text-sm text-muted-foreground">{day.focusTime}h focus</span>
                    </div>
                    <div className="flex gap-2">
                      <Progress value={(day.completed / day.planned) * 100} className="flex-1 h-2" />
                      <Progress value={(day.focusTime / 5) * 100} className="flex-1 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-ai-primary" />
              AI Insights
            </h3>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  {insight.icon}
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Productivity Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Best Performing Days</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tuesday</span>
                    <Badge className="bg-green-500/10 text-green-700">95% completion</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Thursday</span>
                    <Badge className="bg-green-500/10 text-green-700">90% completion</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday</span>
                    <Badge className="bg-yellow-500/10 text-yellow-700">71% completion</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Peak Focus Hours</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">9:00 - 11:00 AM</span>
                    <Badge className="bg-purple-500/10 text-purple-700">Peak</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">2:00 - 4:00 PM</span>
                    <Badge className="bg-blue-500/10 text-blue-700">Good</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">7:00 - 9:00 PM</span>
                    <Badge className="bg-gray-500/10 text-gray-700">Low</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <Card key={category} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold capitalize">{category}</h3>
                  <Badge variant="outline">
                    {Math.round((stats.completed / stats.total) * 100)}%
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{stats.completed}/{stats.total}</span>
                  </div>
                  
                  <Progress value={(stats.completed / stats.total) * 100} />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Avg Duration</span>
                    <span>{stats.avgTime} min</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`p-6 ${achievement.earned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.earned ? (
                    <Badge className="bg-yellow-500/10 text-yellow-700">
                      <Award className="h-3 w-3 mr-1" />
                      Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductivityAnalytics;