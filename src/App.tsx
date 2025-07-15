import React, { useState, useEffect } from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import { DailySummary } from "./components/DailySummary";
import { InteractiveTimeline } from "./components/InteractiveTimeline";
import { TaskSidebar } from "./components/TaskSidebar";
import { HabitTracker } from "./components/HabitTracker";
import { SmartSuggestions } from "./components/SmartSuggestions";
import { AIAssistant } from "./components/AIAssistant";
import { IntegrationPanel } from "./components/IntegrationPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import "./styles/animations.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading and trigger fade-in animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <CalendarHeader
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onIntegrationsClick={() => setShowIntegrations(true)}
            darkMode={darkMode}
          />
          <ThemeToggle darkMode={darkMode} onToggle={setDarkMode} />
        </div>

        {/* Daily Summary with Fade-in Animation */}
        <div className={`mb-6 ${isLoaded ? "fade-in-up" : "opacity-0"}`}>
          <DailySummary selectedDate={selectedDate} darkMode={darkMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Main Timeline Area */}
          <div className="lg:col-span-3 space-y-6">
            <InteractiveTimeline
              selectedDate={selectedDate}
              darkMode={darkMode}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <TaskSidebar darkMode={darkMode} />
            <HabitTracker darkMode={darkMode} />
            <SmartSuggestions darkMode={darkMode} />
          </div>
        </div>

        {/* AI Assistant */}
        <AIAssistant
          isOpen={showAIAssistant}
          onToggle={() => setShowAIAssistant(!showAIAssistant)}
          darkMode={darkMode}
        />

        {/* Integration Panel */}
        {showIntegrations && (
          <IntegrationPanel
            onClose={() => setShowIntegrations(false)}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
