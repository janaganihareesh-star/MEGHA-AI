const mongoose = require('mongoose');

const GraphNodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  label: { // e.g., 'Person', 'Skill', 'Project', 'Technology'
    type: String,
    required: true
  },
  name: { // e.g., 'Hareesh', 'MERN', 'ExamGuard'
    type: String,
    required: true,
    lowercase: true
  },
  properties: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

GraphNodeSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('GraphNode', GraphNodeSchema);
