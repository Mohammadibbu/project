import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Brain, Sparkles, BarChart3, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SmartCalendar from "@/components/SmartCalendar";
import FocusTimeScheduler from "@/components/FocusTimeScheduler";
import ModernDashboard from "@/components/enhanced/ModernDashboard";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate app loading
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-spinner w-8 h-8 mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="task-manager-theme">
      <div className="min-h-screen bg-background font-inter antialiased">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo and Navigation */}
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-ai-primary rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gradient">TaskFlow AI</h1>
                      <p className="text-xs text-muted-foreground">Intelligent Task Management</p>
                    </div>
                  </div>

                  <TabsList className="bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger 
                      value="dashboard" 
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-soft"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="smart-calendar"
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-soft"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Calendar</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="focus-scheduler"
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-soft"
                    >
                      <Brain className="h-4 w-4" />
                      <span className="hidden sm:inline">Focus</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics"
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-soft"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-danger text-danger-foreground animate-pulse-glow">
                        {notifications}
                      </Badge>
                    )}
                  </Button>

                  {/* Settings */}
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>

                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center text-white text-sm font-medium">
                    JD
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Content Area */}
          <div className="animate-fade-in">
            <TabsContent value="dashboard" className="mt-0">
              <ModernDashboard />
            </TabsContent>
            
            <TabsContent value="smart-calendar" className="mt-0">
              <SmartCalendar />
            </TabsContent>
            
            <TabsContent value="focus-scheduler" className="mt-0">
              <FocusTimeScheduler />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <div className="container mx-auto px-6 py-8">
                <div className="text-center py-20">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive productivity insights and reports coming soon.
                  </p>
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Early Access
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Toast Notifications */}
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