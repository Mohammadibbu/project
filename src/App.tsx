import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Brain, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Bell, 
  User,
  Zap,
  Target,
  Clock
} from "lucide-react";
import MainDashboard from "@/components/dashboard/MainDashboard";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    // Simulate app loading with enhanced animation
    setTimeout(() => setIsLoaded(true), 800);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-ai-primary rounded-2xl flex items-center justify-center mx-auto animate-pulse-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gradient">AI Task Manager</h1>
            <p className="text-muted-foreground">Initializing your intelligent workspace...</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="loading-spinner w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Loading AI models...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="ai-task-manager-theme">
      <div className="min-h-screen bg-background font-inter antialiased">
        {/* Enhanced Header */}
        <div className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Branding */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-ai-primary rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gradient">TaskFlow AI</h1>
                    <p className="text-xs text-muted-foreground">Smart Task Management</p>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="hidden md:flex items-center space-x-3">
                  <Badge className="bg-success/10 text-success border-success/20">
                    <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
                    AI Active
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    3 Integrations
                  </Badge>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-3">
                {/* Quick Stats */}
                <div className="hidden lg:flex items-center space-x-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium">85%</span>
                    <span className="text-muted-foreground">completion</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-focus" />
                    <span className="font-medium">28h</span>
                    <span className="text-muted-foreground">this week</span>
                  </div>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative hover-glow">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-danger text-danger-foreground animate-pulse-glow">
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="icon" className="hover-glow">
                  <Settings className="h-5 w-5" />
                </Button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Profile */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center text-white text-sm font-medium">
                    JD
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Premium Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Application */}
        <div className="animate-fade-in">
          <MainDashboard />
        </div>

        {/* Enhanced Toast Notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--card-foreground))',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;