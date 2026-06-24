const mongoose = require('mongoose');

const ProjectBlueprintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectName: { type: String, required: true },
  stack: { type: String, default: 'MERN' },
  idea: { type: mongoose.Schema.Types.Mixed, default: null },         // idea generator result
  architecture: { type: mongoose.Schema.Types.Mixed, default: null }, // architecture result
  database: { type: mongoose.Schema.Types.Mixed, default: null },     // schema result
  apis: { type: mongoose.Schema.Types.Mixed, default: null },         // API design result
  deployment: { type: mongoose.Schema.Types.Mixed, default: null },   // deployment roadmap
  phase: { type: String, enum: ['idea', 'architecture', 'database', 'apis', 'deployment', 'complete'], default: 'idea' }
}, { timestamps: true });

module.exports = mongoose.model('ProjectBlueprint', ProjectBlueprintSchema);
