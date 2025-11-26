import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  FileText, 
  CheckSquare, 
  Settings, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  currentApp: 'notes' | 'tasks';
  onAppChange: (app: 'notes' | 'tasks') => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentApp,
  onAppChange,
  onLogout,
  theme,
  onThemeToggle,
  userName = 'User',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'notes' as const,
      label: 'Smart Notes',
      icon: FileText,
      path: '/notes',
    },
    {
      id: 'tasks' as const,
      label: 'Task Manager',
      icon: CheckSquare,
      path: '/tasks',
    },
  ];

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              KiroweenSkeleton
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentApp === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onAppChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* User Info */}
        {!isCollapsed && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back,
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {userName}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onThemeToggle}
            className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            {!isCollapsed && (
              <span className="ml-3">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;