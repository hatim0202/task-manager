/**
 * TaskCard Component
 * Displays a single task in a beautiful card format
 */

import { useState } from 'react';
import { useTask } from '../context/TaskContext';

/**
 * Status badge configuration with icons
 */
const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'badge-pending',
    icon: (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  'in-progress': {
    label: 'In Progress',
    className: 'badge-in-progress',
    icon: (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  completed: {
    label: 'Completed',
    className: 'badge-completed',
    icon: (
      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

/**
 * Format date helper function
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * TaskCard Component
 */
const TaskCard = ({ task, onEdit, onDelete }) => {
  const { updateTask, loading } = useTask();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get status configuration
  const statusInfo = statusConfig[task.status] || statusConfig.pending;

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await updateTask(task.id, { status: newStatus });
    setIsUpdating(false);
  };

  // Status change options
  const statusOptions = ['pending', 'in-progress', 'completed'];

  return (
    <div className="card group relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${
        task.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500' :
        task.status === 'in-progress' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
        'bg-gradient-to-r from-yellow-400 to-yellow-500'
      }`} />

      {/* Task Header */}
      <div className="flex items-start justify-between mb-3 pt-2">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {task.title}
        </h3>
        <span className={`${statusInfo.className} flex-shrink-0 ml-2`}>
          {statusInfo.icon}
          {statusInfo.label}
        </span>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Task Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Created {formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Status Dropdown */}
        <div className="relative group/status">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating || loading}
            className="text-xs border-0 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 pr-8 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer 
                       transition-all duration-200 font-medium text-gray-700 disabled:opacity-50"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 
                     bg-primary-50 hover:bg-primary-100 rounded-lg transition-all duration-200
                     disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 
                     bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200
                     disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
