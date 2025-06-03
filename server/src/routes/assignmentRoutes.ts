import express, { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import auth from '../middleware/auth';

const router = express.Router();

// 과목별 과제/공지 목록 조회
router.get('/:courseId', async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: '과제/공지 조회 중 오류 발생' });
  }
});

// 과제/공지 추가 (테스트용)
router.post('/', async (req: Request, res: Response) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: '과제/공지 추가 중 오류 발생' });
  }
});

// 과목별 과제 제출 현황 (교수용)
router.get('/:courseId/submissions', auth, async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId }).populate('submissions.student', 'name studentId email');
    // 각 과제별로 submissions 배열만 추출해서 반환
    const submissions = assignments.map(a => ({
      assignmentId: a._id,
      title: a.title,
      dueDate: a.dueDate,
      submissions: a.submissions
    }));
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: '과제 제출 현황 조회 중 오류 발생' });
  }
});

export default router; 