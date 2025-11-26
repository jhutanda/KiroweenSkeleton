import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus, TaskPriority } from '@shared/types';

interface TasksState {
  selectedTask: Task | null;
  filterStatus: TaskStatus | 'all';
  filterPriority: TaskPriority | 'all';
  sortBy: 'deadline' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  isEditing: boolean;
  showCalendar: boolean;
}

const initialState: TasksState = {
  selectedTask: null,
  filterStatus: 'all',
  filterPriority: 'all',
  sortBy: 'deadline',
  sortOrder: 'asc',
  isEditing: false,
  showCalendar: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
      state.isEditing = false;
    },
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'all'>) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<TaskPriority | 'all'>) => {
      state.filterPriority = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'deadline' | 'priority' | 'createdAt' | 'title'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setShowCalendar: (state, action: PayloadAction<boolean>) => {
      state.showCalendar = action.payload;
    },
    clearFilters: (state) => {
      state.filterStatus = 'all';
      state.filterPriority = 'all';
    },
  },
});

export const {
  setSelectedTask,
  setFilterStatus,
  setFilterPriority,
  setSortBy,
  setSortOrder,
  setIsEditing,
  setShowCalendar,
  clearFilters,
} = tasksSlice.actions;

export default tasksSlice.reducer;