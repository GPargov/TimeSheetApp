// models/Timesheet.js
const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  breakTime: {
    type: String,
    required: true,
  },
  leaveDays: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Timesheet', TimesheetSchema);
