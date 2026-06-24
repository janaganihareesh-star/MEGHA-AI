const mongoose = require('mongoose');
const { MEMORY_CATEGORIES } = require('../utils/constants');

const MemoryVaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: MEMORY_CATEGORIES,
    required: true
  },
  memoryType: {
    type: String,
    enum: ['ShortTerm', 'Preference', 'Project', 'Uncategorized'],
    default: 'Uncategorized'
  },
  memory: {
    type: String,
    maxlength: 500,
    required: true
  },
  importanceScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  tags: {
    type: [String],
    default: []
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  userApproved: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['auto', 'user'],
    default: 'auto'
  },
  embedding: {
    type: [Number],
    select: false // Exclude by default so we don't send huge vectors to frontend
  }
}, {
  timestamps: true
});

// Composite index for memory lookups by category and score sorting
MemoryVaultSchema.index({ userId: 1, category: 1, importanceScore: -1 });

module.exports = mongoose.model('MemoryVault', MemoryVaultSchema);