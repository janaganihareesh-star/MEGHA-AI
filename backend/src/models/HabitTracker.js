const mongoose = require('mongoose');

const HabitTrackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['build', 'break'], default: 'build' },
  frequency: { type: String, enum: ['daily', 'weekdays', 'weekly'], default: 'daily' },
  targetDays: { type: Number, default: 66 },
  startDate: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  completedDates: [{ type: Date }],
  missedDates: [{ type: Date }],
  reminderTime: { type: String, default: '' }, // e.g. '08:00'
  category: {
    type: String,
    enum: ['health', 'learning', 'career', 'mental', 'social', 'other'],
    default: 'other'
  },
  color: { type: String, default: '#6366f1' },
  icon: { type: String, default: 'Star' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Calculate if completed today
HabitTrackerSchema.virtual('completedToday').get(function () {
  const today = new Date().toDateString();
  return this.completedDates.some(d => new Date(d).toDateString() === today);
});

// Calculate completion rate (last 30 days)
HabitTrackerSchema.virtual('completionRate').get(function () {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCompleted = this.completedDates.filter(d => d >= thirtyDaysAgo).length;
  return Math.round((recentCompleted / 30) * 100);
});

module.exports = mongoose.model('HabitTracker', HabitTrackerSchema);
