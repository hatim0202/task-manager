/**
 * Task Context
 * Global state management for tasks and authentication
 */

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { taskApi, authApi } from '../services/api';

// Create context
const TaskContext = createContext();

// Initial state
const initialState = {
  // Task state
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  // Auth state
  user: null,
  isAuthenticated: false,
  authLoading: true,
};

// Action types
const ActionTypes = {
  // Task actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TASKS: 'SET_TASKS',
  SET_CURRENT_TASK: 'SET_CURRENT_TASK',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  // Auth actions
  SET_USER: 'SET_USER',
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',
  LOGOUT: 'LOGOUT',
};

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    // Task actions
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ActionTypes.SET_TASKS:
      return { 
        ...state, 
        tasks: action.payload.data,
        pagination: {
          ...state.pagination,
          total: action.payload.total,
          pages: action.payload.pages,
        },
      };
    
    case ActionTypes.SET_CURRENT_TASK:
      return { ...state, currentTask: action.payload };
    
    case ActionTypes.ADD_TASK:
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };
    
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      };
    
    case ActionTypes.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }, // Reset to page 1 on filter change
      };
    
    case ActionTypes.SET_PAGINATION:
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload },
      };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    // Auth actions
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        authLoading: false,
      };
    
    case ActionTypes.SET_AUTH_LOADING:
      return { ...state, authLoading: action.payload };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        authLoading: false,
      };
    
    default:
      return state;
  }
};

/**
 * Task Provider Component
 * Wraps the app and provides task context
 */
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getMe();
          dispatch({ type: ActionTypes.SET_USER, payload: response.data.data });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: ActionTypes.SET_USER, payload: null });
        }
      } else {
        dispatch({ type: ActionTypes.SET_USER, payload: null });
      }
    };

    checkAuth();
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const params = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...state.filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await taskApi.getTasks(params);
      dispatch({ 
        type: ActionTypes.SET_TASKS, 
        payload: {
          data: response.data.data,
          total: response.data.total,
          pages: response.data.pages,
        },
      });
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch tasks' 
      });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, [state.pagination.page, state.pagination.limit, state.filters]);

  // Fetch single task
  const fetchTask = useCallback(async (id) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const response = await taskApi.getTask(id);
      dispatch({ type: ActionTypes.SET_CURRENT_TASK, payload: response.data.data });
      return response.data.data;
    } catch (error) {
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch task' 
      });
      return null;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // Create task
  const createTask = async (taskData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const response = await taskApi.createTask(taskData);
      dispatch({ type: ActionTypes.ADD_TASK, payload: response.data.data });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
      return { success: false, error: message };
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const response = await taskApi.updateTask(id, taskData);
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: response.data.data });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
      return { success: false, error: message };
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      await taskApi.deleteTask(id);
      dispatch({ type: ActionTypes.DELETE_TASK, payload: id });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
      return { success: false, error: message };
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  };

  // Set pagination
  const setPagination = (pagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Login
  const login = async (credentials) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: ActionTypes.SET_USER, payload: user });
      return { success: true, data: user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
      return { success: false, error: message };
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Register
  const register = async (userData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: ActionTypes.SET_USER, payload: user });
      return { success: true, data: user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: ActionTypes.SET_ERROR, payload: message });
      return { success: false, error: message };
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.LOGOUT });
  };

  // Context value
  const value = {
    // State
    tasks: state.tasks,
    currentTask: state.currentTask,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    authLoading: state.authLoading,
    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    setPagination,
    clearError,
    login,
    register,
    logout,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Custom hook to use Task Context
 */
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
