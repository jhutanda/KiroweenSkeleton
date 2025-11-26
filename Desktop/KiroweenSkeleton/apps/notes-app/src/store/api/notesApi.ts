import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Note, NoteRevision, AISummaryResponse } from '@shared/types';
import { getNotesFromStorage, saveNotesToStorage, initializeStorage } from '@shared/utils';

// Initialize storage on first load
initializeStorage();

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Note', 'NoteRevision'],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], { page?: number; limit?: number; search?: string }>({
      queryFn: async ({ search }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let notes = getNotesFromStorage();
        
        if (search) {
          notes = notes.filter(note => 
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
          );
        }
        
        return { data: notes };
      },
      providesTags: ['Note'],
    }),
    
    getNote: builder.query<Note, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const notes = getNotesFromStorage();
        const note = notes.find(n => n.id === id);
        return note ? { data: note } : { error: 'Note not found' };
      },
      providesTags: (result, error, id) => [{ type: 'Note', id }],
    }),
    
    createNote: builder.mutation<Note, Partial<Note>>({
      queryFn: async (noteData) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const notes = getNotesFromStorage();
        const newNote: Note = {
          id: Date.now().toString(),
          userId: 'user-123',
          title: noteData.title || 'Untitled',
          content: noteData.content || '',
          tags: noteData.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        notes.unshift(newNote);
        saveNotesToStorage(notes);
        return { data: newNote };
      },
      invalidatesTags: ['Note'],
    }),
    
    updateNote: builder.mutation<Note, { id: string; note: Partial<Note> }>({
      queryFn: async ({ id, note: noteData }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const notes = getNotesFromStorage();
        const index = notes.findIndex(n => n.id === id);
        if (index === -1) {
          return { error: 'Note not found' };
        }
        
        const updatedNote = {
          ...notes[index],
          ...noteData,
          updatedAt: new Date().toISOString(),
        };
        
        notes[index] = updatedNote;
        saveNotesToStorage(notes);
        return { data: updatedNote };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Note', id }],
    }),
    
    deleteNote: builder.mutation<void, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const notes = getNotesFromStorage();
        const filtered = notes.filter(n => n.id !== id);
        saveNotesToStorage(filtered);
        return { data: undefined };
      },
      invalidatesTags: ['Note'],
    }),
    
    getNoteRevisions: builder.query<NoteRevision[], string>({
      queryFn: async (noteId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock empty revisions for now
        return { data: [] };
      },
      providesTags: (result, error, noteId) => [{ type: 'NoteRevision', id: noteId }],
    }),
    
    summarizeNote: builder.mutation<AISummaryResponse, { content: string; noteId: string }>({
      queryFn: async ({ content }) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock AI summary
        const mockSummary: AISummaryResponse = {
          summary: `This note discusses ${content.slice(0, 50)}... The main points cover various topics and ideas.`,
          keyPoints: [
            'Key concept from the note content',
            'Important detail mentioned',
            'Main takeaway or conclusion'
          ],
          tags: ['ai-generated', 'summary']
        };
        
        return { data: mockSummary };
      },
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetNoteRevisionsQuery,
  useSummarizeNoteMutation,
} = notesApi;