import { Note, Task } from '@shared/types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateNote = (note: Partial<Note>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!note.title || note.title.trim().length === 0) {
    errors.push('Note title is required');
  }
  
  if (note.title && note.title.length > 200) {
    errors.push('Note title must be less than 200 characters');
  }
  
  if (!note.content || note.content.trim().length === 0) {
    errors.push('Note content is required');
  }
  
  if (note.content && note.content.length > 50000) {
    errors.push('Note content must be less than 50,000 characters');
  }
  
  if (note.tags && note.tags.length > 10) {
    errors.push('Maximum 10 tags allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTask = (task: Partial<Task>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }
  
  if (task.title && task.title.length > 200) {
    errors.push('Task title must be less than 200 characters');
  }
  
  if (task.description && task.description.length > 1000) {
    errors.push('Task description must be less than 1,000 characters');
  }
  
  if (!task.deadline) {
    errors.push('Task deadline is required');
  }
  
  if (task.deadline && new Date(task.deadline) < new Date()) {
    errors.push('Task deadline cannot be in the past');
  }
  
  if (!task.priority || !['low', 'medium', 'high'].includes(task.priority)) {
    errors.push('Valid task priority is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length >= 2 && query.length <= 100;
};