import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, CheckSquare } from 'lucide-react';
import { RootState } from '../store';
import { useGetNotesQuery } from '../store/api/notesApi';
import { setSearchQuery, setSelectedNote } from '../store/slices/notesSlice';
import { setShowCreateModal } from '../store/slices/uiSlice';
import { Button, Card, Modal, ListSkeleton } from '@shared/components';
import { Note } from '@shared/types';
import { formatDate } from '@shared/utils';
import NoteEditor from '../components/Notes/NoteEditor';
import QuickTaskCreator from '../components/Notes/QuickTaskCreator';

const NotesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.notes);
  const { showCreateModal } = useSelector((state: RootState) => state.ui);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  
  const { data: notes = [], isLoading, error } = useGetNotesQuery({
    page: 1,
    limit: 20,
    search: searchQuery || undefined,
  });

  const handleCreateNote = () => {
    dispatch(setShowCreateModal(true));
  };

  const handleNoteClick = (note: Note) => {
    dispatch(setSelectedNote(note));
    // In a real app, you might navigate to a detail page
    console.log('Selected note:', note);
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleNoteSaved = (note: Note) => {
    dispatch(setShowCreateModal(false));
    dispatch(setSelectedNote(note));
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Failed to load notes. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={() => setShowTaskCreator(true)}>
            <CheckSquare className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <Button onClick={handleCreateNote}>
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <ListSkeleton items={6} />
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first note to get started
          </p>
          <Button onClick={handleCreateNote}>
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleNoteClick(note)}
            >
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formatDate(note.updatedAt)}
                </p>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                {note.content}
              </p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Note Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => dispatch(setShowCreateModal(false))}
        title="Create New Note"
        size="xl"
      >
        <NoteEditor
          onSave={handleNoteSaved}
          onCancel={() => dispatch(setShowCreateModal(false))}
        />
      </Modal>

      {/* Quick Task Creator Modal */}
      <Modal
        isOpen={showTaskCreator}
        onClose={() => setShowTaskCreator(false)}
        title="Create New Task"
        size="lg"
      >
        <QuickTaskCreator
          onSave={() => setShowTaskCreator(false)}
          onCancel={() => setShowTaskCreator(false)}
        />
      </Modal>
    </div>
  );
};

export default NotesPage;