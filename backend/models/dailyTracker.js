const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    arrivalTime: { type: Date, required: true },
    leftTime: { type: Date, required: true },
}, {timestamps:true});

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;