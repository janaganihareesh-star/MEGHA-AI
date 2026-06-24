const mongoose = require('mongoose');

const ResumeUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  skills: {
    type: [String],
    default: []
  },
  missingSkills: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  strengths: {
    type: [String],
    default: []
  },
  interviewQuestions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResumeUpload', ResumeUploadSchema);