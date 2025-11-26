import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setTheme } from './store/slices/uiSlice';
import { setUser, clearUser } from './store/slices/authSlice';
import { useAuth, useTheme } from '@shared/hooks';

// Components
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import NotesPageEnhanced from './pages/NotesPageEnhanced';
import NoteDetailPage from './pages/NoteDetailPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  const { user, login, logout, checkAuthState } = useAuth();
  const { theme: systemTheme, toggleTheme } = useTheme();

  // Initialize auth state
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // Sync auth state with Redux
  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }
  }, [user, dispatch]);

  // Sync theme with Redux and system
  useEffect(() => {
    dispatch(setTheme(systemTheme));
  }, [systemTheme, dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/notes" replace />
            ) : (
              <LoginPage />
            )
          } 
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/notes" replace />} />
          <Route path="notes" element={<NotesPageEnhanced />} />
          <Route path="notes/:id" element={<NoteDetailPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/notes" replace />} />
      </Routes>
    </div>
  );
};

export default App;