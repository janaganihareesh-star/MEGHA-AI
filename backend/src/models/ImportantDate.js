const mongoose = require('mongoose');

const ImportantDateSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['birthday', 'anniversary', 'exam', 'interview', 'event', 'other'],
    default: 'event'
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

ImportantDateSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('ImportantDate', ImportantDateSchema);