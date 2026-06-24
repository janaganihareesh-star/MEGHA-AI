const mongoose = require('mongoose');

const VoiceMessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // duration in seconds
    default: 0
  },
  mood: {
    type: String,
    default: 'neutral'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

VoiceMessageSchema.index({ conversationId: 1, timestamp: 1 });

module.exports = mongoose.model('VoiceMessage', VoiceMessageSchema);