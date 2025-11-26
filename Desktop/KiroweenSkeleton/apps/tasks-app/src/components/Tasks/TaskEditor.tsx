import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Save, Calendar } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@shared/types';
import { Button, Input } from '@shared/components';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../store/api/tasksApi';
import { addNotification } from '../../store/slices/uiSlice';
import { validateTask } from '@shared/utils';

interface TaskEditorProps {
  task?: Task;
  onSave?: (task: Task) => void;
  onCancel?: () => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ task, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'pending');
  const [deadline, setDeadline] = useState(
    task?.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
  );
  const [errors, setErrors] = useState<string[]>([]);

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setDeadline(new Date(task.deadline).toISOString().slice(0, 16));
    }
  }, [task]);

  const handleSave = async () => {
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      deadline: new Date(deadline).toISOString(),
    };

    const validation = validateTask(taskData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    try {
      let savedTask: Task;
      
      if (task?.id) {
        const result = await updateTask({ id: task.id, task: taskData }).unwrap();
        savedTask = result;
        dispatch(addNotification({
          type: 'success',
          message: 'Task updated successfully',
        }));
      } else {
        const result = await createTask(taskData).unwrap();
        savedTask = result;
        dispatch(addNotification({
          type: 'success',
          message: 'Task created successfully',
        }));
      }

      onSave?.(savedTask);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to save task',
      }));
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Priority and Status */}
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
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Deadline */}
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

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <ul className="text-sm text-red-600 dark:text-red-400">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isCreating || isUpdating}
          loading={isCreating || isUpdating}
        >
          <Save className="w-4 h-4 mr-2" />
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </div>
  );
};

export default TaskEditor;