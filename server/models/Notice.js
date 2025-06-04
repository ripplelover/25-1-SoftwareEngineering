const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Notice', noticeSchema); 