import React, { useState, useEffect } from "react";
import { X, Clock, Tag, Repeat, Zap } from "lucide-react";
import { CalendarEvent } from "../types/calendar";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  editEvent?: CalendarEvent;
  suggestedTime?: string;
  darkMode: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editEvent,
  suggestedTime,
  darkMode,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    startTime: suggestedTime || "09:00",
    duration: 60,
    category: "work" as "work" | "health" | "focus" | "personal" | "meeting",
    description: "",
    isRecurring: false,
    recurringPattern: "daily" as "daily" | "weekly" | "monthly",
    priority: "medium" as "low" | "medium" | "high",
  });

  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title,
        startTime: editEvent.startTime,
        duration: editEvent.duration,
        category: editEvent.category,
        description: editEvent.description || "",
        isRecurring: editEvent.isRecurring || false,
        recurringPattern:
          (editEvent.recurringPattern as "daily" | "weekly" | "monthly") ||
          "daily",
        priority: editEvent.priority || "medium",
      });
    } else if (suggestedTime) {
      setFormData((prev) => ({ ...prev, startTime: suggestedTime }));
    }
  }, [editEvent, suggestedTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const endTime = calculateEndTime(formData.startTime, formData.duration);

    onSave({
      ...formData,
      endTime,
      isHabit: false,
    });

    onClose();
    resetForm();
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins
      .toString()
      .padStart(2, "0")}`;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      startTime: "09:00",
      duration: 60,
      category: "work",
      description: "",
      isRecurring: false,
      recurringPattern: "daily",
      priority: "medium",
    });
  };

  const categoryColors = {
    work: "bg-blue-100 text-blue-800 border-blue-300",
    health: "bg-pink-100 text-pink-800 border-pink-300",
    focus: "bg-purple-100 text-purple-800 border-purple-300",
    personal: "bg-green-100 text-green-800 border-green-300",
    meeting: "bg-orange-100 text-orange-800 border-orange-300",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl shadow-xl w-full max-w-md slide-up ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors interactive ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter event title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (min)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: parseInt(e.target.value),
                  }))
                }
                className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(categoryColors).map(([category, colorClass]) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      category: category as any,
                    }))
                  }
                  className={`p-2 rounded-lg border-2 transition-all duration-200 interactive ${
                    formData.category === category
                      ? colorClass
                      : darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium capitalize">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as any,
                }))
              }
              className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRecurring: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <Repeat className="w-4 h-4" />
              <span className="text-sm font-medium">Recurring Event</span>
            </label>

            {formData.isRecurring && (
              <select
                value={formData.recurringPattern}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recurringPattern: e.target.value as any,
                  }))
                }
                className={`mt-2 w-full p-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={3}
              placeholder="Add event description..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 p-3 rounded-lg border transition-all duration-200 interactive ${
                darkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>{editEvent ? "Update" : "Create"} Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
