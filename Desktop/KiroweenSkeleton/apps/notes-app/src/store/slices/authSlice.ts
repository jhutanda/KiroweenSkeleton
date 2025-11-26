import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@shared/types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      if (state.user) {
        state.user.theme = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setUser,
  clearUser,
  setError,
  clearError,
  updateUserTheme,
} = authSlice.actions;

export default authSlice.reducer;