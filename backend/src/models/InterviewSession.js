const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['HR', 'Technical', 'Resume-based'],
    default: 'Technical'
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeUpload'
  },
  questions: {
    type: [String],
    default: []
  },
  answers: {
    type: [String],
    default: []
  },
  evaluations: [
    {
      score: { type: Number, required: true },
      feedback: { type: String, required: true },
      betterAnswer: { type: String, default: '' }
    }
  ],
  completed: {
    type: Boolean,
    default: false
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
