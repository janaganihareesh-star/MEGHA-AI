const mongoose = require('mongoose');

const WeeklyReflectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  week: {
    type: String, // format like YYYY-Www (e.g. 2026-W24)
    required: true
  },
  achievements: {
    type: String,
    default: ''
  },
  struggles: {
    type: String,
    default: ''
  },
  lessons: {
    type: String,
    default: ''
  },
  nextWeekGoal: {
    type: String,
    default: ''
  },
  aiSummary: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

WeeklyReflectionSchema.index({ userId: 1, week: -1 });

module.exports = mongoose.model('WeeklyReflection', WeeklyReflectionSchema);