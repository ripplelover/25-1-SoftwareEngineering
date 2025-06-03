import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, right: 32 });

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
      {/* 상단 유저 정보/로그아웃/메뉴 */}
      <div style={{
        background: '#2d3e50', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', letterSpacing: 2 }}>학사관리시스템</div>
          <button ref={menuBtnRef} style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={() => {
            if (menuBtnRef.current) {
              const rect = menuBtnRef.current.getBoundingClientRect();
              setMenuPos({ top: rect.bottom + window.scrollY + 8, right: window.innerWidth - rect.right });
            }
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{user?.name || '이름없음'}({user?.studentId || '학번없음'})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <div style={{ position: 'absolute', top: menuPos.top, right: menuPos.right, background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', zIndex: 2100 }} onClick={e => e.stopPropagation()}>
            <h3>기능 목록</h3>
            <div style={{ marginBottom: 18 }}>
              <b>대학생활</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>수강관리/시간표</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>성적/이수현황</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>수강신청</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>강의종합정보</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>강의 공지사항</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>자료실</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>과제</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>공학교육</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>상담/평가</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>학사 서비스</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }}>등록/행정서비스</li>
              </ul>
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ marginTop: 16 }}>닫기</button>
          </div>
        </>
      )}
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