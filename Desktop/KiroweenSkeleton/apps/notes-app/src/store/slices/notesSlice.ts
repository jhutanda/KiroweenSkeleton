import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '@shared/types';

interface NotesState {
  selectedNote: Note | null;
  searchQuery: string;
  filterTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  isEditing: boolean;
  showRevisions: boolean;
}

const initialState: NotesState = {
  selectedNote: null,
  searchQuery: '',
  filterTags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  isEditing: false,
  showRevisions: false,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSelectedNote: (state, action: PayloadAction<Note | null>) => {
      state.selectedNote = action.payload;
      state.isEditing = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterTags: (state, action: PayloadAction<string[]>) => {
      state.filterTags = action.payload;
    },
    addFilterTag: (state, action: PayloadAction<string>) => {
      if (!state.filterTags.includes(action.payload)) {
        state.filterTags.push(action.payload);
      }
    },
    removeFilterTag: (state, action: PayloadAction<string>) => {
      state.filterTags = state.filterTags.filter(tag => tag !== action.payload);
    },
    setSortBy: (state, action: PayloadAction<'createdAt' | 'updatedAt' | 'title'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setShowRevisions: (state, action: PayloadAction<boolean>) => {
      state.showRevisions = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.filterTags = [];
    },
  },
});

export const {
  setSelectedNote,
  setSearchQuery,
  setFilterTags,
  addFilterTag,
  removeFilterTag,
  setSortBy,
  setSortOrder,
  setIsEditing,
  setShowRevisions,
  clearFilters,
} = notesSlice.actions;

export default notesSlice.reducer;