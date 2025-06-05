import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import timetableRoutes from './routes/timetableRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import path from 'path';
import noticesRouter from './routes/notices';
import materialRoutes from './routes/materialRoutes';
import adminRoutes from './routes/adminRoutes';
const gradesRouter = require('../routes/grades');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB 연결
const MONGODB_URI = 'mongodb+srv://kdk200139:010626@cluster0.mzw1rqm.mongodb.net/academic_management?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
  })
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err);
  });

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradesRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.send('Academic Management System API');
});

// 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 