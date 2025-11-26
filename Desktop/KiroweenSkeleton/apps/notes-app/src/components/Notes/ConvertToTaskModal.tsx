import React, { useState } from 'react';
import { CheckSquare, Calendar } from 'lucide-react';
import { Button, Input, Modal } from '@shared/components';
import { Task, TaskPriority } from '@shared/types';
import { getTasksFromStorage, saveTasksToStorage } from '@shared/utils';

interface ConvertToTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteTitle?: string;
  noteContent?: string;
}

const ConvertToTaskModal: React.FC<ConvertToTaskModalProps> = ({
  isOpen,
  onClose,
  noteTitle = '',
  noteContent = '',
}) => {
  const [title, setTitle] = useState(noteTitle);
  const [description, setDescription] = useState(noteContent.substring(0, 200));
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsCreating(true);

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

      // Show success message
      alert('Task created successfully! Check the Tasks app to see it.');
      onClose();
    } catch (error) {
      alert('Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task" size="lg">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-4">
          <CheckSquare className="w-5 h-5" />
          <p className="text-sm">Create a new task that will appear in the Tasks app</p>
        </div>

        {/* Title */}
        <Input
          label="Task Title"
          value={title}
          onChange={setTitle}
          placeholder="Enter task title..."
          required
        />

        {/* Description */}
        <Input
          label="Description"
          type="textarea"
          value={description}
          onChange={setDescription}
          placeholder="Enter task description..."
        />

        {/* Priority and Deadline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 This task will be created in the Tasks app and will appear in the "To Do" column.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} loading={isCreating} disabled={isCreating}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConvertToTaskModal;