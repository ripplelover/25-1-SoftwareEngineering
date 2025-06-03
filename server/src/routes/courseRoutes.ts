import express, { Request, Response } from 'express';
import { Course } from '../models/Course';

const router = express.Router();

// 학생별 수강 과목 목록 조회
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ user: req.params.userId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: '과목 조회 중 오류 발생' });
  }
});

// 과목 추가 (테스트용)
router.post('/', async (req: Request, res: Response) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: '과목 추가 중 오류 발생' });
  }
});

export default router; 