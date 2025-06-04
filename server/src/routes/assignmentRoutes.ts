import express, { Request, Response } from 'express';
import { Assignment, IAssignment } from '../models/Assignment';
import { Course } from '../models/Course';
import auth from '../middleware/auth';
import multer from 'multer';
import path from 'path';

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
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 전체 과제 목록 조회 (교수/학생)
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    let assignments: IAssignment[] = [];
    if (req.user?.role === 'professor') {
      const professorCourses = await Course.find({ professorId: req.user.id });
      const courseIds = professorCourses.map(c => c._id);
      assignments = await Assignment.find({ course: { $in: courseIds } }).populate('course', 'name professor room time');
    } else if (req.user?.role === 'student') {
      const studentCourses = await Course.find({ students: req.user.id });
      const courseIds = studentCourses.map(c => c._id);
      assignments = await Assignment.find({ course: { $in: courseIds } }).populate('course', 'name professor room time');
    }
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: '과제 목록 조회 중 오류 발생' });
  }
});

// 과제 등록 (교수만)
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  try {
    const { title, content, dueDate, fileUrl, fileName, savedFileName, course } = req.body;
    if (!title || !content || !dueDate || !course) {
      return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
    }
    const courseObj = await Course.findOne({ _id: course, professorId: req.user.id });
    if (!courseObj) {
      return res.status(403).json({ message: '본인 담당 과목에만 과제를 등록할 수 있습니다.' });
    }
    const assignment = new Assignment({
      course,
      title,
      content,
      dueDate,
      fileUrl,
      fileName,
      savedFileName,
      type: 'assignment'
    });
    await assignment.save();
    await assignment.populate('course', 'name professor room time');
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: '과제 등록 중 오류 발생' });
  }
});

// 과제 수정 (교수만)
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  try {
    const { title, dueDate } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    // 담당 과목 체크
    const courseObj = await Course.findOne({ _id: assignment.course, professorId: req.user.id });
    if (!courseObj) return res.status(403).json({ message: '본인 담당 과목의 과제만 수정할 수 있습니다.' });
    assignment.title = title;
    assignment.dueDate = dueDate;
    await assignment.save();
    await assignment.populate('course', 'name professor room time');
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: '과제 수정 중 오류 발생' });
  }
});

// 과제 삭제 (교수만)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'professor') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    // 담당 과목 체크
    const courseObj = await Course.findOne({ _id: assignment.course, professorId: req.user.id });
    if (!courseObj) return res.status(403).json({ message: '본인 담당 과목의 과제만 삭제할 수 있습니다.' });
    await assignment.deleteOne();
    res.json({ message: '과제가 삭제되었습니다.', assignmentId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: '과제 삭제 중 오류 발생' });
  }
});

// 과제 상세 조회 (교수/학생)
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('submissions.student', 'name studentId email');
    if (!assignment) return res.status(404).json({ message: '과제를 찾을 수 없습니다.' });
    // 권한 체크
    if (req.user?.role === 'professor') {
      const course = await Course.findOne({ _id: assignment.course, professorId: req.user.id });
      if (!course) return res.status(403).json({ message: '본인 담당 과목의 과제만 조회할 수 있습니다.' });
    } else if (req.user?.role === 'student') {
      const course = await Course.findOne({ _id: assignment.course, students: req.user.id });
      if (!course) return res.status(403).json({ message: '본인 수강 과목의 과제만 조회할 수 있습니다.' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: '과제 상세 조회 중 오류 발생' });
  }
});

// 파일 업로드 라우트
router.post('/upload', upload.single('file'), (req: express.Request, res: express.Response) => {
  if (!req.file) return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl, fileName: req.file.originalname, savedFileName: req.file.filename });
});

// 안전한 파일 다운로드 라우트 (한글/특수문자 파일명 지원)
router.get('/download/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);
  res.download(filePath, filename, err => {
    if (err) {
      res.status(404).json({ message: '파일을 찾을 수 없습니다.' });
    }
  });
});

// 과제 업로드 라우트 (학생만)
router.post('/:id', auth, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ message: '권한이 없습니다.' });
  }
});


export default router; 