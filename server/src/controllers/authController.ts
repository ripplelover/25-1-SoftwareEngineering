import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { studentId, password, name, email, role, department, major, grade } = req.body;

    // 이미 존재하는 사용자인지 확인
    const existingUser = await User.findOne({ $or: [{ studentId }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 학번 또는 이메일입니다.' });
    }

    // 새 사용자 생성
    const user = new User({
      studentId,
      password,
      name,
      email,
      role,
      department,
      major,
      grade,
    });

    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        _id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { studentId, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(401).json({ message: '학번 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '학번 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        _id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 