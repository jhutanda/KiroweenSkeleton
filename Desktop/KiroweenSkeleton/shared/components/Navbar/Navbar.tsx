import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface NavbarProps {
  title: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  userName?: string;
  userAvatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  onSearch,
  searchPlaceholder = 'Search...',
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  userName,
  userAvatar,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          {onSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          )}

          {/* Notifications */}
          {showNotifications && (
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            {userName && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;