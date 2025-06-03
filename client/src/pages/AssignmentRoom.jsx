import React, { useState } from 'react';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';

export default function AssignmentRoom({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [assignments, setAssignments] = useState([
    { id: 1, title: '과제1: 프로젝트 계획서', due: '2024-06-10', submissions: [{ student: '홍길동', file: 'plan.pdf' }] },
    { id: 2, title: '과제2: 코드 제출', due: '2024-06-20', submissions: [] }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDue, setEditDue] = useState('');
  const [submitBlob, setSubmitBlob] = useState(null);

  // 등록
  const handleAdd = () => {
    if (!newTitle || !newDue || !newFile) return;
    setAssignments([...assignments, { id: Date.now(), title: newTitle, due: newDue, submissions: [], file: newFile, fileName: newFile.name }]);
    setNewTitle(''); setNewDue(''); setNewFile(null);
  };
  // 삭제
  const handleDelete = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };
  // 수정
  const handleEdit = (id) => {
    const a = assignments.find(a => a.id === id);
    setEditId(id);
    setEditTitle(a.title);
    setEditDue(a.due);
  };
  const handleEditSave = (id) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, title: editTitle, due: editDue } : a));
    setEditId(null); setEditTitle(''); setEditDue('');
  };
  // 파일 다운로드 (더미 Blob)
  const handleDownload = (file, fileName) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  // 학생 제출
  const handleSubmit = (id) => {
    if (!submitBlob) return;
    setAssignments(assignments.map(a => a.id === id ? { ...a, submissions: [...a.submissions, { student: user.name, file: submitBlob, fileName: submitBlob.name }] } : a));
    setSubmitBlob(null);
    alert('제출 완료! (실제 파일 업로드는 더미)');
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-header" style={{ borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="dashboard-title">학사관리시스템</div>
          <button style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={e => {
            const rect = e.target.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
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
                  <th>과제명</th>
                  <th>마감일</th>
                  {user?.role === 'professor' && <th>관리</th>}
                  {user?.role === 'student' && <th>제출</th>}
                  {user?.role === 'professor' && <th>제출현황</th>}
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id}>
                    <td style={{ padding: '12px 8px' }}>
                      {editId === a.id ? (
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ padding: '6px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                      ) : (
                        a.title
                      )}
                      {a.fileName && (
                        <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>({a.fileName})</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {editId === a.id ? (
                        <input type="date" value={editDue} onChange={e => setEditDue(e.target.value)} style={{ padding: '6px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                      ) : (
                        a.due
                      )}
                    </td>
                    {user?.role === 'professor' && (
                      <td style={{ padding: '12px 8px' }}>
                        {editId === a.id ? (
                          <>
                            <button onClick={() => handleEditSave(a.id)} style={{ marginRight: 8 }}>저장</button>
                            <button onClick={() => setEditId(null)}>취소</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(a.id)} style={{ marginRight: 8 }}>수정</button>
                            <button onClick={() => handleDelete(a.id)} style={{ color: 'red' }}>삭제</button>
                            {a.file && (
                              <button style={{ marginLeft: 8, background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDownload(a.file, a.fileName)}>다운로드</button>
                            )}
                          </>
                        )}
                      </td>
                    )}
                    {user?.role === 'student' && (
                      <td style={{ padding: '12px 8px' }}>
                        <input type="file" onChange={e => setSubmitBlob(e.target.files[0])} style={{ marginRight: 8 }} />
                        <button onClick={() => handleSubmit(a.id)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>제출</button>
                        {a.submissions.some(s => s.student === user.name) && <span style={{ marginLeft: 8, color: '#388e3c' }}>제출완료</span>}
                      </td>
                    )}
                    {user?.role === 'professor' && (
                      <td style={{ padding: '12px 8px' }}>
                        {a.submissions.length === 0 ? '제출 없음' : a.submissions.map((s, i) => (
                          <div key={i}>
                            {s.student}: {s.fileName}
                            <button style={{ marginLeft: 8, background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDownload(s.file, s.fileName)}>다운로드</button>
                          </div>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr><td colSpan={user?.role === 'professor' ? 5 : 4} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>과제가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
} 