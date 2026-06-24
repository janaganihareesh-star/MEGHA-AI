const mongoose = require('mongoose');

const CronTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  cronExpression: {
    type: String, // e.g., "0 7 * * *" for 7 AM every day
    required: true
  },
  aiPrompt: {
    type: String, // e.g., "Fetch the news, weather, and AAPL stock, and generate a daily briefing."
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastRunAt: {
    type: Date
  },
  nextRunAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CronTask', CronTaskSchema);
