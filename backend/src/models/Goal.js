const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'general'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  targetDate: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  steps: [
    {
      step: { type: String, required: true },
      done: { type: Boolean, default: false }
    }
  ]
}, {
  timestamps: true
});

GoalSchema.index({ userId: 1, isCompleted: 1 });

module.exports = mongoose.model('Goal', GoalSchema);