import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Brain, Sparkles } from "lucide-react";
import SmartCalendar from "@/components/SmartCalendar";
import FocusTimeScheduler from "@/components/FocusTimeScheduler";
import ModernDashboard from "@/components/enhanced/ModernDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6">
            <TabsList className="h-14 bg-transparent border-none">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
              >
                <Sparkles className="h-4 w-4" />
                Modern Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="smart-calendar"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
              >
                <Calendar className="h-4 w-4" />
                Smart Calendar
              </TabsTrigger>
              <TabsTrigger 
                value="focus-scheduler"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
              >
                <Brain className="h-4 w-4" />
                AI Focus Scheduler
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="dashboard" className="mt-0">
          <ModernDashboard />
        </TabsContent>
        <TabsContent value="smart-calendar" className="mt-0">
          <SmartCalendar />
        </TabsContent>
        <TabsContent value="focus-scheduler" className="mt-0">
          <FocusTimeScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;