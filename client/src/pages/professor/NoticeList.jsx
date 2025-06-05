import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../components/SideMenu';
import axios from 'axios';

export default function NoticeList({ user: propUser, setUser }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUserState] = useState(propUser);
  const noticesPerPage = 10;
  const [selectedCourse, setSelectedCourse] = useState('all');
  const courseList = Array.from(new Set(notices.map(n => n.course?.name).filter(Boolean)));

  useEffect(() => {
    if (!propUser) {
      let u = null;
      try {
        const userStr = localStorage.getItem('user');
        u = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
      } catch (e) { u = null; }
      setUserState(u);
    } else {
      setUserState(propUser);
    }
  }, [propUser]);

  useEffect(() => {
    if (!user || !user._id) {
      navigate('/login');
      return;
    }
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/notices', {
          headers: { 'x-auth-token': token }
        });
        setNotices(res.data);
      } catch (err) {
        setError('공지사항 목록을 불러오지 못했습니다. 서버가 꺼져있거나, 네트워크 오류, 또는 권한 문제일 수 있습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [user, navigate]);

  const filteredNotices = selectedCourse === 'all'
    ? notices
    : notices.filter(n => n.course?.name === selectedCourse);

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24, color: '#222' }}>공지사항 관리</h2>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="제목 또는 과목명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
          />
          <button 
            onClick={() => navigate('/professor/notice/write')} 
            style={{ 
              background: '#1976d2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '12px 24px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            공지사항 작성
          </button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            <option value="all">전체 과목</option>
            {courseList.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 24, textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f7' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>번호</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>제목</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>과목</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>작성일</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>조회수</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>첨부</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', color: '#666', fontWeight: 600 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 48 }}>
                    로딩 중...
                  </td>
                </tr>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((n, idx) => (
                  <tr key={n._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '16px', color: '#666' }}>{filteredNotices.length - (indexOfFirstNotice + idx)}</td>
                    <td style={{ padding: '16px' }}>
                      <span 
                        style={{ 
                          color: '#1976d2', 
                          cursor: 'pointer',
                          fontWeight: 500,
                          ':hover': { textDecoration: 'underline' }
                        }} 
                        onClick={() => navigate(`/notice/${n._id}`)}
                      >
                        {n.title}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#666' }}>{n.course?.name || '-'}</td>
                    <td style={{ padding: '16px', color: '#666' }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', color: '#666' }}>{n.views}</td>
                    <td style={{ padding: '16px', color: '#666' }}>{n.fileName ? '📎' : '-'}</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => navigate(`/professor/notice/edit/${n._id}`)}
                        style={{
                          background: '#1976d2',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '6px 12px',
                          marginRight: 8,
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => navigate(`/professor/notice/delete/${n._id}`)}
                        style={{
                          background: '#d32f2f',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#666', padding: 48 }}>
                    {error ? '공지사항을 불러올 수 없습니다.' : '등록된 공지사항이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && !loading && (
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  background: currentPage === i + 1 ? '#1976d2' : '#fff',
                  color: currentPage === i + 1 ? '#fff' : '#666',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 