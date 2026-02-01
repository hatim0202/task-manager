/**
 * Task Controller
 * Handles all task-related operations
 */

const Task = require('../models/Task');
const { ApiError } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Public
 */
const getTasks = async (req, res, next) => {
  try {
    // Build filter object
    const filter = {};

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search in title and description if search term provided
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = async (req, res, next) => {
  try {
    // Create task object
    const taskData = {
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'pending',
    };

    // Add user ID if authenticated
    if (req.user) {
      taskData.user = req.user._id;
    }

    // Create task
    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    // Build update object
    const updateData = {};
    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    // Find and update task
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics
 * @route   GET /api/tasks/stats
 * @access  Public
 */
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        pending: stats.find((s) => s._id === 'pending')?.count || 0,
        'in-progress': stats.find((s) => s._id === 'in-progress')?.count || 0,
        completed: stats.find((s) => s._id === 'completed')?.count || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
