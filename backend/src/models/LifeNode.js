const mongoose = require('mongoose');

const LifeNodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nodeType: {
    type: String,
    enum: ['Goal', 'Habit', 'Journal', 'Dream'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Paused', 'Failed'],
    default: 'Active'
  },
  progress: {
    type: Number,
    default: 0, // 0 to 100 percentage or count
    min: 0
  },
  target: {
    type: Number,
    default: 100
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Once'],
    default: 'Once'
  },
  dueDate: {
    type: Date
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LifeNode', LifeNodeSchema);
