import { ApiResponse, ApiError } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3001/api';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, token } = config;
    
    const url = `${this.baseURL}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error);
      throw error;
    }
  }

  // Notes API
  async getNotes(token: string, page = 1, limit = 20): Promise<ApiResponse<any[]>> {
    return this.request(`/notes?page=${page}&limit=${limit}`, { token });
  }

  async getNote(id: string, token: string): Promise<ApiResponse<any>> {
    return this.request(`/notes/${id}`, { token });
  }

  async createNote(note: any, token: string): Promise<ApiResponse<any>> {
    return this.request('/notes', {
      method: 'POST',
      body: note,
      token,
    });
  }

  async updateNote(id: string, note: any, token: string): Promise<ApiResponse<any>> {
    return this.request(`/notes/${id}`, {
      method: 'PUT',
      body: note,
      token,
    });
  }

  async deleteNote(id: string, token: string): Promise<ApiResponse<void>> {
    return this.request(`/notes/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Tasks API
  async getTasks(token: string, status?: string): Promise<ApiResponse<any[]>> {
    const query = status ? `?status=${status}` : '';
    return this.request(`/tasks${query}`, { token });
  }

  async getTask(id: string, token: string): Promise<ApiResponse<any>> {
    return this.request(`/tasks/${id}`, { token });
  }

  async createTask(task: any, token: string): Promise<ApiResponse<any>> {
    return this.request('/tasks', {
      method: 'POST',
      body: task,
      token,
    });
  }

  async updateTask(id: string, task: any, token: string): Promise<ApiResponse<any>> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: task,
      token,
    });
  }

  async deleteTask(id: string, token: string): Promise<ApiResponse<void>> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // AI API
  async summarizeNote(content: string, noteId: string, token: string): Promise<ApiResponse<any>> {
    return this.request('/ai/summarize', {
      method: 'POST',
      body: { content, noteId },
      token,
    });
  }

  async scheduleTask(tasks: any[], token: string): Promise<ApiResponse<any>> {
    return this.request('/ai/schedule', {
      method: 'POST',
      body: { tasks },
      token,
    });
  }
}

export const apiClient = new ApiClient();

// Utility functions for error handling
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return !navigator.onLine || error?.code === 'NETWORK_ERROR';
};