const mongoose = require('mongoose');

const GraphEdgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceNodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GraphNode',
    required: true
  },
  targetNodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GraphNode',
    required: true
  },
  relation: { // e.g., 'LEARNING', 'BUILT', 'OWNS', 'IS_FRIENDS_WITH'
    type: String,
    required: true,
    uppercase: true
  },
  confidence: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

GraphEdgeSchema.index({ userId: 1, sourceNodeId: 1, targetNodeId: 1, relation: 1 }, { unique: true });

module.exports = mongoose.model('GraphEdge', GraphEdgeSchema);
