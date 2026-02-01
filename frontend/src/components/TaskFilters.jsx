/**
 * TaskFilters Component
 * Beautiful filter and search controls
 */

import { useTask } from '../context/TaskContext';

/**
 * TaskFilters Component
 */
const TaskFilters = () => {
  const { filters, setFilters, setPagination, fetchTasks } = useTask();

  // Handle status filter change
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setFilters({ status });
    setPagination({ page: 1 }); // Reset to first page
    fetchTasks();
  };

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const search = e.target.value;
    setFilters({ search });
  };

  // Handle search submit (for Enter key)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchTasks();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ status: '', search: '' });
    setPagination({ page: 1 });
    fetchTasks();
  };

  // Check if any filters are active
  const hasActiveFilters = filters.status !== '' || filters.search !== '';

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              className="input pl-12"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="input pl-12 appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
