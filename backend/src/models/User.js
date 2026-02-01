/**
 * User Model
 * Defines the schema for user documents in MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema Definition
 */
const userSchema = new mongoose.Schema(
  {
    // User name - required field
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    // User email - required, unique field
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    // User password - required field (will be hashed)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
  },
  {
    // Enable timestamps
    timestamps: true,
  }
);

/**
 * Indexes for better query performance
 */
userSchema.index({ email: 1 }, { unique: true });

/**
 * Pre-save middleware to hash password before saving
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare password
 * @param {string} enteredPassword - The password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance method to generate JWT token
 * @returns {string} - JWT token
 */
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  return token;
};

/**
 * Instance method to get user info (without password)
 * @returns {Object} - User object without password
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.password;
  return user;
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
