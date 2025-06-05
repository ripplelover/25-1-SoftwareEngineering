import React, { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function MaterialRoom() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }

  // 쿼리스트링 course 파라미터 있으면 자동 선택 (location.search가 바뀔 때만)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get('course');
    if (courseId) setSelectedCourse(courseId);
  }, [location.search]);

  // 과목 목록 불러오기
  useEffect(() => {
    if (!user || !user._id) return;
    const token = localStorage.getItem('token');
    const fetchCourses = async () => {
      try {
        let url = '';
        if (user.role === 'professor') url = `http://localhost:5000/api/courses/professor/${user._id}`;
        else url = `http://localhost:5000/api/courses/student/${user._id}`;
        const res = await axios.get(url, { headers: { 'x-auth-token': token } });
        setCourses(res.data);
        // 과목 목록이 바뀌었을 때 selectedCourse가 유효하지 않으면 첫 번째 과목으로 초기화
        if (res.data.length > 0 && !res.data.find(c => c._id === selectedCourse)) {
          setSelectedCourse(res.data[0]._id);
        }
      } catch (err) {
        setCourses([]);
      }
    };
    fetchCourses();
    // eslint-disable-next-line
  }, [user]);

  // 자료실 목록 불러오기
  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/materials/course/${selectedCourse}`, { headers: { 'x-auth-token': token } })
      .then(res => setMaterials(res.data))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  // 등록
  const handleAdd = async () => {
    if (!newTitle || !newFile || !selectedCourse) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('title', newTitle);
      formData.append('content', newContent);
      formData.append('course', selectedCourse);
      formData.append('uploaderRole', user.role);
      // 업로더 정보는 서버에서 토큰으로 추출
      const res = await axios.post('http://localhost:5000/api/materials', formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      setMaterials([res.data, ...materials]);
      setNewTitle(''); setNewContent(''); setNewFile(null);
    } catch (err) {
      setError('자료 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/materials/${id}`, { headers: { 'x-auth-token': token } });
      setMaterials(materials.filter(m => m._id !== id));
    } catch (err) {
      setError('자료 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  // 수정
  const handleEdit = (m) => {
    setEditId(m._id);
    setEditTitle(m.title);
    setEditContent(m.content || '');
    setEditFile(null);
  };
  const handleEditSave = async (id) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      if (editFile) formData.append('file', editFile);
      const res = await axios.put(`http://localhost:5000/api/materials/${id}`, formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      setMaterials(materials.map(m => m._id === id ? res.data : m));
      setEditId(null); setEditTitle(''); setEditContent(''); setEditFile(null);
    } catch (err) {
      setError('자료 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  // 파일 다운로드
  const handleDownload = (fileUrl, fileName) => {
    window.open(`http://localhost:5000${fileUrl}`, '_blank');
  };

  useEffect(() => {
    setNewTitle('');
    setNewContent('');
    setNewFile(null);
    setEditId(null);
    setEditTitle('');
    setEditContent('');
    setEditFile(null);
  }, [selectedCourse]);

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
          <span>{user?.name || '이름없음'}({user?.studentId || user?.professorId || 'ID없음'})</span>
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
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>자료실</div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            {/* 과목 선택 */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 160 }}>
                <option value=''>과목 선택</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {/* 등록/수정 폼 */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              {editId ? (
                <>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="자료명" style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
                  <input value={editContent} onChange={e => setEditContent(e.target.value)} placeholder="설명(내용)" style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
                  <input type="file" onChange={e => setEditFile(e.target.files[0])} />
                  <button onClick={() => handleEditSave(editId)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>저장</button>
                  <button onClick={() => setEditId(null)} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>취소</button>
                </>
              ) : (
                <>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="자료명 입력" style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
                  <input value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="설명(내용) 입력" style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
                  <input type="file" onChange={e => setNewFile(e.target.files[0])} />
                  <button onClick={handleAdd} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>등록</button>
                </>
              )}
            </div>
            {/* 자료실 테이블 */}
            {loading ? <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>로딩 중...</div> : error ? <div style={{ color: 'red', textAlign: 'center', padding: 16 }}>{error}</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#f5e6fa' }}>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>구분</th>
                    <th>등록일</th>
                    <th>조회수</th>
                    <th>파일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, idx) => (
                    <tr key={m._id}>
                      <td style={{ padding: '12px 8px' }}>{materials.length - idx}</td>
                      <td style={{ padding: '12px 8px', color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/materials/${m._id}`)}>{m.title}</td>
                      <td style={{ padding: '12px 8px' }}>{m.uploaderName || m.uploader?.name || '-'}</td>
                      <td style={{ padding: '12px 8px' }}>{m.uploaderRole === 'professor' ? '교수' : '학생'}</td>
                      <td style={{ padding: '12px 8px' }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '12px 8px' }}>{m.viewCount}</td>
                      <td style={{ padding: '12px 8px' }}>{m.fileName ? (
                        <button style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDownload(m.fileUrl, m.fileName)}>다운로드</button>
                      ) : '파일 없음'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        {(user && m.uploader && (user._id === m.uploader || user._id === m.uploader?._id)) && (
                          <>
                            <button onClick={() => handleEdit(m)} style={{ marginRight: 8 }}>수정</button>
                            <button onClick={() => handleDelete(m._id)} style={{ color: 'red' }}>삭제</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {materials.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>자료가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 