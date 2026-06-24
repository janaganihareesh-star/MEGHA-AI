const mongoose = require('mongoose');

const LearningProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  practiceCount: {
    type: Number,
    default: 0
  },
  lastPracticed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

LearningProgressSchema.index({ userId: 1, subject: 1, topic: 1 });

module.exports = mongoose.model('LearningProgress', LearningProgressSchema);