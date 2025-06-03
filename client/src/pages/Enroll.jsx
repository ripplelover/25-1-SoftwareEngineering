import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

export default function Enroll() {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
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
      
      // 전체 과목 목록 조회
      const allRes = await axios.get('http://localhost:5000/api/courses', {
        headers: { 'x-auth-token': token }
      });
      setAllCourses(allRes.data);

      // 수강신청한 과목 목록 조회
      const enrolledRes = await axios.get(`http://localhost:5000/api/courses/student/${user._id}`, {
        headers: { 'x-auth-token': token }
      });
      setEnrolledCourses(enrolledRes.data);
    } catch (err) {
      setError('과목 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user || !user._id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/enroll/${courseId}`, {
        studentId: user._id
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('수강신청이 완료되었습니다.');
      fetchCourses(); // 목록 새로고침
    } catch (err) {
      setError(err.response?.data?.message || '수강신청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (courseId) => {
    if (!user || !user._id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!window.confirm('정말 수강신청을 취소하시겠습니까?')) return;
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/drop/${courseId}`, {
        studentId: user._id
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('수강신청이 취소되었습니다.');
      fetchCourses(); // 목록 새로고침
    } catch (err) {
      setError('수강신청 취소에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c._id === courseId);
  };

  // 시간표(요일x교시)
  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const timetable = Array.from({ length: periods.length }, () => Array(days.length).fill(''));

  // 수강신청한 과목의 시간 정보를 시간표에 채우기
  enrolledCourses.forEach(course => {
    if (!course.time) return;
    course.time.split(',').forEach(slot => {
      const match = slot.trim().match(/([월화수목금])\s*(\d{1,2})(?:-(\d{1,2}))?교시\/([^,]+)/);
      if (match) {
        const dayIdx = days.indexOf(match[1]);
        const start = parseInt(match[2], 10);
        const end = match[3] ? parseInt(match[3], 10) : start;
        for (let p = start; p <= end; p++) {
          if (dayIdx !== -1 && p >= 1 && p <= periods.length) {
            timetable[p-1][dayIdx] = course.name + '\n' + match[4];
          }
        }
      }
    });
  });

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
          <span>{user?.name || '이름없음'}({user?.studentId || '학번없음'})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ marginLeft: 18, background: '#fff', color: '#26334d', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }}>Logout</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={user} />
        </>
      )}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 18 }}>수강신청</h2>
        {error && <div style={{ color: 'red', marginBottom: 16, padding: 12, background: '#ffebee', borderRadius: 4 }}>{error}</div>}
        
        {/* 수강신청한 과목 목록 */}
        <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', padding: 24, border: '1px solid #e0e0e0', marginBottom: 32 }}>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>수강신청한 과목</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#f5f5f7' }}>
                <th>과목명</th>
                <th>교수명</th>
                <th>강의실</th>
                <th>시간</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map(course => (
                <tr key={course._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{course.name}</td>
                  <td>{course.professor}</td>
                  <td>{course.room}</td>
                  <td>{course.time}</td>
                  <td>
                    <button onClick={() => handleDrop(course._id)} style={{ color: 'red' }}>수강취소</button>
                  </td>
                </tr>
              ))}
              {enrolledCourses.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>수강신청한 과목이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 전체 과목 목록 */}
        <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', padding: 24, border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>전체 과목 목록</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#f5f5f7' }}>
                <th>과목명</th>
                <th>교수명</th>
                <th>강의실</th>
                <th>시간</th>
                <th>수강인원</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map(course => (
                <tr key={course._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{course.name}</td>
                  <td>{course.professor}</td>
                  <td>{course.room}</td>
                  <td>{course.time}</td>
                  <td>{course.students?.length || 0}명</td>
                  <td>
                    {isEnrolled(course._id) ? (
                      <span style={{ color: '#4caf50' }}>수강신청완료</span>
                    ) : (
                      <button onClick={() => handleEnroll(course._id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>수강신청</button>
                    )}
                  </td>
                </tr>
              ))}
              {allCourses.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>과목이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 내 시간표 */}
        <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', padding: 24, border: '1px solid #e0e0e0', marginTop: 32 }}>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>내 시간표</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#f5f5f7' }}>
                <th>교시</th>
                {days.map(day => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, i) => (
                <tr key={period}>
                  <td>{period}교시</td>
                  {days.map((day, j) => (
                    <td key={day} style={{ minWidth: 100, whiteSpace: 'pre-line', background: timetable[i][j] ? '#e3f2fd' : undefined, color: '#222', fontWeight: timetable[i][j] ? 600 : undefined }}>
                      {timetable[i][j] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
} 