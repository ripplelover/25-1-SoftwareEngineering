import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../components/SideMenu';

export default function CourseManage() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [studentModal, setStudentModal] = useState({ open: false, students: [], courseName: '' });
  const navigate = useNavigate();

  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }

  useEffect(() => {
    if (!user || !user._id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = async () => {
    if (!user || !user._id) return;
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/courses/professor/${user._id}`, {
        headers: { 'x-auth-token': token }
      });
      setCourses(res.data);
    } catch (err) {
      setError('과목 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!name || !room || !time) {
      setError('모든 필드를 입력하세요.');
      return;
    }
    // 시간 포맷 검증 (월 1교시/강의실, 수 2-3교시/강의실 등)
    const timePattern = /^([월화수목금]\s*\d{1,2}(-\d{1,2})?교시\/[\w가-힣0-9]+)(,\s*[월화수목금]\s*\d{1,2}(-\d{1,2})?교시\/[\w가-힣0-9]+)*$/;
    if (!timePattern.test(time.trim())) {
      setError('시간 입력 형식이 올바르지 않습니다. 예시를 참고하세요.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/courses', {
        name,
        professor: user.name,
        professorId: user._id,
        room,
        time
      }, {
        headers: { 'x-auth-token': token }
      });
      setCourses([res.data, ...courses]);
      setName(''); setRoom(''); setTime('');
    } catch (err) {
      setError('과목 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !user._id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      setError('과목 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 학생 목록 불러오기
  const handleShowStudents = async (courseId, courseName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}/students`, {
        headers: { 'x-auth-token': token }
      });
      setStudentModal({ open: true, students: res.data, courseName });
    } catch (err) {
      alert('학생 목록을 불러오지 못했습니다.');
    }
  };

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
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 18 }}>과목 관리</h2>
        <form onSubmit={handleAdd} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', padding: 24, border: '1px solid #e0e0e0', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="과목명" style={{ flex: 2, padding: 10, borderRadius: 6, border: '1px solid #bbb' }} />
            <input value={room} onChange={e => setRoom(e.target.value)} placeholder="강의실" style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #bbb' }} />
            <input value={time} onChange={e => setTime(e.target.value)} placeholder="시간(예: 월 1교시/새빛102, 수 2-3교시/새빛203)" style={{ flex: 2, padding: 10, borderRadius: 6, border: '1px solid #bbb' }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          {/* 시간 입력 가이드 */}
          <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
            예시: 월 1교시/새빛102, 수 2-3교시/새빛203<br />
            (요일, 교시, 강의실을 정확히 입력하세요)
          </div>
          <button type="submit" disabled={loading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 38px', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>과목 등록</button>
        </form>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>내 과목 목록</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <thead style={{ background: '#f5f5f7' }}>
            <tr>
              <th>과목명</th>
              <th>강의실</th>
              <th>시간</th>
              <th>수강인원</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{c.name}</td>
                <td>{c.room}</td>
                <td>{c.time}</td>
                <td>
                  <button onClick={() => handleShowStudents(c._id, c.name)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 14px', fontWeight: 600, cursor: 'pointer' }}>
                    {c.students?.length || 0}명
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(c._id)} style={{ color: 'red' }}>삭제</button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>과목이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 학생 목록 모달 */}
      {studentModal.open && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setStudentModal({ open: false, students: [], courseName: '' })}>
          <div style={{ background: '#fff', borderRadius: 10, minWidth: 420, maxWidth: '90vw', padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 18 }}>{studentModal.courseName} 수강 학생 목록</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ background: '#f5f5f7' }}>
                  <th>이름</th>
                  <th>학번</th>
                  <th>이메일</th>
                  <th>학과</th>
                  <th>전공</th>
                  <th>학년</th>
                </tr>
              </thead>
              <tbody>
                {studentModal.students.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.studentId}</td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>{s.major}</td>
                    <td>{s.grade}</td>
                  </tr>
                ))}
                {studentModal.students.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 24 }}>수강 학생이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: 18 }}>
              <button onClick={() => setStudentModal({ open: false, students: [], courseName: '' })} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 500, cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 