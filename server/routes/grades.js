const express = require('express');
const path = require('path');
const router = express.Router();
const Grade = require('../models/Grade');
const authModule = require('./middleware/auth');
const auth = authModule.default || authModule;
const mongoose = require('mongoose');

// 학생: 본인 성적 조회 (맨 위에 위치)
router.get('/:userId', auth, async (req, res) => {
  console.log('성적 조회 요청:', req.params.userId);
  try {
    const grades = await Grade.find().sort({ year: -1, semester: -1 });
    // userId를 문자열로 비교
    const filtered = grades.filter(g => String(g.userId) === String(req.params.userId));
    console.log('조회된 성적:', filtered);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 교수: 성적 입력/수정 (중복이면 update, 아니면 insert)
router.post('/', auth, async (req, res) => {
  try {
    const filter = {
      userId: mongoose.Types.ObjectId.isValid(req.body.userId)
        ? new mongoose.Types.ObjectId(req.body.userId)
        : req.body.userId,
      courseId: req.body.courseId,
      year: req.body.year,
      semester: req.body.semester
    };
    const update = {
      courseName: req.body.courseName,
      credit: req.body.credit,
      grade: req.body.grade,
      type: req.body.type,
      professor: req.body.professor,
      department: req.body.department
    };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const upsertedGrade = await Grade.findOneAndUpdate(filter, update, options);
    res.status(201).json(upsertedGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 교수: 과목별 전체 성적 조회
router.get('/', auth, async (req, res) => {
  const { courseId } = req.query;
  if (!courseId) return res.status(400).json({ message: 'courseId가 필요합니다.' });
  try {
    const grades = await Grade.find({ courseId });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a grade (PATCH)
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

// Update a grade (PUT, PATCH와 동일)
router.put('/:id', auth, async (req, res) => {
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