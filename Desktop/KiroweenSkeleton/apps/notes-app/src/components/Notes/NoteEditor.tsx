import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Save, Sparkles, Eye, Edit3 } from 'lucide-react';
import { Note } from '@shared/types';
import { Button, Input } from '@shared/components';
import { useCreateNoteMutation, useUpdateNoteMutation, useSummarizeNoteMutation } from '../../store/api/notesApi';
import { addNotification } from '../../store/slices/uiSlice';
import { validateNote } from '@shared/utils';
import RichTextEditor from './RichTextEditor';
import ConvertToTaskButton from './ConvertToTaskButton';

interface NoteEditorProps {
  note?: Note;
  onSave?: (note: Note) => void;
  onCancel?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [summarizeNote, { isLoading: isSummarizing }] = useSummarizeNoteMutation();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags?.join(', ') || '');
    }
  }, [note]);

  const handleSave = async () => {
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    const validation = validateNote(noteData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    try {
      let savedNote: Note;
      
      if (note?.id) {
        const result = await updateNote({ id: note.id, note: noteData }).unwrap();
        savedNote = result;
        dispatch(addNotification({
          type: 'success',
          message: 'Note updated successfully',
        }));
      } else {
        const result = await createNote(noteData).unwrap();
        savedNote = result;
        dispatch(addNotification({
          type: 'success',
          message: 'Note created successfully',
        }));
      }

      onSave?.(savedNote);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to save note',
      }));
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Please add content to summarize',
      }));
      return;
    }

    try {
      const result = await summarizeNote({
        content: content.trim(),
        noteId: note?.id || 'new',
      }).unwrap();

      dispatch(addNotification({
        type: 'success',
        message: 'Note summarized successfully',
      }));

      // You could show the summary in a modal or update the note
      console.log('Summary:', result);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to summarize note',
      }));
    }
  };

  const renderPreview = () => {
    // Simple markdown-like preview
    const lines = content.split('\n');
    return (
      <div className="prose dark:prose-invert max-w-none">
        {lines.map((line, index) => {
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-2xl font-bold mb-2">{line.slice(2)}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-semibold mb-2">{line.slice(3)}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-medium mb-2">{line.slice(4)}</h3>;
          }
          if (line.trim() === '') {
            return <br key={index} />;
          }
          return <p key={index} className="mb-2">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {note ? 'Edit Note' : 'Create Note'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {note && <ConvertToTaskButton note={note} />}
            <Button
              onClick={handleSummarize}
              variant="secondary"
              disabled={isSummarizing || !content.trim()}
              loading={isSummarizing}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Summarize
            </Button>
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              loading={isCreating || isUpdating}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Title Input */}
        <Input
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Enter note title..."
          required
        />

        {/* Tags Input */}
        <div className="mt-4">
          <Input
            label="Tags"
            value={tags}
            onChange={setTags}
            placeholder="Enter tags separated by commas..."
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <ul className="text-sm text-red-600 dark:text-red-400">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {isPreview ? (
          <div className="h-full overflow-auto prose dark:prose-invert max-w-none">
            {renderPreview()}
          </div>
        ) : (
          <div className="h-full">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your note with rich formatting..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;