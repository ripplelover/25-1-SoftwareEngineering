import React, { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AssignmentRoom() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }
  const [assignments, setAssignments] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDue, setEditDue] = useState('');
  const [submitBlob, setSubmitBlob] = useState(null);
  const navigate = useNavigate();

  // 과제 목록 조회
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/assignments', {
          headers: { 'x-auth-token': token }
        });
        setAssignments(response.data);
      } catch (err) {
        console.error('과제 목록 조회 실패:', err);
        alert('과제 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchAssignments();
  }, []);

  // 파일 업로드
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      throw err;
    }
  };

  // 과제 등록
  const handleAdd = async () => {
    if (!newTitle || !newDue || !newFile) return;
    try {
      const token = localStorage.getItem('token');
      const { fileUrl, fileName } = await handleFileUpload(newFile);
      
      const response = await axios.post('http://localhost:5000/api/assignments', {
        title: newTitle,
        content: '과제 내용...', // 임시
        dueDate: newDue,
        fileUrl,
        fileName
      }, {
        headers: { 'x-auth-token': token }
      });
      setAssignments([response.data, ...assignments]);
      setNewTitle(''); setNewDue(''); setNewFile(null);
    } catch (err) {
      console.error('과제 등록 실패:', err);
      alert('과제 등록에 실패했습니다.');
    }
  };

  // 과제 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (err) {
      console.error('과제 삭제 실패:', err);
      alert('과제 삭제에 실패했습니다.');
    }
  };

  // 과제 수정
  const handleEdit = (id) => {
    const a = assignments.find(a => a._id === id);
    setEditId(id);
    setEditTitle(a.title);
    setEditDue(a.dueDate);
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/assignments/${id}`, {
        title: editTitle,
        dueDate: editDue
      }, {
        headers: { 'x-auth-token': token }
      });
      setAssignments(assignments.map(a => a._id === id ? response.data : a));
      setEditId(null); setEditTitle(''); setEditDue('');
    } catch (err) {
      console.error('과제 수정 실패:', err);
      alert('과제 수정에 실패했습니다.');
    }
  };

  // 학생 과제 제출
  const handleSubmit = async (id) => {
    if (!submitBlob) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', submitBlob);

      const response = await axios.post(`http://localhost:5000/api/assignments/${id}/submit`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setAssignments(assignments.map(a => a._id === id ? response.data : a));
      setSubmitBlob(null);
      alert('제출이 완료되었습니다.');
    } catch (err) {
      console.error('과제 제출 실패:', err);
      alert('과제 제출에 실패했습니다.');
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
      <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>과제</div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            {user?.role === 'professor' && (
              <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="과제명 입력" style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
                <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 140 }} />
                <input type="file" onChange={e => setNewFile(e.target.files[0])} />
                <button onClick={handleAdd} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>등록</button>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f5e6fa' }}>
                  <th>번호</th>
                  <th>제목</th>
                  <th>마감일</th>
                  <th>파일</th>
                  {user?.role === 'professor' && <th>관리</th>}
                  {user?.role === 'student' && <th>제출여부</th>}
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, idx) => (
                  <tr key={a._id}>
                    <td style={{ padding: '12px 8px' }}>{assignments.length - idx}</td>
                    <td style={{ padding: '12px 8px', color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/assignments/${a._id}`)}>{a.title}</td>
                    <td style={{ padding: '12px 8px' }}>{new Date(a.dueDate).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px' }}>{a.fileName ? a.fileName : '파일 없음'}</td>
                    {user?.role === 'professor' && (
                      <td style={{ padding: '12px 8px' }}>
                        <button onClick={() => handleEdit(a._id)} style={{ marginRight: 8 }}>수정</button>
                        <button onClick={() => handleDelete(a._id)} style={{ color: 'red' }}>삭제</button>
                        <button onClick={() => navigate(`/assignments/${a._id}`)} style={{ marginLeft: 8, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>제출 현황 보기</button>
                      </td>
                    )}
                    {user?.role === 'student' && (
                      <td style={{ padding: '12px 8px' }}>
                        {a.submissions.some(s => s.student._id === user._id) ? '제출완료' : '미제출'}
                      </td>
                    )}
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr><td colSpan={user?.role === 'professor' ? 5 : 5} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>과제가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
} 