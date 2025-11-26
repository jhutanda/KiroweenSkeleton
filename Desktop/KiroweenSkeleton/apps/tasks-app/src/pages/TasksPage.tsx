import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Calendar, Filter } from 'lucide-react';
import { RootState } from '../store';
import { useGetTasksQuery } from '../store/api/tasksApi';
import { setFilterStatus, setSelectedTask } from '../store/slices/tasksSlice';
import { setShowCreateModal, setShowScheduleModal } from '../store/slices/uiSlice';
import { Button, Card, Modal, ListSkeleton } from '@shared/components';
import { Task, TaskStatus } from '@shared/types';
import { formatDate, isOverdue } from '@shared/utils';
import TaskEditor from '../components/Tasks/TaskEditor';

const TasksPage: React.FC = () => {
  const dispatch = useDispatch();
  const { filterStatus } = useSelector((state: RootState) => state.tasks);
  const { showCreateModal, showScheduleModal } = useSelector((state: RootState) => state.ui);
  
  const { data: tasks = [], isLoading, error, refetch } = useGetTasksQuery({
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  // Auto-refresh when tasks are added from notes-app
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kiroween_tasks' || e.type === 'storage') {
        refetch();
      }
    };

    // Listen for storage events from other tabs/apps
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom storage events from same tab
    const handleCustomStorage = () => {
      refetch();
    };
    window.addEventListener('storage', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorage);
    };
  }, [refetch]);

  const handleCreateTask = () => {
    dispatch(setShowCreateModal(true));
  };

  const handleScheduleTasks = () => {
    dispatch(setShowScheduleModal(true));
  };

  const handleTaskClick = (task: Task) => {
    dispatch(setSelectedTask(task));
  };

  const handleFilterChange = (status: TaskStatus | 'all') => {
    dispatch(setFilterStatus(status));
  };

  const handleTaskSaved = (task: Task) => {
    dispatch(setShowCreateModal(false));
    dispatch(setSelectedTask(task));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Failed to load tasks. Please try again.
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
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleScheduleTasks}>
            <Calendar className="w-4 h-4 mr-2" />
            AI Schedule
          </Button>
          <Button onClick={handleCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filterStatus === status
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      {isLoading ? (
        <ListSkeleton items={6} />
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first task to get started
          </p>
          <Button onClick={handleCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTaskClick(task)}
            >
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <p className={`text-sm ${
                    isOverdue(task.deadline) && task.status !== 'completed'
                      ? 'text-red-600 dark:text-red-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {formatDate(task.deadline)}
                  </p>
                </div>
              </div>
              
              {task.description && (
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {task.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => dispatch(setShowCreateModal(false))}
        title="Create New Task"
        size="lg"
      >
        <TaskEditor
          onSave={handleTaskSaved}
          onCancel={() => dispatch(setShowCreateModal(false))}
        />
      </Modal>

      {/* AI Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => dispatch(setShowScheduleModal(false))}
        title="AI Task Scheduling"
        size="lg"
      >
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            AI Scheduling Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This feature will analyze your tasks and create an optimized schedule based on priorities and deadlines.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;