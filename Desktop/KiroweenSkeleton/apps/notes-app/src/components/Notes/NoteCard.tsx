import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Tag, Calendar, Sparkles, Edit, Trash2, CheckSquare } from 'lucide-react';
import { Note, Task } from '@shared/types';
import { formatDate, getTasksFromStorage, saveTasksToStorage } from '@shared/utils';

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onDelete: () => void;
  onConvertToTask?: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode, onClick, onDelete }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const truncateContent = (content: string, maxLength: number) => {
    const plainText = content.replace(/[#*`\n]/g, ' ').trim();
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingTask(true);

    try {
      // Get existing tasks
      const existingTasks = getTasksFromStorage();

      // Create new task from note
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: note.userId,
        title: note.title,
        description: truncateContent(note.content, 200),
        status: 'pending',
        priority: 'medium',
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add new task to storage
      const updatedTasks = [...existingTasks, newTask];
      saveTasksToStorage(updatedTasks);

      // Show success feedback and open tasks app
      setTimeout(() => {
        setIsAddingTask(false);
        // Open tasks app in new tab
        window.open('http://localhost:5174', '_blank');
      }, 500);
    } catch (error) {
      console.error('Error creating task:', error);
      setIsAddingTask(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={onClick}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                {truncateContent(note.content, 100)}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(note.updatedAt)}
                </span>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                    )}
                  </div>
                )}
                {note.summary && (
                  <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Summary
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit note"
            >
              <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Color Bar */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {note.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(note.updatedAt)}
            </p>
          </div>
          {note.summary && (
            <div className="flex-shrink-0 ml-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          )}
        </div>

        {/* Content Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 min-h-[60px]">
          {truncateContent(note.content, 120)}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Edit note"
            >
              <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </button>
          </div>
          
          <button
            onClick={handleAddTask}
            disabled={isAddingTask}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center space-x-1 transition-colors disabled:opacity-50"
            title="Convert to task"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{isAddingTask ? 'Adding...' : 'add task'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;