import express, { Request, Response } from 'express';
import { Notice, INotice } from '../models/Notice';
import { Course } from '../models/Course';
import { User } from '../models/User';
import auth from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 공지사항 목록 (교수: 담당과목별, 학생: 수강과목별)
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    let filter: any = {};
    if (req.user?.role === 'professor') {
      filter.professor = req.user.id;
    } else if (req.user?.role === 'student') {
      const courses = await Course.find({ students: req.user.id });
      filter.course = { $in: courses.map(c => c._id) };
    }
    const notices = await Notice.find(filter).populate('course').populate('professor').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err: any) {
    res.status(500).json({ message: '공지사항 목록 조회 실패', error: err.message });
  }
});

// 공지사항 상세
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('course').populate('professor');
    if (!notice) return res.status(404).json({ message: '공지사항 없음' });
    notice.views += 1;
    await notice.save();
    res.json(notice);
  } catch (err: any) {
    res.status(500).json({ message: '공지사항 상세 조회 실패', error: err.message });
  }
});

// 공지사항 생성
router.post('/', auth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'professor') return res.status(403).json({ message: '교수만 작성 가능' });
    const { course, title, content } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const fileName = req.file ? req.file.originalname : undefined;
    const notice = new Notice({
      course,
      professor: req.user.id,
      title,
      content,
      fileUrl,
      fileName
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (err: any) {
    res.status(500).json({ message: '공지사항 생성 실패', error: err.message });
  }
});

// 공지사항 수정
router.put('/:id', auth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: '공지사항 없음' });
    if (String(notice.professor) !== String(req.user?.id)) return res.status(403).json({ message: '본인만 수정 가능' });
    const { title, content, course } = req.body;
    notice.title = title;
    notice.content = content;
    if (course) notice.course = course;
    if (req.file) {
      notice.fileUrl = `/uploads/${req.file.filename}`;
      notice.fileName = req.file.originalname;
    }
    await notice.save();
    res.json(notice);
  } catch (err: any) {
    res.status(500).json({ message: '공지사항 수정 실패', error: err.message });
  }
});

// 공지사항 삭제
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: '공지사항 없음' });
    if (String(notice.professor) !== String(req.user?.id)) return res.status(403).json({ message: '본인만 삭제 가능' });
    await notice.deleteOne();
    res.json({ message: '공지사항 삭제 완료' });
  } catch (err: any) {
    res.status(500).json({ message: '공지사항 삭제 실패', error: err.message });
  }
});

export default router; 