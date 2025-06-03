import React, { useState, useRef } from 'react';
import '../pages/Dashboard.css';

const dummyUser = { name: '김동규', studentId: '2022202004' };
const dummyPlans = [
  { id: 1, year: 2025, semester: '1학기', course: '회로이론', professor: '황호영', department: '전자공학과', major: '전자공학', type: '전공', credit: 3, time: '화 6교시/새빛102, 목 5교시/새빛102', contact: 'hhy@kw.ac.kr', review: '매우 친절', etc: '과제 많음' },
  { id: 2, year: 2025, semester: '1학기', course: '소프트웨어공학', professor: '이기춘', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '월 5교시/새빛203, 수 6교시/새빛203', contact: 'lee@kw.ac.kr', review: '설명이 명확', etc: '조모임 있음' },
];

export default function LecturePlan() {
  const [year, setYear] = useState(2025);
  const [semester, setSemester] = useState('1학기');
  const [mine, setMine] = useState('전체');
  const [course, setCourse] = useState('');
  const [prof, setProf] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [common, setCommon] = useState('전체');
  const [results, setResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });

  const handleSearch = () => {
    // 실제로는 API 호출, 여기선 더미 필터
    setResults(dummyPlans.filter(p =>
      (year ? p.year === year : true) &&
      (semester ? p.semester === semester : true) &&
      (mine === '내 과목' ? p.professor === dummyUser.name : true) &&
      (course ? p.course.includes(course) : true) &&
      (prof ? p.professor.includes(prof) : true) &&
      (department ? p.department.includes(department) : true) &&
      (major ? p.major.includes(major) : true) &&
      (common === '전체' ? true : false)
    ));
  };

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
          <div style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', zIndex: 2100 }} onClick={e => e.stopPropagation()}>
            <h3>기능 목록</h3>
            <div style={{ marginBottom: 18 }}>
              <b>대학생활</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { window.location.href = '/dashboard'; setMenuOpen(false); }}>수강관리/시간표</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>성적/이수현황</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>수강신청</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>강의종합정보</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { window.location.href = '/notices'; setMenuOpen(false); }}>강의 공지사항</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>자료실</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>과제</li>
                <li style={{ cursor: 'pointer', padding: '4px 0', color: '#b71c1c', fontWeight: 600 }} onClick={() => { window.location.href = '/lecture-plan'; setMenuOpen(false); }}>강의계획서 조회</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>공학교육</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>상담/평가</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>학사 서비스</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>등록/행정서비스</li>
              </ul>
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ marginTop: 16 }}>닫기</button>
          </div>
        </>
      )}
      <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>강의계획서 조회</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 24, borderBottom: '1px solid #e0e0e0' }}>
              <button style={{ border: 'none', background: 'none', fontWeight: 600, fontSize: 18, color: '#b71c1c', borderBottom: '3px solid #b71c1c', padding: '8px 24px 10px 24px', cursor: 'pointer' }}>학부</button>
              <button style={{ border: 'none', background: 'none', fontWeight: 600, fontSize: 18, color: '#888', borderBottom: '3px solid transparent', padding: '8px 24px 10px 24px', cursor: 'pointer' }}>대학원</button>
            </div>
            <div style={{ padding: '32px 0 0 0' }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
                <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }}>
                  <option value={2025}>2025년</option>
                  <option value={2024}>2024년</option>
                </select>
                <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 80 }}>
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                </select>
                <span style={{ marginLeft: 16, fontWeight: 500 }}>수강 여부</span>
                <label style={{ marginLeft: 8 }}><input type="radio" checked={mine === '전체'} onChange={() => setMine('전체')} /> 전체</label>
                <label style={{ marginLeft: 8 }}><input type="radio" checked={mine === '내 과목'} onChange={() => setMine('내 과목')} /> 내 과목</label>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="과목명" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }} />
                <input value={prof} onChange={e => setProf(e.target.value)} placeholder="교수명" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <select value={common} onChange={e => setCommon(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}>
                  <option value="전체">- 전체 -</option>
                </select>
                <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="학과" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                <input value={major} onChange={e => setMajor(e.target.value)} placeholder="전공" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                <button onClick={handleSearch} style={{ padding: '8px 32px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, marginLeft: 12 }}>조회</button>
              </div>
            </div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f5e6fa' }}>
                  <th>학정번호</th>
                  <th>과목명</th>
                  <th>이수 구분</th>
                  <th>학점 / 시간</th>
                  <th>교수명</th>
                  <th>연락처</th>
                  <th>강의평 (everytime.kr)</th>
                  <th>과제 / 조모임 / 성적</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 48 }}>
                      <div style={{ fontSize: 18, marginBottom: 12 }}>조회된 데이터가 없습니다</div>
                      <div style={{ fontSize: 40, color: '#e0e0e0' }}>📄</div>
                    </td>
                  </tr>
                ) : results.map(plan => (
                  <tr key={plan.id}>
                    <td>{plan.id}</td>
                    <td>{plan.course}</td>
                    <td>{plan.type}</td>
                    <td>{plan.credit} / {plan.time}</td>
                    <td>{plan.professor}</td>
                    <td>{plan.contact}</td>
                    <td>{plan.review}</td>
                    <td>{plan.etc}</td>
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