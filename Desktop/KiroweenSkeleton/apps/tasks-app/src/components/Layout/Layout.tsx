import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/slices/uiSlice';
import { clearUser } from '../../store/slices/authSlice';
import { useAuth } from '@shared/hooks';
import { Sidebar, Navbar } from '@shared/components';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAppChange = (app: 'notes' | 'tasks') => {
    if (app === 'notes') {
      // Navigate to notes app
      window.open('http://localhost:3000', '_blank');
    }
  };

  const handleLogout = async () => {
    await logout();
    dispatch(clearUser());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        currentApp="tasks"
        onAppChange={handleAppChange}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        userName={user?.name}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Task Manager"
          userName={user?.name}
          showNotifications={true}
          notificationCount={0}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;