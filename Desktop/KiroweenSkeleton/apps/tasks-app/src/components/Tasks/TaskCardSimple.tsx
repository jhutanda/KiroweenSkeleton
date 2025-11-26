import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, Edit, Trash2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Task, TaskStatus } from '@shared/types';
import { formatDate, isOverdue, isTomorrow } from '@shared/utils';

interface TaskCardSimpleProps {
  task: Task;
  onClick: () => void;
  onMove: (task: Task, newStatus: TaskStatus) => void;
  currentStatus: TaskStatus;
}

const TaskCardSimple: React.FC<TaskCardSimpleProps> = ({ task, onClick, onMove, currentStatus }) => {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/80 to-white dark:from-red-900/10 dark:to-gray-800';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50/80 to-white dark:from-yellow-900/10 dark:to-gray-800';
      default:
        return 'border-l-4 border-l-gray-400 bg-white dark:bg-gray-800';
    }
  };

  const getPriorityBadge = () => {
    const colors = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[task.priority]}`}>
        {task.priority.toUpperCase()}
      </span>
    );
  };

  const getDeadlineInfo = () => {
    const overdue = isOverdue(task.deadline) && task.status !== 'completed';
    const tomorrow = isTomorrow(task.deadline);
    
    if (overdue) {
      return (
        <div className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </div>
      );
    }
    
    if (tomorrow) {
      return (
        <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 font-medium">
          <Clock className="w-3 h-3 mr-1" />
          Tomorrow
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
        <Calendar className="w-3 h-3 mr-1" />
        {formatDate(task.deadline)}
      </div>
    );
  };

  const getMoveButtons = () => {
    const buttons = [];
    
    if (currentStatus === 'pending') {
      buttons.push(
        <button
          key="start"
          onClick={(e) => {
            e.stopPropagation();
            onMove(task, 'in-progress');
          }}
          className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors group"
          title="Start task"
        >
          <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        </button>
      );
    }
    
    if (currentStatus === 'in-progress') {
      buttons.push(
        <button
          key="back"
          onClick={(e) => {
            e.stopPropagation();
            onMove(task, 'pending');
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Move to To Do"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        </button>,
        <button
          key="complete"
          onClick={(e) => {
            e.stopPropagation();
            onMove(task, 'completed');
          }}
          className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
          title="Complete task"
        >
          <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        </button>
      );
    }
    
    if (currentStatus === 'completed') {
      buttons.push(
        <button
          key="reopen"
          onClick={(e) => {
            e.stopPropagation();
            onMove(task, 'in-progress');
          }}
          className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
          title="Reopen task"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`
        ${getPriorityColor()}
        rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
      `}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
              {task.title}
            </h4>
            {getPriorityBadge()}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          {getDeadlineInfo()}
          
          <div className="flex items-center space-x-1">
            {getMoveButtons()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCardSimple;