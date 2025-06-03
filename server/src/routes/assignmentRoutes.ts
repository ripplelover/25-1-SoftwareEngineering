import express, { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';

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

export default router; 