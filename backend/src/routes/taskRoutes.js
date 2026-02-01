/**
 * Task Routes
 * Defines all routes for task CRUD operations
 */

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { validateTask } = require('../middleware/validationMiddleware');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// All routes are public by default, use protect() to make them private

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filtering and pagination
 * @access  Public
 * @query   status - Filter by task status (pending, in-progress, completed)
 * @query   search - Search term for title/description
 * @query   page - Page number for pagination (default: 1)
 * @query   limit - Items per page (default: 10)
 */
router.get(
  '/',
  optionalAuth,
  validateTask.filter,
  taskController.getTasks
);

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics (count by status)
 * @access  Public
 */
router.get('/stats', taskController.getTaskStats);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Public
 */
router.get(
  '/:id',
  optionalAuth,
  validateTask.byId,
  taskController.getTask
);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Public
 * @body    title (required), description (optional), status (optional)
 */
router.post(
  '/',
  optionalAuth,
  validateTask.create,
  taskController.createTask
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task by ID
 * @access  Public
 * @body    title (optional), description (optional), status (optional)
 */
router.put(
  '/:id',
  optionalAuth,
  validateTask.update,
  taskController.updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task by ID
 * @access  Public
 */
router.delete(
  '/:id',
  optionalAuth,
  validateTask.byId,
  taskController.deleteTask
);

module.exports = router;
