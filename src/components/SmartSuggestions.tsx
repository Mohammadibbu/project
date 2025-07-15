import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Coffee,
  Focus,
  Clock,
  AlertTriangle,
  Brain,
  Zap,
} from "lucide-react";

interface Suggestion {
  id: string;
  type: "break" | "focus" | "reschedule" | "optimization" | "wellness";
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  priority: "high" | "medium" | "low";
  action?: string;
  timeEstimate?: string;
}

interface SmartSuggestionsProps {
  darkMode: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  darkMode,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      type: "break",
      title: "Take a Break",
      description:
        "You've been in focus mode for 2 hours. Consider a 15-minute break.",
      icon: Coffee,
      priority: "medium",
      action: "Schedule Break",
      timeEstimate: "15 min",
    },
    {
      id: "2",
      type: "focus",
      title: "Peak Focus Time",
      description:
        "Based on your patterns, 2-4 PM is your optimal focus window.",
      icon: Focus,
      priority: "high",
      action: "Block Time",
      timeEstimate: "2 hours",
    },
    {
      id: "3",
      type: "reschedule",
      title: "Schedule Conflict",
      description: "Your client meeting overlaps with the team standup.",
      icon: AlertTriangle,
      priority: "high",
      action: "Resolve Conflict",
    },
    {
      id: "4",
      type: "wellness",
      title: "Hydration Reminder",
      description: "You haven't logged water intake in 2 hours.",
      icon: Brain,
      priority: "low",
      action: "Log Water",
      timeEstimate: "1 min",
    },
  ]);

  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(
    new Set()
  );
  const [newSuggestionAnimation, setNewSuggestionAnimation] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Simulate new AI suggestions appearing
    const interval = setInterval(() => {
      const newSuggestion: Suggestion = {
        id: Date.now().toString(),
        type: "optimization",
        title: "Smart Scheduling",
        description: "Moving your workout to 6 AM could free up evening time.",
        icon: Clock,
        priority: "low",
        action: "Apply Change",
        timeEstimate: "5 min",
      };

      setSuggestions((prev) => {
        if (prev.length >= 5) return prev;
        setNewSuggestionAnimation(newSuggestion.id);
        setTimeout(() => setNewSuggestionAnimation(null), 1000);
        return [...prev, newSuggestion];
      });
    }, 30000); // New suggestion every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    if (darkMode) {
      switch (priority) {
        case "high":
          return "border-red-600 bg-red-900 bg-opacity-20";
        case "medium":
          return "border-yellow-600 bg-yellow-900 bg-opacity-20";
        case "low":
          return "border-green-600 bg-green-900 bg-opacity-20";
        default:
          return "border-gray-600 bg-gray-800";
      }
    } else {
      switch (priority) {
        case "high":
          return "border-red-200 bg-red-50";
        case "medium":
          return "border-yellow-200 bg-yellow-50";
        case "low":
          return "border-green-200 bg-green-50";
        default:
          return "border-slate-200 bg-slate-50";
      }
    }
  };

  const getIconColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-slate-600";
    }
  };

  const applySuggestion = (id: string) => {
    setAppliedSuggestions((prev) => new Set([...prev, id]));
    // Remove suggestion after applying
    setTimeout(() => {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setAppliedSuggestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 2000);
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 border transition-all duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-xl font-semibold">AI Suggestions</h2>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
          }`}
        >
          Live
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {suggestions.map((suggestion) => {
          const IconComponent = suggestion.icon;
          const isApplied = appliedSuggestions.has(suggestion.id);
          const isNew = newSuggestionAnimation === suggestion.id;

          return (
            <div
              key={suggestion.id}
              className={`p-4 rounded-lg border transition-all duration-300 hover-lift ${getPriorityColor(
                suggestion.priority
              )} ${isApplied ? "opacity-50 scale-95" : ""} ${
                isNew ? "slide-up glow-current" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent
                    className={`w-5 h-5 ${getIconColor(suggestion.priority)}`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{suggestion.title}</h3>
                    {suggestion.timeEstimate && (
                      <span className="text-xs opacity-75 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {suggestion.timeEstimate}
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-75 mb-3">
                    {suggestion.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    {suggestion.action && !isApplied && (
                      <button
                        onClick={() => applySuggestion(suggestion.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors interactive flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{suggestion.action}</span>
                      </button>
                    )}

                    {isApplied && (
                      <span className="text-sm font-medium text-green-600 flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Applied!</span>
                      </span>
                    )}

                    <button
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="text-xs opacity-50 hover:opacity-75 transition-opacity"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Learning Indicator */}
      <div
        className={`mt-4 p-3 rounded-lg ${
          darkMode ? "bg-gray-700" : "bg-slate-100"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            AI is learning your patterns...
          </span>
        </div>
        <div
          className={`mt-2 w-full rounded-full h-1 ${
            darkMode ? "bg-gray-600" : "bg-gray-300"
          }`}
        >
          <div
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full progress-animated"
            style={{ width: "67%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
