const mongoose = require('mongoose');

const ConversationSummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  achievements: {
    type: [String],
    default: []
  },
  moodChanges: {
    type: String,
    default: ''
  },
  keyTopics: {
    type: [String],
    default: []
  },
  importantMemories: {
    type: [String],
    default: []
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ConversationSummarySchema.index({ userId: 1, year: -1, month: -1 });

module.exports = mongoose.model('ConversationSummary', ConversationSummarySchema);