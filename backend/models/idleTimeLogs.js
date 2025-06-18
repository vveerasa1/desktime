const mongoose = require('mongoose');

const idleLogSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrackingSession' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  idleStartTime: { type: Date },
  idleEndTime: { type: Date },
  duration: { type: Number }, // seconds
}, { timestamps: true });

const IdleLog = mongoose.model('IdleLog', idleLogSchema);

module.exports = IdleLog;
