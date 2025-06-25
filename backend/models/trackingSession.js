const mongoose = require('mongoose');

const TrackingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String }, // e.g., '2025-06-17'
  arrivalTime: { type: Date },
  leftTime: { type: Date },
  totalTrackedTime: { type: Number, default: 0 }, // in seconds
  idlePeriods: [
    {
      start: Date,
      end: Date,
      duration: Number
    }
  ],
   activePeriods: [
    {
      start: Date,
      end: Date,
      duration: Number, // in seconds
      productivity: Number,
      neutral: Number
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('TrackingSession', TrackingSessionSchema);