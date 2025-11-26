// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  theme: 'light' | 'dark';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Note Types
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteRevision {
  id: string;
  noteId: string;
  version: number;
  content: string;
  createdAt: string;
}

// Task Types
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

// AI Types
export interface AISummaryRequest {
  content: string;
  noteId: string;
}

export interface AISummaryResponse {
  summary: string;
  keyPoints: string[];
  tags: string[];
}

export interface AIScheduleRequest {
  tasks: Task[];
  preferences?: {
    workingHours?: { start: string; end: string };
    breakDuration?: number;
  };
}

export interface AIScheduleResponse {
  schedule: ScheduleItem[];
  recommendations: string[];
}

export interface ScheduleItem {
  taskId: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  taskId?: string;
  message: string;
  scheduledFor: string;
  sent: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'textarea';
  required?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Theme Types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Productivity Types
export interface ProductivityScore {
  date: string;
  score: number;
  tasksCompleted: number;
  notesCreated: number;
  aiInteractions: number;
}

export interface ProductivityAnalytics {
  daily: ProductivityScore[];
  weekly: {
    week: string;
    averageScore: number;
    totalTasks: number;
    totalNotes: number;
  }[];
  monthly: {
    month: string;
    averageScore: number;
    totalTasks: number;
    totalNotes: number;
  }[];
}