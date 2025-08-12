const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Idea', 'Draft', 'In Review', 'Scheduled', 'Published'],
    default: 'Idea'
  },
  date: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  }
  }, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);