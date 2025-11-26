import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Save, Calendar, Flag } from 'lucide-react';
import { Task, TaskPriority } from '@shared/types';
import { Button, Input } from '@shared/components';
import { getTasksFromStorage, saveTasksToStorage } from '@shared/utils';
import { addNotification } from '../../store/slices/uiSlice';

interface QuickTaskCreatorProps {
  onSave?: () => void;
  onCancel?: () => void;
}

const QuickTaskCreator: React.FC<QuickTaskCreatorProps> = ({ onSave, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16) // Tomorrow
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Task title is required',
      }));
      return;
    }

    setIsLoading(true);

    try {
      const tasks = getTasksFromStorage();
      const newTask: Task = {
        id: Date.now().toString(),
        userId: 'user-123',
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
        priority,
        deadline: new Date(deadline).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      tasks.unshift(newTask);
      saveTasksToStorage(tasks);

      dispatch(addNotification({
        type: 'success',
        message: 'Task created successfully! View it in the Task Manager.',
      }));

      onSave?.();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create task',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Quick Tip:</strong> Tasks created here will appear in the Task Manager app instantly!
        </p>
      </div>

      {/* Title */}
      <Input
        label="Task Title"
        value={title}
        onChange={setTitle}
        placeholder="What needs to be done?"
        required
      />

      {/* Description */}
      <Input
        label="Description"
        type="textarea"
        value={description}
        onChange={setDescription}
        placeholder="Add more details..."
      />

      {/* Priority and Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Flag className="w-4 h-4 inline mr-1" />
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Deadline
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isLoading}
          loading={isLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>
    </div>
  );
};

export default QuickTaskCreator;