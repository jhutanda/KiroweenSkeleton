import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input, Card } from '@shared/components';
import { useAuth } from '@shared/hooks';
import { setUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';
import { validateEmail } from '@shared/utils';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const from = location.state?.from?.pathname || '/tasks';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    const newErrors: string[] = [];
    if (!validateEmail(email)) {
      newErrors.push('Please enter a valid email address');
    }
    if (password.length < 6) {
      newErrors.push('Password must be at least 6 characters');
    }
    if (!isLogin && !name.trim()) {
      newErrors.push('Name is required for registration');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = isLogin 
        ? await login(email, password)
        : await register(email, password, name);
      
      if (result.success) {
        dispatch(addNotification({
          type: 'success',
          message: isLogin ? 'Welcome back!' : 'Account created successfully!',
        }));
        navigate(from, { replace: true });
      } else {
        setErrors([result.error || 'Authentication failed']);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Task Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            )}
            
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              required
            />
            
            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <ul className="text-sm text-red-600 dark:text-red-400">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;