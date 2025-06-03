import express, { Request, Response } from 'express';
import { Timetable } from '../models/Timetable';

const router = express.Router();

// 학생별 시간표 조회
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const timetable = await Timetable.findOne({ user: req.params.userId }).populate('entries.course');
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: '시간표 조회 중 오류 발생' });
  }
});

// 시간표 추가/수정 (테스트용)
router.post('/', async (req: Request, res: Response) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: '시간표 추가 중 오류 발생' });
  }
});

export default router; 