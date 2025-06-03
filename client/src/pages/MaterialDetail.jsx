import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';

const dummyMaterials = [
  { id: 1, title: '강의자료1.pdf', uploader: '김교수', date: '2024-06-01', file: null, fileName: '강의자료1.pdf', viewCount: 17, content: '11-2 Reliability 강의자료입니다.' },
  { id: 2, title: '실습자료2.zip', uploader: '김교수', date: '2024-06-03', file: null, fileName: '실습자료2.zip', viewCount: 20, content: '실습자료입니다.' }
];

export default function MaterialDetail({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [material, setMaterial] = useState(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const mat = dummyMaterials.find(m => String(m.id) === String(id));
    setMaterial(mat);
    if (mat) setViewCount(mat.viewCount + 1);
  }, [id]);

  // 파일 다운로드 (더미)
  const handleDownload = (file, fileName) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!material) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>자료를 찾을 수 없습니다.</div>;

  // 이전/다음글
  const idx = dummyMaterials.findIndex(m => String(m.id) === String(id));
  const prev = dummyMaterials[idx - 1];
  const next = dummyMaterials[idx + 1];

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
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>{material.title}</div>
            <div style={{ color: '#666', marginBottom: 8 }}>
              작성자: {material.uploader} &nbsp; 등록일: {material.date} &nbsp; 조회수: {viewCount}
            </div>
            <div style={{ marginBottom: 8 }}>
              파일: {material.fileName ? (
                <button style={{ marginLeft: 8, background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDownload(material.file, material.fileName)}>다운로드</button>
              ) : '파일 없음'}
            </div>
          </div>
          <div style={{ padding: '32px 40px', minHeight: 120, fontSize: 16 }}>
            {material.content}
          </div>
          <div style={{ borderTop: '1px solid #eee', padding: '18px 40px', fontSize: 15, color: '#444', display: 'flex', justifyContent: 'space-between', gap: 16, background: '#f7f7fa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <b style={{ color: '#222' }}>이전 글</b> : {prev ? <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/materials/${prev.id}`)}>{prev.title}</span> : <span style={{ color: '#aaa' }}>이전글이 없습니다.</span>}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <b style={{ color: '#222' }}>다음 글</b> : {next ? <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/materials/${next.id}`)}>{next.title}</span> : <span style={{ color: '#aaa' }}>다음글이 없습니다.</span>}
            </div>
          </div>
          <div style={{ textAlign: 'center', margin: '36px 0 32px 0' }}>
            <button onClick={() => navigate('/materials')} style={{ background: '#ececec', color: '#333', border: 'none', borderRadius: 6, padding: '12px 44px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>목록</button>
          </div>
        </section>
      </main>
    </div>
  );
} 