const mongoose = require('mongoose');

const DailyFactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  factType: {
    type: String,
    required: true
  },
  fact: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  sharedAt: {
    type: Date,
    default: Date.now
  },
  liked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

DailyFactSchema.index({ userId: 1, sharedAt: -1 });

module.exports = mongoose.model('DailyFact', DailyFactSchema);