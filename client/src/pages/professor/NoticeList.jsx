import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../../components/SideMenu';
import axios from 'axios';

export default function NoticeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const noticesPerPage = 10;
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
        setError('공지사항 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
    // eslint-disable-next-line
  }, []);

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
        <h2>공지사항 관리</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button onClick={() => navigate('/professor/notice/write')} style={{ marginBottom: 16 }}>공지사항 작성</button>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>과목</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>첨부</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.map((n, idx) => (
              <tr key={n._id}>
                <td>{filteredNotices.length - (indexOfFirstNotice + idx)}</td>
                <td>
                  <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate(`/professor/notice/${n._id}`)}>
                    {n.title}
                  </span>
                </td>
                <td>{n.course?.name || '-'}</td>
                <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                <td>{n.views}</td>
                <td>{n.fileName ? 'O' : '-'}</td>
                <td>
                  <button onClick={() => navigate(`/professor/notice/edit/${n._id}`)}>수정</button>
                  <button onClick={() => navigate(`/professor/notice/delete/${n._id}`)}>삭제</button>
                </td>
              </tr>
            ))}
            {currentNotices.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>공지사항이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => handlePageChange(i + 1)} style={{ margin: '0 4px' }}>
              {i + 1}
            </button>
          ))}
        </div>
        {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      </div>
    </div>
  );
} 