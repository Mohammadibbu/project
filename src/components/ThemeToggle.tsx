import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: (darkMode: boolean) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-3">
      <Sun className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-500' : 'text-yellow-500'}`} />
      <button
        onClick={() => onToggle(!darkMode)}
        className={`theme-toggle ${darkMode ? 'dark' : ''} interactive`}
      >
      </button>
      <Moon className={`w-5 h-5 transition-colors ${darkMode ? 'text-blue-400' : 'text-gray-500'}`} />
    </div>
  );
};