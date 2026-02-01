/**
 * Home Page
 * Beautiful task list page with aesthetic design
 */

import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { TaskCard, TaskFilters, Modal, TaskForm, Toast } from '../components';

/**
 * Home Page Component
 */
const Home = () => {
  const {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTask();

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
      clearError();
    }
  }, [error, clearError]);

  // Handle add task
  const handleAddTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setIsAddModalOpen(false);
      setToast({ message: 'Task created successfully!', type: 'success' });
    }
  };

  // Handle edit task
  const handleEditTask = async (taskData) => {
    const result = await updateTask(selectedTask.id, taskData);
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedTask(null);
      setToast({ message: 'Task updated successfully!', type: 'success' });
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      setToast({ message: 'Task deleted successfully!', type: 'success' });
    }
  };

  // Open edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    pagination.page = newPage;
    fetchTasks();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                My Tasks
              </h1>
              <p className="text-primary-100 text-lg">
                Organize and track your progress beautifully
              </p>
            </div>
            
            {/* Add Task Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Task
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">{pagination.total}</div>
              <div className="text-primary-200 text-sm">Total Tasks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">
                {tasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-primary-200 text-sm">Pending</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-primary-200 text-sm">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
        {/* Filters */}
        <TaskFilters />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Get started by creating your first task and begin your productivity journey
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Task
            </button>
          </div>
        )}

        {/* Task Grid */}
        {!loading && tasks.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-float"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TaskCard
                    task={task}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 font-medium">
                  {pagination.page} / {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setIsAddModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
      >
        <TaskForm
          initialData={selectedTask}
          onSubmit={handleEditTask}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        title="Delete Task"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-800">"{selectedTask?.title}"</span>?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTask(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteTask(selectedTask?.id)}
              className="btn-danger"
            >
              Delete Task
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Home;
