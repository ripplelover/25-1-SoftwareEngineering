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

// 과목 수정
router.put('/:courseId', async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (!course) return res.status(404).json({ message: '과목을 찾을 수 없음' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: '과목 수정 중 오류 발생' });
  }
});

// 과목 삭제
router.delete('/:courseId', async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) return res.status(404).json({ message: '과목을 찾을 수 없음' });
    res.json({ message: '과목 삭제 완료' });
  } catch (error) {
    res.status(500).json({ message: '과목 삭제 중 오류 발생' });
  }
});

export default router; 