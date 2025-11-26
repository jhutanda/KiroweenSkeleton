import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, Edit, Trash2, GripVertical } from 'lucide-react';
import { Task } from '@shared/types';
import { formatDate, isOverdue, isTomorrow } from '@shared/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isDragging, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
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

  const cardContent = (
    <div
      className={`
        ${getPriorityColor()}
        rounded-lg shadow-sm hover:shadow-md transition-all duration-200
        ${isDragging || isSortableDragging ? 'opacity-50 shadow-lg' : ''}
        ${onClick ? 'cursor-pointer' : ''}
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
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
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
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Edit task"
              >
                <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isDragging) {
    return cardContent;
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {cardContent}
    </motion.div>
  );
};

export default TaskCard;