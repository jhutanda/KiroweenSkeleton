import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Calendar, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { RootState } from '../store';
import { useGetTasksQuery, useUpdateTaskMutation } from '../store/api/tasksApi';
import { setSelectedTask } from '../store/slices/tasksSlice';
import { setShowCreateModal, setShowScheduleModal, addNotification } from '../store/slices/uiSlice';
import { Button, Modal } from '@shared/components';
import { Task, TaskStatus } from '@shared/types';
import TaskCardSimple from '../components/Tasks/TaskCardSimple';
import TaskEditor from '../components/Tasks/TaskEditor';
import TaskDetailModal from '../components/Tasks/TaskDetailModal';

const columns: { id: TaskStatus; title: string; color: string; bgColor: string }[] = [
  { 
    id: 'pending', 
    title: 'To Do', 
    color: 'border-gray-300 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800/50'
  },
  { 
    id: 'in-progress', 
    title: 'In Progress', 
    color: 'border-blue-400 dark:border-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  { 
    id: 'completed', 
    title: 'Completed', 
    color: 'border-green-400 dark:border-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
];

const TasksPageSimple: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedTask } = useSelector((state: RootState) => state.tasks);
  const { showCreateModal, showScheduleModal } = useSelector((state: RootState) => state.ui);
  
  const { data: allTasks = [], isLoading } = useGetTasksQuery({});
  const [updateTask] = useUpdateTaskMutation();
  
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getTasksByStatus = (status: TaskStatus) => {
    return allTasks.filter(task => task.status === status);
  };

  const handleMoveTask = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;
    
    try {
      await updateTask({
        id: task.id,
        task: { status: newStatus },
      }).unwrap();
      
      dispatch(addNotification({
        type: 'success',
        message: `Task moved to ${columns.find(c => c.id === newStatus)?.title}`,
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update task',
      }));
    }
  };

  const handleTaskClick = (task: Task) => {
    dispatch(setSelectedTask(task));
    setShowDetailModal(true);
  };

  const handleCreateTask = () => {
    dispatch(setShowCreateModal(true));
  };

  const handleScheduleTasks = () => {
    dispatch(setShowScheduleModal(true));
  };

  const handleTaskSaved = (task: Task) => {
    dispatch(setShowCreateModal(false));
    dispatch(setSelectedTask(task));
  };

  const stats = {
    total: allTasks.length,
    pending: getTasksByStatus('pending').length,
    inProgress: getTasksByStatus('in-progress').length,
    completed: getTasksByStatus('completed').length,
    completionRate: allTasks.length > 0 
      ? Math.round((getTasksByStatus('completed').length / allTasks.length) * 100)
      : 0,
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Task Board
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your tasks efficiently
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleScheduleTasks}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Schedule
            </Button>
            <Button onClick={handleCreateTask}>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Tasks</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">To Do</div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-1">{stats.pending}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">In Progress</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.inProgress}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="text-xs font-medium text-green-600 dark:text-green-400">Completed</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.completed}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Completion</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{stats.completionRate}%</div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((column) => {
            const tasks = getTasksByStatus(column.id);
            
            return (
              <div key={column.id} className="flex-1 min-w-[320px] flex flex-col">
                {/* Column Header */}
                <div className={`${column.bgColor} rounded-t-lg px-4 py-3 border-b-2 ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      {column.title}
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {tasks.length}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Tasks List */}
                <div className={`flex-1 ${column.bgColor} rounded-b-lg p-4 space-y-3 overflow-y-auto min-h-[400px]`}>
                  {tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tasks here
                      </p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <TaskCardSimple
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        onMove={handleMoveTask}
                        currentStatus={column.id}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
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

      {selectedTask && (
        <TaskDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          task={selectedTask}
        />
      )}

      <Modal
        isOpen={showScheduleModal}
        onClose={() => dispatch(setShowScheduleModal(false))}
        title="AI Task Scheduling"
        size="lg"
      >
        <div className="text-center py-8">
          <Sparkles className="w-16 h-16 mx-auto text-blue-500 mb-4" />
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

export default TasksPageSimple;