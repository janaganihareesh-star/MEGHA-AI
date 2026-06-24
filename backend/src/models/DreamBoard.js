const mongoose = require('mongoose');

const DreamBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dream: {
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
    default: 'life'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  targetYear: {
    type: Number
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DreamBoard', DreamBoardSchema);