const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  }, { timestamps: true });
  
  const Project = mongoose.model('Project', projectSchema);
  
  module.exports = Project;