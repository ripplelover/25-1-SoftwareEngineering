import React, { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';

export default function GradeInput() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [gradeInputs, setGradeInputs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 교수 담당 과목 목록 불러오기
  useEffect(() => {
    if (!user?._id) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/courses/professor/${user._id}`, {
      headers: { 'x-auth-token': token }
    })
      .then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          console.error('과목 목록 에러:', res.status, msg);
          return [];
        }
        return res.json();
      })
      .then(setCourses)
      .catch(e => { console.error('과목 목록 fetch 실패', e); setCourses([]); });
  }, [user]);

  // 과목 선택 시 학생 목록 및 기존 성적 불러오기
  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    Promise.all([
      fetch(`http://localhost:5000/api/courses/${selectedCourse}/students`, {
        headers: { 'x-auth-token': token }
      }).then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          console.error('학생 목록 에러:', res.status, msg);
          return [];
        }
        return res.json();
      }),
      fetch(`http://localhost:5000/api/grades?courseId=${selectedCourse}`, {
        headers: { 'x-auth-token': token }
      }).then(async res => {
        if (!res.ok) {
          const msg = await res.text();
          console.error('성적 목록 에러:', res.status, msg);
          return [];
        }
        return res.json();
      })
    ]).then(([students, grades]) => {
      setStudents(students);
      setGradeInputs(students.map(s => {
        const g = grades.find(g => g.userId === s._id);
        return {
          id: s.studentId,
          name: s.name,
          userId: s._id,
          grade: g ? g.grade : ''
        };
      }));
    }).finally(() => setLoading(false));
  }, [selectedCourse]);

  // 성적 입력 핸들러
  const handleGradeChange = (idx, value) => {
    setGradeInputs(inputs => inputs.map((s, i) => i === idx ? { ...s, grade: value } : s));
  };

  // 저장(제출) 버튼
  const handleSave = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const course = courses.find(c => c._id === selectedCourse);
      const results = await Promise.all(
        gradeInputs.filter(s => s.grade).map(async s => {
          const res = await fetch('http://localhost:5000/api/grades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({
              userId: s.userId,
              courseId: selectedCourse,
              grade: s.grade,
              professor: user.name,
              courseName: course?.name || '',
              credit: course?.credit || 3,
              type: course?.type || '전공',
              year: 2025,
              semester: '1학기',
              department: course?.department || '소프트웨어학과',
            })
          });
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg);
          }
          return res.json();
        })
      );
      alert('성적이 저장되었습니다!');
    } catch (e) {
      alert('성적 저장 중 오류 발생: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'professor') {
    return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>교수님만 접근 가능한 페이지입니다.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafbfc 100%)' }}>
      <div className="dashboard-header" style={{ borderRadius: 12, marginBottom: 32, position: 'sticky', top: 0, zIndex: 1000, background: '#26334d', color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="dashboard-title" style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, color: '#fff' }}>학사관리시스템</div>
          <button style={{ fontSize: '1.2em', background: '#b39ddb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', cursor: 'pointer', marginLeft: 16, fontWeight: 700, boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }} onClick={e => {
            const rect = e.target.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user" style={{ fontWeight: 600, fontSize: 17 }}>
          <span>{user?.name || '이름없음'}({user?.studentId || '교번없음'})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ marginLeft: 18, background: '#fff', color: '#26334d', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }}>Logout</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={user} />
        </>
      )}
      <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>성적입력</div>
            <div style={{ marginTop: 18 }}>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}>
                <option value="">과목을 선택하세요</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          {selectedCourse && (
            <div style={{ padding: '32px 40px' }}>
              {loading ? <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>로딩 중...</div> : (
              <>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#f5e6fa' }}>
                    <th>학번</th>
                    <th>이름</th>
                    <th>성적</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeInputs.map((s, idx) => (
                    <tr key={s.id}>
                      <td style={{ padding: '12px 8px' }}>{s.id}</td>
                      <td style={{ padding: '12px 8px' }}>{s.name}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <select value={s.grade} onChange={e => handleGradeChange(idx, e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 80 }}>
                          <option value="">성적 선택</option>
                          <option value="A+">A+</option>
                          <option value="A">A</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                          <option value="D+">D+</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleSave} style={{ marginTop: 24, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer' }} disabled={loading}>저장</button>
              </>) }
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 