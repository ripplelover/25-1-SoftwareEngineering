import React, { useState, useEffect, useRef } from 'react';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

export default function Grade({ user, setUser }) {
  const [grades, setGrades] = useState([]);
  const [year, setYear] = useState(2025);
  const [semester, setSemester] = useState('1학기');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });

  // 더미 데이터
  const dummyGrades = [
    { _id: '1', courseId: 'CS101', courseName: '소프트웨어공학', credit: 3, grade: 'A+', type: '전공', year: 2025, semester: '1학기', professor: '김교수', department: '컴퓨터공학과' },
    { _id: '2', courseId: 'EE201', courseName: '회로이론', credit: 3, grade: 'B+', type: '전공', year: 2025, semester: '1학기', professor: '이교수', department: '전기전자공학과' },
    { _id: '3', courseId: 'CS301', courseName: '산학협력캡스톤설계', credit: 4, grade: 'A', type: '전공', year: 2025, semester: '1학기', professor: '박교수', department: '컴퓨터공학과' },
    { _id: '4', courseId: 'AR101', courseName: '드로잉', credit: 2, grade: 'B', type: '교양', year: 2025, semester: '1학기', professor: '최교수', department: '디자인학과' },
    { _id: '5', courseId: 'CS401', courseName: 'GPU컴퓨팅', credit: 3, grade: 'A+', type: '전공', year: 2025, semester: '1학기', professor: '정교수', department: '컴퓨터공학과' }
  ];

  useEffect(() => {
    // API 호출 부분 주석 처리
    /*
    if (!user?._id) return;
    fetch(`http://localhost:5000/api/grades/${user._id}`)
      .then(res => res.json())
      .then(setGrades)
      .catch(err => console.error('Error fetching grades:', err));
    */

    // 더미 데이터 사용
    setGrades(dummyGrades);
  }, [user]);

  // Filter grades by year and semester
  const filteredGrades = grades.filter(g => 
    g.year === year && g.semester === semester
  );

  // Calculate statistics
  const totalCredits = filteredGrades.reduce((sum, g) => sum + g.credit, 0);
  const gradePoints = {
    'A+': 4.5, 'A': 4.0, 'B+': 3.5, 'B': 3.0,
    'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0
  };
  const gpa = filteredGrades.length > 0
    ? filteredGrades.reduce((sum, g) => sum + (gradePoints[g.grade] * g.credit), 0) / totalCredits
    : 0;

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
          <span>{user?.name || '이름없음'}({user?.studentId || '학번없음'})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={user} />
        </>
      )}

      <main style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>성적/이수현황</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 18 }}>
              <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }}>
                <option value={2025}>2025년</option>
                <option value={2024}>2024년</option>
              </select>
              <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 80 }}>
                <option value="1학기">1학기</option>
                <option value="2학기">2학기</option>
              </select>
            </div>
          </div>

          <div style={{ padding: '32px 40px' }}>
            {/* 성적 통계 */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 32, background: '#f8f9fa', padding: 24, borderRadius: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#666', marginBottom: 8 }}>이수학점</div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{totalCredits}학점</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#666', marginBottom: 8 }}>평점평균</div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{gpa.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#666', marginBottom: 8 }}>수강과목</div>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{filteredGrades.length}과목</div>
              </div>
            </div>

            {/* 성적표 */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f5e6fa' }}>
                  <th>과목명</th>
                  <th>이수구분</th>
                  <th>학점</th>
                  <th>등급</th>
                  <th>교수명</th>
                  <th>학과</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 48 }}>
                      <div style={{ fontSize: 18, marginBottom: 12 }}>조회된 성적이 없습니다</div>
                      <div style={{ fontSize: 40, color: '#e0e0e0' }}>📄</div>
                    </td>
                  </tr>
                ) : filteredGrades.map(grade => (
                  <tr key={grade._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>{grade.courseName}</td>
                    <td style={{ padding: '12px 8px' }}>{grade.type}</td>
                    <td style={{ padding: '12px 8px' }}>{grade.credit}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 600, color: grade.grade === 'F' ? '#d32f2f' : '#1976d2' }}>{grade.grade}</td>
                    <td style={{ padding: '12px 8px' }}>{grade.professor}</td>
                    <td style={{ padding: '12px 8px' }}>{grade.department}</td>
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