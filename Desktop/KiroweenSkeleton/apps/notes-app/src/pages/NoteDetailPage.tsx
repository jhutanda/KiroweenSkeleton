import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { RootState } from '../store';
import { useGetNoteQuery, useDeleteNoteMutation } from '../store/api/notesApi';
import { setIsEditing } from '../store/slices/notesSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Button, Card, LoadingSkeleton } from '@shared/components';
import { formatDateTime } from '@shared/utils';
import NoteEditor from '../components/Notes/NoteEditor';

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isEditing } = useSelector((state: RootState) => state.notes);
  const { data: note, isLoading, error } = useGetNoteQuery(id!);
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const handleEdit = () => {
    dispatch(setIsEditing(true));
  };

  const handleDelete = async () => {
    if (!note || !window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(note.id).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Note deleted successfully',
      }));
      navigate('/notes');
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete note',
      }));
    }
  };

  const handleSave = () => {
    dispatch(setIsEditing(false));
  };

  const handleCancel = () => {
    dispatch(setIsEditing(false));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton variant="card" className="mb-4" />
        <LoadingSkeleton variant="text" className="mb-2" />
        <LoadingSkeleton variant="text" className="mb-2" />
        <LoadingSkeleton variant="text" width="60%" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Note not found or failed to load.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/notes')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="h-full">
        <NoteEditor
          note={note}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/notes')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Note Content */}
      <Card>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {note.title}
          </h1>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
            <span>Created: {formatDateTime(note.createdAt)}</span>
            <span>Updated: {formatDateTime(note.updatedAt)}</span>
          </div>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {note.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-semibold mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-lg font-medium mb-2">{line.slice(4)}</h3>;
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return <p key={index} className="mb-3">{line}</p>;
          })}
        </div>

        {note.summary && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              AI Summary
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              {note.summary}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NoteDetailPage;