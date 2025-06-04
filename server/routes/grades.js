const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

// Get all grades for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const grades = await Grade.find({ userId: req.params.userId })
      .sort({ year: -1, semester: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new grade
router.post('/', auth, async (req, res) => {
  const grade = new Grade({
    userId: req.body.userId,
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    credit: req.body.credit,
    grade: req.body.grade,
    type: req.body.type,
    year: req.body.year,
    semester: req.body.semester,
    professor: req.body.professor,
    department: req.body.department
  });

  try {
    const newGrade = await grade.save();
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a grade
router.patch('/:id', auth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    
    Object.keys(req.body).forEach(key => {
      grade[key] = req.body[key];
    });
    
    const updatedGrade = await grade.save();
    res.json(updatedGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a grade
router.delete('/:id', auth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    
    await grade.remove();
    res.json({ message: 'Grade deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 