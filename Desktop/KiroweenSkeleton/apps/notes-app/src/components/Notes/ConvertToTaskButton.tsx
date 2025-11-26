import React, { useState } from 'react';
import { CheckSquare, Calendar, Flag } from 'lucide-react';
import { Note, Task, TaskPriority } from '@shared/types';
import { Button, Modal, Input } from '@shared/components';
import { getTasksFromStorage, saveTasksToStorage } from '@shared/utils';

interface ConvertToTaskButtonProps {
  note: Note;
  onSuccess?: () => void;
}

const ConvertToTaskButton: React.FC<ConvertToTaskButtonProps> = ({ note, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.content.substring(0, 200));
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleConvert = async () => {
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
      
      setShowModal(false);
      onSuccess?.();
      
      // Show success notification
      alert('✅ Task created successfully! Check the Task Manager to see it.');
    } catch (error) {
      alert('❌ Failed to create task. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40 text-green-700 dark:text-green-300 rounded-lg transition-colors"
        title="Convert to Task"
      >
        <CheckSquare className="w-4 h-4 mr-1.5" />
        Convert to Task
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Convert Note to Task"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 This will create a new task in the Task Manager based on this note.
            </p>
          </div>

          <Input
            label="Task Title"
            value={title}
            onChange={setTitle}
            placeholder="Enter task title..."
            required
          />

          <Input
            label="Description"
            type="textarea"
            value={description}
            onChange={setDescription}
            placeholder="Enter task description..."
          />

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

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConvert}
              disabled={isCreating || !title.trim()}
              loading={isCreating}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConvertToTaskButton;