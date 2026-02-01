/**
 * Auth Routes
 * Defines all routes for user authentication
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateUser } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 * @body    name (required), email (required), password (required)
 */
router.post(
  '/register',
  validateUser.register,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    email (required), password (required)
 */
router.post(
  '/login',
  validateUser.login,
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get(
  '/me',
  protect,
  authController.getMe
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  protect,
  authController.logout
);

module.exports = router;
