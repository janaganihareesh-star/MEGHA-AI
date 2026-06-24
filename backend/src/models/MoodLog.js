const mongoose = require('mongoose');
const { MOODS } = require('../utils/constants');

const MoodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: MOODS,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  messageText: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index to efficiently query mood logs by user and sort by time
MoodLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('MoodLog', MoodLogSchema);