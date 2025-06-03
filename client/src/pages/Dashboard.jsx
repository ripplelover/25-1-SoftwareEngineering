import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (!userData.id) return;
    fetch(`http://localhost:5000/api/courses/${userData.id}`)
      .then(res => res.json())
      .then(setCourses);
    fetch(`http://localhost:5000/api/timetable/${userData.id}`)
      .then(res => res.json())
      .then(data => setTimetable((data && Array.isArray(data.entries)) ? data.entries : []));
  }, []);

  useEffect(() => {
    async function fetchAssignmentsAndNotices() {
      let allAssignments = [];
      let allNotices = [];
      for (const c of courses) {
        const res = await fetch(`http://localhost:5000/api/assignments/${c._id}`);
        const items = await res.json();
        items.forEach(item => {
          if (item.type === 'assignment') allAssignments.push({ ...item, course: c.name });
          else allNotices.push({ ...item, course: c.name });
        });
      }
      setAssignments(allAssignments);
      setNotices(allNotices);
    }
    if (courses.length > 0) fetchAssignmentsAndNotices();
  }, [courses]);

  function logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  // 시간표 2차원 배열 만들기 (요일 x 교시)
  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const timetableMatrix = Array.from({ length: periods.length }, () => Array(days.length).fill('-'));
  timetable.forEach(entry => {
    const dayIdx = days.indexOf(entry.day);
    if (dayIdx !== -1 && entry.period >= 1 && entry.period <= periods.length) {
      timetableMatrix[entry.period - 1][dayIdx] = entry.course?.name || '-';
    }
  });

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div className="dashboard-title">학사관리시스템</div>
        <div className="dashboard-user">
          <span>{user.name}({user.studentId})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main>
        <section className="courses">
          <h2>수강 과목 현황</h2>
          <table>
            <thead>
              <tr>
                <th>과목명</th><th>교수명</th><th>강의실</th><th>시간</th>
                <th>공지사항</th><th>강의자료실</th><th>Q&A</th><th>학습독독</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.professor}</td>
                  <td>{c.room}</td>
                  <td>{c.time}</td>
                  <td><button>공지사항</button></td>
                  <td><button>강의자료실</button></td>
                  <td><button>Q&A</button></td>
                  <td><button>학습독독</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="timetable">
          <h2>시간표</h2>
          <table>
            <thead>
              <tr>
                <th>교시</th>
                {days.map(day => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, i) => (
                <tr key={period}>
                  <td>{period}교시</td>
                  {days.map((day, j) => <td key={day}>{timetableMatrix[i][j]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="notices-assignments">
          <div>
            <h2>과목별 공지사항</h2>
            <ul>
              {notices.map((n, i) => (
                <li key={i}>[{n.course}] {n.title} ({new Date(n.dueDate).toLocaleDateString()})</li>
              ))}
              {notices.length === 0 && <li>공지사항이 없습니다.</li>}
            </ul>
          </div>
          <div>
            <h2>과제 현황</h2>
            <ul>
              {assignments.map((a, i) => (
                <li key={i}>[{a.course}] {a.title} (마감: {new Date(a.dueDate).toLocaleDateString()})</li>
              ))}
              {assignments.length === 0 && <li>진행 중인 과제가 없습니다.</li>}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
} 