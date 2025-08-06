const mongoose = require('mongoose');

const OfflineRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String },
  projectName: { type: String },
  taskName: { type: String },
  productivity: { type: String, enum: ['Productive', 'Unproductive', 'Neutral'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OfflineRequest', OfflineRequestSchema);
