/**
 * Validation Middleware
 * Provides request validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');
const { ApiError } = require('./errorMiddleware');

/**
 * Handle validation results
 * Checks if validation passed, throws error if not
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));
    throw new ApiError(400, 'Validation failed', formattedErrors);
  }
  next();
};

/**
 * Task validation rules
 */
const validateTask = {
  // Validation for creating a task
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed'),
    handleValidation,
  ],

  // Validation for updating a task
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid task ID format'),
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Task title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed'),
    handleValidation,
  ],

  // Validation for task ID parameter
  byId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid task ID format'),
    handleValidation,
  ],

  // Validation for filtering tasks
  filter: [
    query('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed'),
    query('search')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Search term cannot exceed 100 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidation,
  ],
};

/**
 * User validation rules
 */
const validateUser = {
  // Validation for user registration
  register: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    handleValidation,
  ],

  // Validation for user login
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidation,
  ],
};

module.exports = {
  validateTask,
  validateUser,
  handleValidation,
};
