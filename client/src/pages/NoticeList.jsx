import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

export default function NoticeList({ user, setUser }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const courseList = Array.from(new Set(notices.map(n => n.course?.name).filter(Boolean)));
  const filteredNotices = selectedCourse === 'all'
    ? notices
    : notices.filter(n => n.course?.name === selectedCourse);

  useEffect(() => {
    let realUser = user;
    if (!realUser || !realUser._id) {
      try {
        const userStr = localStorage.getItem('user');
        realUser = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
      } catch (e) { realUser = null; }
    }
    if (!realUser?._id) {
      setError('사용자 정보를 찾을 수 없습니다.');
      return;
    }
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/notices', {
      headers: { 
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '공지사항 조회에 실패했습니다.');
        }
        return res.json();
      })
      .then(data => {
        setNotices(data);
      })
      .catch(err => {
        setError(err.message);
        setNotices([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseParam = params.get('course');
    if (courseParam) setSelectedCourse(courseParam);
  }, [location.search]);

  const handleNoticeClick = (noticeId) => {
    navigate(`/notice/${noticeId}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafbfc 100%)' }}>
      {/* 상단 헤더 */}
      <div className="dashboard-header" style={{ borderRadius: 12, marginBottom: 32, position: 'sticky', top: 0, zIndex: 1000, background: '#26334d', color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="dashboard-title" style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, color: '#fff' }}>학사관리시스템</div>
          <button ref={menuBtnRef} style={{ fontSize: '1.2em', background: '#b39ddb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', cursor: 'pointer', marginLeft: 16, fontWeight: 700, boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }} onClick={e => {
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
        <h2 style={{ color: '#2d3e50', fontWeight: 800, marginBottom: 24, fontSize: 28, letterSpacing: 1 }}>과목별 공지사항</h2>
        <div style={{ marginBottom: 16 }}>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            <option value="all">전체 과목</option>
            {courseList.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        {loading && <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>로딩 중...</div>}
        {error && <div style={{ padding: 32, textAlign: 'center', color: '#b71c1c', fontWeight: 600 }}>{error}</div>}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead style={{ background: '#f5f5f7' }}>
              <tr>
                <th style={{ padding: '14px 8px', color: '#666', fontWeight: 700, borderBottom: '1px solid #e0e0e0' }}>날짜</th>
                <th style={{ padding: '14px 8px', color: '#666', fontWeight: 700, borderBottom: '1px solid #e0e0e0' }}>과목</th>
                <th style={{ padding: '14px 8px', color: '#666', fontWeight: 700, borderBottom: '1px solid #e0e0e0' }}>제목</th>
                <th style={{ padding: '14px 8px', color: '#666', fontWeight: 700, borderBottom: '1px solid #e0e0e0' }}>작성자</th>
                <th style={{ padding: '14px 8px', color: '#666', fontWeight: 700, borderBottom: '1px solid #e0e0e0' }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 48 }}>공지사항이 없습니다.</td>
                </tr>
              ) : (
                filteredNotices.map(notice => (
                  <tr 
                    key={notice._id}
                    onClick={() => handleNoticeClick(notice._id)}
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f5f5f7'}
                    onMouseOut={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid #e0e0e0' }}>
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid #e0e0e0' }}>
                      {notice.course?.name || '알 수 없음'}
                    </td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid #e0e0e0', color: '#1976d2', fontWeight: 600 }}>
                      {notice.title}
                    </td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid #e0e0e0' }}>
                      {notice.professor?.name || '알 수 없음'}
                    </td>
                    <td style={{ padding: '14px 8px', borderBottom: '1px solid #e0e0e0' }}>
                      {notice.views}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 