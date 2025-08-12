// models/CalendarEvent.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const calendarEventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
