const express = require('express');
const Notice = require('../models/Notice');
const Course = require('../models/Course');
const { auth } = require('./auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 파일 업로드 설정 (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// 공지사항 목록 (교수: 담당과목별, 학생: 수강과목별)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'professor') {
      // 교수: 본인이 담당한 과목만
      filter.professor = req.user._id;
    } else if (req.user.role === 'student') {
      // 학생: 본인이 수강 중인 과목만
      // Course에서 user가 본인인 과목 id만 추출
      const courses = await Course.find({ user: req.user._id });
      filter.course = { $in: courses.map(c => c._id) };
    }
    const notices = await Notice.find(filter).populate('course').populate('professor').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: '공지사항 목록 조회 실패', error: err.message });
  }
});

// 공지사항 상세
router.get('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('course').populate('professor');
    if (!notice) return res.status(404).json({ message: '공지사항 없음' });
    // 조회수 증가
    notice.views += 1;
    await notice.save();
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: '공지사항 상세 조회 실패', error: err.message });
  }
});

// 공지사항 생성
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'professor') return res.status(403).json({ message: '교수만 작성 가능' });
    const { course, title, content } = req.body;
    const fileUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : undefined;
    const fileName = req.file ? req.file.originalname : undefined;
    const notice = new Notice({
      course,
      professor: req.user._id,
      title,
      content,
      fileUrl,
      fileName
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: '공지사항 생성 실패', error: err.message });
  }
});

// 공지사항 수정
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: '공지사항 없음' });
    if (String(notice.professor) !== String(req.user._id)) return res.status(403).json({ message: '본인만 수정 가능' });
    const { title, content, course } = req.body;
    notice.title = title;
    notice.content = content;
    if (course) notice.course = course;
    if (req.file) {
      notice.fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      notice.fileName = req.file.originalname;
    }
    await notice.save();
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: '공지사항 수정 실패', error: err.message });
  }
});

// 공지사항 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: '공지사항 없음' });
    if (String(notice.professor) !== String(req.user._id)) return res.status(403).json({ message: '본인만 삭제 가능' });
    await notice.deleteOne();
    res.json({ message: '공지사항 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '공지사항 삭제 실패', error: err.message });
  }
});

module.exports = router; 