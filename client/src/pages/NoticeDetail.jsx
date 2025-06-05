import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

export default function NoticeDetail({ user: propUser, setUser }) {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [user, setUserState] = useState(propUser);

  useEffect(() => {
    let realUser = propUser;
    if (!realUser || !realUser._id) {
      try {
        const userStr = localStorage.getItem('user');
        realUser = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
      } catch (e) { realUser = null; }
    }
    setUserState(realUser);
    if (!realUser?._id) {
      setError('사용자 정보를 찾을 수 없습니다.');
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/notices/${noticeId}`, {
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
        setNotice(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [noticeId, propUser]);

  const handleBack = () => {
    navigate('/notices');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafbfc 100%)' }}>
      {/* 상단 헤더 */}
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
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#2d3e50', fontWeight: 700, fontSize: 24, letterSpacing: 0.5 }}>
            공지사항 상세
          </h2>
          <button 
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              background: '#e1bee7',
              color: '#2d3e50',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            목록으로
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, border: '1px solid #e0e0e0', minHeight: 200 }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}>로딩 중...</div>
          ) : error ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>{error}</div>
          ) : !notice ? (
            <div style={{ padding: 48, textAlign: 'center' }}>공지사항을 찾을 수 없습니다.</div>
          ) : (
            <>
              <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 16, marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2d3e50', marginBottom: 8 }}>
                  {notice.title}
                </h3>
                <div style={{ display: 'flex', gap: 16, color: '#666', fontSize: 14 }}>
                  <span>과목: {notice.course?.name || '알 수 없음'}</span>
                  <span>작성자: {notice.professor?.name || '알 수 없음'}</span>
                  <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
                  <span>조회수: {notice.views}</span>
                </div>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#333' }}>
                {notice.content}
              </div>
              {notice.fileUrl && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #e0e0e0' }}>
                  <a 
                    href={notice.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#1976d2',
                      textDecoration: 'none'
                    }}
                  >
                    <span>📎</span>
                    {notice.fileName}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 