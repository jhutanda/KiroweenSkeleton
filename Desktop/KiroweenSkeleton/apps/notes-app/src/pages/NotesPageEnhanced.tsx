import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, Grid, List, FileText, CheckSquare } from 'lucide-react';
import { RootState } from '../store';
import { useGetNotesQuery, useDeleteNoteMutation } from '../store/api/notesApi';
import { setSearchQuery, setSelectedNote } from '../store/slices/notesSlice';
import { setShowCreateModal, addNotification } from '../store/slices/uiSlice';
import { Button, Card, Modal } from '@shared/components';
import { Note } from '@shared/types';
import { formatDate } from '@shared/utils';
import NoteEditor from '../components/Notes/NoteEditor';
import NoteCard from '../components/Notes/NoteCard';
import ConvertToTaskModal from '../components/Notes/ConvertToTaskModal';

const NotesPageEnhanced: React.FC = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.notes);
  const { showCreateModal } = useSelector((state: RootState) => state.ui);
  
  const { data: notes = [], isLoading, error } = useGetNotesQuery({
    page: 1,
    limit: 20,
    search: searchQuery || undefined,
  });

  const [deleteNote] = useDeleteNoteMutation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNote, setSelectedNoteState] = useState<Note | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleCreateNote = () => {
    dispatch(setShowCreateModal(true));
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNoteState(note);
    setShowDetailModal(true);
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleNoteSaved = (note: Note) => {
    dispatch(setShowCreateModal(false));
    dispatch(setSelectedNote(note));
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(noteId).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Note deleted successfully',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete note',
      }));
    }
  };

  const stats = {
    total: notes.length,
    withTags: notes.filter(n => n.tags && n.tags.length > 0).length,
    withSummary: notes.filter(n => n.summary).length,
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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Smart Notes
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize your thoughts with AI-powered insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={handleCreateNote}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Notes</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">With Tags</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{stats.withTags}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="text-xs font-medium text-green-600 dark:text-green-400">AI Summaries</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.withSummary}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="text-xs font-medium text-orange-600 dark:text-orange-400">This Week</div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">
              {notes.filter(n => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(n.createdAt) > weekAgo;
              }).length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notes Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateNote}>
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3 max-w-4xl mx-auto'
          }>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode={viewMode}
                onClick={() => handleNoteClick(note)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
          </div>
        )}
      </div>

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

      {/* Detail Modal */}
      {selectedNote && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Note Details"
          size="xl"
        >
          <NoteEditor
            note={selectedNote}
            onSave={() => setShowDetailModal(false)}
            onCancel={() => setShowDetailModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default NotesPageEnhanced;