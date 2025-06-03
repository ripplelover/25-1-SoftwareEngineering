import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

// 회원가입
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { studentId, password, name, email, role, department, major, grade } = req.body;

    // 사용자 존재 여부 확인 (학번 또는 이메일 중복 체크)
    const existingUser = await User.findOne({ $or: [ { studentId }, { email } ] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 학번 또는 이메일입니다.' });
    }

    // 새 사용자 생성 (비밀번호 해싱은 모델에서 처리)
    const user = new User({
      studentId,
      password,
      name,
      email,
      role: role || 'student',
      department,
      major,
      grade
    });

    await user.save();

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { studentId, email, password } = req.body;

    // 사용자 확인 (학번 또는 이메일)
    const user = await User.findOne({ $or: [ { studentId }, { email } ] });
    if (!user) {
      return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '잘못된 비밀번호입니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        major: user.major,
        grade: user.grade
      }
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

export default router; 