import express, { Request, Response } from 'express';
import { Course } from '../models/Course';
import { User } from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

// 교수의 과목 목록 조회
router.get('/professor/:professorId', auth, async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ professorId: req.params.professorId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 학생의 수강 과목 목록 조회
router.get('/student/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ students: req.params.studentId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 전체 과목 목록 조회 (학생용)
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 과목 등록 (교수용)
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { name, professor, room, time, professorId } = req.body;
    
    const course = new Course({
      name,
      professor,
      room,
      time,
      professorId,
      students: []
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 과목 삭제 (교수용)
router.delete('/:courseId', auth, async (req: Request, res: Response) => {
  try {
    await Course.findByIdAndDelete(req.params.courseId);
    res.json({ message: '과목이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 수강신청 (학생용)
router.post('/enroll/:courseId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: '과목을 찾을 수 없습니다.' });
    }

    // 이미 수강신청한 과목인지 확인
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: '이미 수강신청한 과목입니다.' });
    }

    // 시간표 충돌 확인
    const studentCourses = await Course.find({ students: studentId });
    const newCourseTime = course.time.split(' ')[1]; // "월 1-2교시" -> "1-2교시"
    
    for (const enrolledCourse of studentCourses) {
      const enrolledTime = enrolledCourse.time.split(' ')[1];
      if (enrolledTime === newCourseTime) {
        return res.status(400).json({ message: '시간표가 충돌합니다.' });
      }
    }

    course.students.push(studentId);
    await course.save();

    res.json({ message: '수강신청이 완료되었습니다.', course });
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 수강신청 취소 (학생용)
router.post('/drop/:courseId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: '과목을 찾을 수 없습니다.' });
    }

    course.students = course.students.filter(id => id !== studentId);
    await course.save();

    res.json({ message: '수강신청이 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

export default router; 