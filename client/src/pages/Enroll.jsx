import React, { useState, useRef } from 'react';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

const dummyUser = { name: '김동규', studentId: '2022202004' };
const dummyCourses = [
  { id: 1, year: 2025, semester: '1학기', name: '회로이론', professor: '황호영', department: '전자공학과', time: '화 6교시/새빛102, 목 5교시/새빛102' },
  { id: 2, year: 2025, semester: '1학기', name: '소프트웨어공학', professor: '이기춘', department: '컴퓨터공학과', time: '월 5교시/새빛203, 수 6교시/새빛203' },
  { id: 3, year: 2025, semester: '1학기', name: '드로잉', professor: '이정인', department: '예술학부', time: '화 1,2교시/한울202' },
  { id: 4, year: 2025, semester: '1학기', name: 'GPU컴퓨팅', professor: '신동화', department: '컴퓨터공학과', time: '수 2교시/새빛203' },
];

function parseTime(timeStr) {
  // 예: '화 6교시/새빛102, 목 5교시/새빛102' → [{day:'화', period:6}, {day:'목', period:5}]
  return timeStr.split(',').map(t => {
    const m = t.trim().match(/([월화수목금])\s*(\d+)/);
    return m ? { day: m[1], period: parseInt(m[2], 10) } : null;
  }).filter(Boolean);
}

export default function Enroll() {
  const [year, setYear] = useState(2025);
  const [semester, setSemester] = useState('1학기');
  const [course, setCourse] = useState('');
  const [prof, setProf] = useState('');
  const [department, setDepartment] = useState('');
  const [enrolled, setEnrolled] = useState([]); // [{id, ...}]
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });

  // 시간표(요일x교시)
  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const timetable = Array.from({ length: periods.length }, () => Array(days.length).fill(null));
  enrolled.forEach(c => {
    parseTime(c.time).forEach(({ day, period }) => {
      const dIdx = days.indexOf(day);
      if (dIdx !== -1 && period >= 1 && period <= periods.length) {
        timetable[period - 1][dIdx] = c.name;
      }
    });
  });

  // 필터링
  const filtered = dummyCourses.filter(c =>
    (year ? c.year === year : true) &&
    (semester ? c.semester === semester : true) &&
    (course ? c.name.includes(course) : true) &&
    (prof ? c.professor.includes(prof) : true) &&
    (department ? c.department.includes(department) : true)
  );

  // 신청 가능 여부(시간표 중복 체크)
  function canEnroll(c) {
    return !parseTime(c.time).some(({ day, period }) => {
      const dIdx = days.indexOf(day);
      return dIdx !== -1 && timetable[period - 1][dIdx];
    });
  }

  function handleEnroll(c) {
    if (!canEnroll(c)) return alert('이미 신청된 시간과 중복됩니다!');
    setEnrolled([...enrolled, c]);
  }
  function handleCancel(c) {
    setEnrolled(enrolled.filter(e => e.id !== c.id));
  }

  return (
    <div className="dashboard-root">
      <div className="dashboard-header" style={{ borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="dashboard-title">학사관리시스템</div>
          <button ref={menuBtnRef} style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={() => {
            if (menuBtnRef.current) {
              const rect = menuBtnRef.current.getBoundingClientRect();
              setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            }
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user">
          <span>{dummyUser.name}({dummyUser.studentId})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={dummyUser} />
        </>
      )}
      <main style={{ maxWidth: 1100, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>수강신청</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 18 }}>
              <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }}>
                <option value={2025}>2025년</option>
                <option value={2024}>2024년</option>
              </select>
              <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 80 }}>
                <option value="1학기">1학기</option>
                <option value="2학기">2학기</option>
              </select>
              <input value={course} onChange={e => setCourse(e.target.value)} placeholder="과목명" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
              <input value={prof} onChange={e => setProf(e.target.value)} placeholder="교수명" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
              <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="학과" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
            </div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff', marginBottom: 32 }}>
              <thead>
                <tr style={{ background: '#f5e6fa' }}>
                  <th>과목명</th>
                  <th>교수명</th>
                  <th>학과</th>
                  <th>시간/강의실</th>
                  <th>신청</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>과목이 없습니다.</td></tr>
                ) : filtered.map(c => {
                  const isEnrolled = enrolled.some(e => e.id === c.id);
                  return (
                    <tr key={c.id} style={{ background: isEnrolled ? '#e3f2fd' : undefined }}>
                      <td>{c.name}</td>
                      <td>{c.professor}</td>
                      <td>{c.department}</td>
                      <td>{c.time}</td>
                      <td>
                        {isEnrolled ? (
                          <button onClick={() => handleCancel(c)} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>취소</button>
                        ) : (
                          <button onClick={() => handleEnroll(c)} disabled={!canEnroll(c)} style={{ background: canEnroll(c) ? '#1976d2' : '#eee', color: canEnroll(c) ? '#fff' : '#aaa', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 500, cursor: canEnroll(c) ? 'pointer' : 'not-allowed' }}>신청</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginBottom: 18, fontWeight: 600, fontSize: 18, color: '#2d3e50' }}>내 시간표</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, background: '#fafbfc' }}>
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
                    {days.map((day, j) => (
                      <td key={day} style={{ minWidth: 100, background: timetable[i][j] ? '#bbdefb' : undefined, color: '#222', fontWeight: timetable[i][j] ? 600 : undefined }}>
                        {timetable[i][j] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
} 