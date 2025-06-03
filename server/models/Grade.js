const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F']
  },
  type: {
    type: String,
    required: true,
    enum: ['전공', '교양', '일반']
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['1학기', '2학기']
  },
  professor: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema); 