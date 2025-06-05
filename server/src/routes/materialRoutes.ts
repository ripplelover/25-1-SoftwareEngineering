import express, { Request, Response } from 'express';
import { Material } from '../models/Material';
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

// 과목별 자료실 목록
router.get('/course/:courseId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const materials = await Material.find({ course: req.params.courseId })
      .populate('uploader', 'name studentId role')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err: any) {
    res.status(500).json({ message: '자료실 목록 조회 실패', error: err.message });
  }
});

// 자료 등록 (교수/학생 모두)
router.post('/', auth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const { course, title, content } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const fileName = req.file ? req.file.originalname : undefined;
    const material = new Material({
      course,
      title,
      content,
      uploader: req.user?.id,
      uploaderRole: req.user?.role,
      fileUrl,
      fileName
    });
    await material.save();
    res.status(201).json(material);
  } catch (err: any) {
    res.status(500).json({ message: '자료 등록 실패', error: err.message });
  }
});

// 자료 수정 (본인만)
router.put('/:id', auth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: '자료 없음' });
    if (String(material.uploader) !== String(req.user?.id)) return res.status(403).json({ message: '본인만 수정 가능' });
    material.title = req.body.title;
    material.content = req.body.content;
    if (req.file) {
      material.fileUrl = `/uploads/${req.file.filename}`;
      material.fileName = req.file.originalname;
    }
    await material.save();
    res.json(material);
  } catch (err: any) {
    res.status(500).json({ message: '자료 수정 실패', error: err.message });
  }
});

// 자료 삭제 (본인만)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: '자료 없음' });
    if (String(material.uploader) !== String(req.user?.id)) return res.status(403).json({ message: '본인만 삭제 가능' });
    await material.deleteOne();
    res.json({ message: '자료 삭제 완료' });
  } catch (err: any) {
    res.status(500).json({ message: '자료 삭제 실패', error: err.message });
  }
});

// 자료 상세 조회
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('course', 'name')
      .populate('uploader', 'name studentId role');
    if (!material) return res.status(404).json({ message: '자료를 찾을 수 없습니다.' });
    material.viewCount = (material.viewCount || 0) + 1;
    await material.save();
    res.json(material);
  } catch (err: any) {
    res.status(500).json({ message: '자료 조회 실패', error: err.message });
  }
});

export default router; 