import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Edit, Trash2, Calendar, Clock, Flag, CheckCircle2 } from 'lucide-react';
import { Task } from '@shared/types';
import { Button, Modal } from '@shared/components';
import { useUpdateTaskMutation, useDeleteTaskMutation } from '../../store/api/tasksApi';
import { addNotification } from '../../store/slices/uiSlice';
import { setSelectedTask, setIsEditing } from '../../store/slices/tasksSlice';
import { formatDateTime, isOverdue } from '@shared/utils';
import TaskEditor from './TaskEditor';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch();
  const [isEditing, setEditingState] = useState(false);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleEdit = () => {
    setEditingState(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(task.id).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Task deleted successfully',
      }));
      onClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete task',
      }));
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await updateTask({
        id: task.id,
        task: { status: newStatus },
      }).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: 'Task status updated',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update task',
      }));
    }
  };

  const handleSave = () => {
    setEditingState(false);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (isEditing) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="lg">
        <TaskEditor
          task={task}
          onSave={handleSave}
          onCancel={() => setEditingState(false)}
        />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor()}`}>
                <Flag className="w-3 h-3 inline mr-1" />
                {task.priority.toUpperCase()} PRIORITY
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                {task.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Deadline */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Deadline
          </h3>
          <p className={`text-sm font-medium ${
            isOverdue(task.deadline) && task.status !== 'completed'
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {formatDateTime(task.deadline)}
            {isOverdue(task.deadline) && task.status !== 'completed' && (
              <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                OVERDUE
              </span>
            )}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Created
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDateTime(task.createdAt)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Last Updated
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDateTime(task.updatedAt)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Quick Status Change
          </h3>
          <div className="flex space-x-2">
            <Button
              variant={task.status === 'pending' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleStatusChange('pending')}
              disabled={task.status === 'pending'}
            >
              To Do
            </Button>
            <Button
              variant={task.status === 'in-progress' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleStatusChange('in-progress')}
              disabled={task.status === 'in-progress'}
            >
              In Progress
            </Button>
            <Button
              variant={task.status === 'completed' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleStatusChange('completed')}
              disabled={task.status === 'completed'}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;