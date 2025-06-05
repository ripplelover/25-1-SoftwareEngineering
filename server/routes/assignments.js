const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

// 과제 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('professor', 'name')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 과제 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('professor', 'name')
      .populate('submissions.student', 'name studentId');
    if (!assignment) {
      return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    }
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 과제 생성 (교수만)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  try {
    const assignment = new Assignment({
      title: req.body.title,
      content: req.body.content,
      dueDate: req.body.dueDate,
      professor: req.user._id,
      fileUrl: req.body.fileUrl,
      fileName: req.body.fileName
    });
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 과제 수정 (교수만)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    }
    if (assignment.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 과제 삭제 (교수만)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    }
    if (assignment.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    await assignment.remove();
    res.json({ message: '과제가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 과제 제출 (학생만)
router.post('/:id/submit', auth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    }

    // 이미 제출했는지 확인
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );
    if (existingSubmission) {
      return res.status(400).json({ message: '이미 제출했습니다.' });
    }

    assignment.submissions.push({
      student: req.user._id,
      fileUrl: req.body.fileUrl,
      fileName: req.body.fileName,
      submittedAt: new Date()
    });

    const updatedAssignment = await assignment.save();
    res.status(201).json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 과제 평가 (교수만)
router.put('/:id/submissions/:submissionId', auth, async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    }
    if (assignment.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: '제출물을 찾을 수 없습니다.' });
    }

    submission.score = req.body.score;
    submission.feedback = req.body.feedback;
    submission.gradedAt = new Date();

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 