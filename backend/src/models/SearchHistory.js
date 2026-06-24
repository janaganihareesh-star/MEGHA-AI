const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  intent: { type: String, enum: ['news', 'how-to', 'compare', 'fact', 'visa', 'tech', 'health', 'schemes', 'general'], default: 'general' },
  summary: { type: String, default: '' },
  sources: [{
    title: String,
    url: String,
    date: String
  }],
  language: { type: String, default: 'English' },
  isPinned: { type: Boolean, default: false },
  searchMode: { type: String, enum: ['quick', 'deep'], default: 'quick' }
}, { timestamps: true });

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
