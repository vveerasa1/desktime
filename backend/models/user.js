const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    employeeId: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    team: { type: String },
    role: { type: String },
    phone: { type: String },
    workingDays: { type: Array },
    workStartTime: { type: String },
    workEndTime: { type: String },
    minimumHours: { type: String },
    flexibleHours: { type: Boolean },
    trackingDays: { type: Array },
    trackingStartTime: { type: String },
    trackingEndTime: { type: String },
    timeZone: { type: String },
    photo: { type: String },
    workDuration: { type: String },
    active:{type: Boolean, default: true},
}, {timestamps: true});


const User = mongoose.model('User', userSchema);

module.exports = User;