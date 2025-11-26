import { useState, useEffect, useCallback } from 'react';
import { AuthState, User } from '@shared/types';

// Mock AWS Cognito integration - replace with actual implementation
interface CognitoUser {
  username: string;
  attributes: {
    email: string;
    name: string;
  };
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Mock implementation - replace with actual Cognito getCurrentUser
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication error',
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock login - replace with actual Cognito signIn
      if (email && password) {
        const mockUser: User = {
          id: 'user-123',
          email,
          name: email.split('@')[0],
          theme: 'light',
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Mock logout - replace with actual Cognito signOut
      localStorage.removeItem('currentUser');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock registration - replace with actual Cognito signUp
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        theme: 'light',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('No user logged in');
      
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      return { success: false, error: errorMessage };
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    logout,
    register,
    updateUserProfile,
    checkAuthState,
  };
};

export default useAuth;