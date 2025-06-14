const mongoose = require('mongoose');

const idleTimeTrackerSchema = new mongoose.Schema({
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    idleStartTime: { type: Date },
    idleEndTime: { type: Date },
    status: { type: String },
    message: { type: String },
}, {timestamps:true});

const IdleTimeTracker = mongoose.model('IdleTimeTracker', idleTimeTrackerSchema);

module.exports = IdleTimeTracker;