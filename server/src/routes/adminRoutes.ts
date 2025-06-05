import express from 'express';
import { User } from '../models/User';
import { adminOnly } from '../middleware/auth';
import auth from '../middleware/auth';

const router = express.Router();

// 전체 사용자 목록 (관리자만)
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: '사용자 목록 조회 실패', error: (err as any).message });
  }
});

// 사용자 삭제 (관리자만)
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: '사용자 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '사용자 삭제 실패', error: (err as any).message });
  }
});

// 통계(전체/권한별/학과별 인원)
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const total = await User.countDocuments();
    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const byDepartment = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    res.json({ total, byRole, byDepartment });
  } catch (err) {
    res.status(500).json({ message: '통계 조회 실패', error: (err as any).message });
  }
});

export default router; 