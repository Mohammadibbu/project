import React from "react";
import {
  Calendar,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface CalendarHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onIntegrationsClick: () => void;
  darkMode: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onDateChange,
  onIntegrationsClick,
  darkMode,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
    onDateChange(newDate);
  };

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 border transition-all duration-300 hover-lift ${
        darkMode
          ? "bg-gray-800 border-gray-700 glass-effect"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Calendar className="w-8 h-8 text-blue-600" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartCalendar AI
            </h1>
          </div>

          <div
            className={`flex items-center space-x-2 rounded-lg p-2 transition-all duration-300 ${
              darkMode ? "bg-gray-700" : "bg-slate-100"
            }`}
          >
            <button
              onClick={() => navigateDate("prev")}
              className={`p-1 rounded transition-all duration-200 interactive ${
                darkMode ? "hover:bg-gray-600" : "hover:bg-white"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-lg font-semibold px-4 whitespace-nowrap">
              {formatDate(selectedDate)}
            </span>

            <button
              onClick={() => navigateDate("next")}
              className={`p-1 rounded transition-all duration-200 interactive ${
                darkMode ? "hover:bg-gray-600" : "hover:bg-white"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={() => alert("Add Event")}
          >
            <Plus className="w-5 h-5" />
            <span>Add Event</span>
          </button>

          <button
            onClick={onIntegrationsClick}
            className={`p-2 rounded-lg transition-all duration-200 interactive ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
