const mongoose = require('mongoose');

const RelationshipStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  friendshipStartDate: {
    type: Date,
    default: Date.now
  },
  friendshipDays: {
    type: Number,
    default: 0
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  totalVoiceChats: {
    type: Number,
    default: 0
  },
  totalVoiceMinutes: {
    type: Number,
    default: 0
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  bondLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  bondLevelName: {
    type: String,
    default: 'New Friend'
  },
  streak: {
    type: Number,
    default: 0
  },
  lastInteractionDate: {
    type: Date,
    default: Date.now
  },
  milestonesReached: [
    {
      days: { type: Number, required: true },
      celebratedAt: { type: Date, default: Date.now },
      message: { type: String, default: '' }
    }
  ]
}, {
  timestamps: true
});

// Update bond level based on elapsed friendship days
RelationshipStatsSchema.methods.updateBondLevel = function () {
  const now = new Date();
  const start = this.friendshipStartDate;
  
  // Calculate difference in whole days
  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  this.friendshipDays = diffDays;

  if (diffDays < 30) {
    this.bondLevel = 1;
    this.bondLevelName = 'New Friend';
  } else if (diffDays < 90) {
    this.bondLevel = 2;
    this.bondLevelName = 'Friendly';
  } else if (diffDays < 180) {
    this.bondLevel = 3;
    this.bondLevelName = 'Close Friend';
  } else if (diffDays < 365) {
    this.bondLevel = 4;
    this.bondLevelName = 'Trusted Companion';
  } else {
    this.bondLevel = 5;
    this.bondLevelName = 'Long-Term Companion';
  }
};

// Index for Proactive Cron Jobs
RelationshipStatsSchema.index({ lastInteractionDate: -1 });

module.exports = mongoose.model('RelationshipStats', RelationshipStatsSchema);