import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  showCreateModal: boolean;
  showDeleteModal: boolean;
  showSummaryModal: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
}

const initialState: UiState = {
  theme: 'light',
  sidebarCollapsed: false,
  showCreateModal: false,
  showDeleteModal: false,
  showSummaryModal: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setShowCreateModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateModal = action.payload;
    },
    setShowDeleteModal: (state, action: PayloadAction<boolean>) => {
      state.showDeleteModal = action.payload;
    },
    setShowSummaryModal: (state, action: PayloadAction<boolean>) => {
      state.showSummaryModal = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setShowCreateModal,
  setShowDeleteModal,
  setShowSummaryModal,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;