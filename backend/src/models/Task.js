/**
 * Task Model
 * Defines the schema for task documents in MongoDB
 */

const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Task Schema Definition
 */
const taskSchema = new mongoose.Schema(
  {
    // Task title - required field
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    // Task description - optional field
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    // Task status - enum with predefined values
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be one of: pending, in-progress, completed',
      },
      default: 'pending',
      index: true,
    },
    // Reference to User model (for future authentication integration)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    // Enable timestamps for createdAt and updatedAt
    timestamps: true,
    // Convert to JSON with virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for better query performance
 */
taskSchema.index({ createdAt: -1 });
taskSchema.index({ status: 1, createdAt: -1 });

/**
 * Virtual for formatted status
 */
taskSchema.virtual('formattedStatus').get(function () {
  const statusMap = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };
  return statusMap[this.status] || this.status;
});

/**
 * Pre-save middleware to validate and format data
 */
taskSchema.pre('save', function (next) {
  // Trim title and description
  if (this.isModified('title')) {
    this.title = this.title.trim();
  }
  if (this.isModified('description')) {
    this.description = this.description.trim();
  }
  next();
});

/**
 * Static method to find tasks by user
 */
taskSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Static method to find tasks by status
 */
taskSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

/**
 * Instance method to check if task is completed
 */
taskSchema.methods.isCompleted = function () {
  return this.status === 'completed';
};

/**
 * Instance method to check if task is pending
 */
taskSchema.methods.isPending = function () {
  return this.status === 'pending';
};

/**
 * Transform method for JSON output
 */
taskSchema.methods.toJSON = function () {
  const task = this.toObject();
  task.id = task._id;
  delete task._id;
  delete task.__v;
  return task;
};

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
