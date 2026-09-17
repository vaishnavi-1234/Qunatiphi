const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority. Allowed: Low, Medium, High',
      },
      default: 'Medium',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'done'],
        message: '{VALUE} is not a valid status. Allowed: todo, in-progress, done',
      },
      default: 'todo',
      required: true,
    },
    dueDate: {
      type: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
