import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task, AIScheduleResponse } from '@shared/types';
import { getTasksFromStorage, saveTasksToStorage, initializeStorage } from '@shared/utils';

// Initialize storage on first load
initializeStorage();

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { status?: string }>({
      queryFn: async ({ status }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        let tasks = getTasksFromStorage();
        if (status) {
          tasks = tasks.filter(task => task.status === status);
        }
        return { data: tasks };
      },
      providesTags: ['Task'],
    }),
    
    getTask: builder.query<Task, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const tasks = getTasksFromStorage();
        const task = tasks.find(t => t.id === id);
        return task ? { data: task } : { error: 'Task not found' };
      },
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    
    createTask: builder.mutation<Task, Partial<Task>>({
      queryFn: async (taskData) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const tasks = getTasksFromStorage();
        const newTask: Task = {
          id: Date.now().toString(),
          userId: 'user-123',
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Task;
        tasks.unshift(newTask);
        saveTasksToStorage(tasks);
        return { data: newTask };
      },
      invalidatesTags: ['Task'],
    }),
    
    updateTask: builder.mutation<Task, { id: string; task: Partial<Task> }>({
      queryFn: async ({ id, task }) => {
        // Remove delay for instant updates
        const tasks = getTasksFromStorage();
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) return { error: 'Task not found' };
        
        tasks[index] = {
          ...tasks[index],
          ...task,
          updatedAt: new Date().toISOString(),
        };
        saveTasksToStorage(tasks);
        return { data: tasks[index] };
      },
      invalidatesTags: ['Task'], // Invalidate all Task queries for instant refresh
    }),
    
    deleteTask: builder.mutation<void, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const tasks = getTasksFromStorage();
        const filtered = tasks.filter(t => t.id !== id);
        saveTasksToStorage(filtered);
        return { data: undefined };
      },
      invalidatesTags: ['Task'],
    }),
    
    scheduleTask: builder.mutation<AIScheduleResponse, { tasks: Task[] }>({
      queryFn: async ({ tasks }) => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing
        
        // Mock AI scheduling response
        const schedule = tasks.map((task, index) => ({
          taskId: task.id,
          startTime: new Date(Date.now() + (index * 2 * 60 * 60 * 1000)).toISOString(),
          endTime: new Date(Date.now() + ((index + 1) * 2 * 60 * 60 * 1000)).toISOString(),
          priority: task.priority,
        }));
        
        return {
          data: {
            schedule,
            recommendations: [
              'Focus on high-priority tasks in the morning',
              'Take breaks between tasks for better productivity',
              'Consider breaking down large tasks into smaller ones',
            ],
          },
        };
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useScheduleTaskMutation,
} = tasksApi;