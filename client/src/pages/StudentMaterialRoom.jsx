import React, { useState } from 'react';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';

export default function StudentMaterialRoom({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [materials, setMaterials] = useState([
    { id: 1, title: '팀 구성', uploader: '안진수', date: '2025-03-17', file: null, fileName: 'team.txt', studentId: '2022202062' },
    { id: 2, title: '팀 구성', uploader: '김태관', date: '2025-03-17', file: null, fileName: 'team2.txt', studentId: '2022202001' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFile, setEditFile] = useState(null);

  // 등록
  const handleAdd = () => {
    if (!newTitle || !newFile) return;
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        title: newTitle,
        uploader: user.name,
        date: new Date().toISOString().slice(0, 10),
        file: newFile,
        fileName: newFile.name,
        studentId: user.studentId
      }
    ]);
    setNewTitle('');
    setNewFile(null);
  };
  // 삭제
  const handleDelete = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };
  // 수정
  const handleEdit = (id) => {
    const m = materials.find(m => m.id === id);
    setEditId(id);
    setEditTitle(m.title);
    setEditFile(null);
  };
  const handleEditSave = (id) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, title: editTitle, file: editFile || m.file, fileName: editFile ? editFile.name : m.fileName } : m));
    setEditId(null);
    setEditTitle('');
    setEditFile(null);
  };
  // 파일 다운로드 (더미 Blob)
  const handleDownload = (file, fileName) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
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
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>수강생 자료실</div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            {user?.role === 'student' && (
              <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="제목 입력" style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
                <input type="file" onChange={e => setNewFile(e.target.files[0])} />
                <button onClick={handleAdd} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>글쓰기</button>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f5e6fa' }}>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>등록일</th>
                  <th>파일</th>
                  {user?.role === 'student' && <th>관리</th>}
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id}>
                    <td style={{ padding: '12px 8px' }}>
                      {editId === m.id ? (
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ padding: '6px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                      ) : (
                        m.title
                      )}
                    </td>
                    <td style={{ padding: '12px 8px' }}>{m.uploader}</td>
                    <td style={{ padding: '12px 8px' }}>{m.date}</td>
                    <td style={{ padding: '12px 8px' }}>
                      {editId === m.id ? (
                        <input type="file" onChange={e => setEditFile(e.target.files[0])} />
                      ) : m.fileName ? (
                        <>
                          {m.fileName}
                          {m.file && (
                            <button style={{ marginLeft: 8, background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDownload(m.file, m.fileName)}>다운로드</button>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#aaa' }}>파일 없음</span>
                      )}
                    </td>
                    {user?.role === 'student' && m.studentId === user.studentId && (
                      <td style={{ padding: '12px 8px' }}>
                        {editId === m.id ? (
                          <>
                            <button onClick={() => handleEditSave(m.id)} style={{ marginRight: 8 }}>저장</button>
                            <button onClick={() => setEditId(null)}>취소</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(m.id)} style={{ marginRight: 8 }}>수정</button>
                            <button onClick={() => handleDelete(m.id)} style={{ color: 'red' }}>삭제</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {materials.length === 0 && (
                  <tr><td colSpan={user?.role === 'student' ? 5 : 4} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>자료가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
} 