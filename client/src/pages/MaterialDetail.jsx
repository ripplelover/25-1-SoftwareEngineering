import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';

const dummyMaterials = [
  { id: 1, title: '강의자료1.pdf', uploader: '김교수', date: '2024-06-01', file: null, fileName: '강의자료1.pdf', viewCount: 17, content: '11-2 Reliability 강의자료입니다.' },
  { id: 2, title: '실습자료2.zip', uploader: '김교수', date: '2024-06-03', file: null, fileName: '실습자료2.zip', viewCount: 20, content: '실습자료입니다.' }
];

export default function MaterialDetail() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/materials/${id}`, { headers: { 'x-auth-token': token } });
        setMaterial(res.data);
      } catch (err) {
        setError('자료를 불러오지 못했습니다.');
      }
    };
    fetchDetail();
  }, [id]);

  const handleDownload = () => {
    if (material?.fileUrl) {
      window.open(`http://localhost:5000${material.fileUrl}`, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/materials/${id}`, { headers: { 'x-auth-token': token } });
      alert('삭제되었습니다.');
      navigate(-1);
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  if (!material) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>자료를 찾을 수 없습니다.</div>;

  // 이전/다음글
  const idx = dummyMaterials.findIndex(m => String(m.id) === String(id));
  const prev = dummyMaterials[idx - 1];
  const next = dummyMaterials[idx + 1];

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
      <main style={{ maxWidth: 700, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>자료실 상세</div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            {error && <div style={{ color: 'red', marginBottom: 18 }}>{error}</div>}
            {!material ? <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>로딩 중...</div> : (
              <>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{material.title}</div>
                <div style={{ color: '#666', marginBottom: 8 }}>
                  <b>과목명:</b> {material.course?.name || '-'} &nbsp;|
                  <b> 작성자:</b> {material.uploaderName || material.uploader?.name || '-'} &nbsp;|
                  <b> 구분:</b> {material.uploaderRole === 'professor' ? '교수' : '학생'} &nbsp;|
                  <b> 등록일:</b> {material.createdAt ? new Date(material.createdAt).toLocaleDateString() : '-'} &nbsp;|
                  <b> 조회수:</b> {material.viewCount}
                </div>
                <div style={{ margin: '18px 0', fontSize: 17, minHeight: 60, color: '#222', background: '#f7f7fa', borderRadius: 8, padding: 18 }}>{material.content || <span style={{ color: '#aaa' }}>내용 없음</span>}</div>
                {material.fileName && (
                  <div style={{ marginBottom: 18 }}>
                    <b>첨부파일:</b> <button style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={handleDownload}>다운로드</button> <span style={{ color: '#888', marginLeft: 8 }}>{material.fileName}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  <button onClick={() => navigate(-1)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>목록</button>
                  {(user && material.uploader && (user._id === material.uploader || user._id === material.uploader?._id)) && (
                    <>
                      <button onClick={() => navigate(`/materials?course=${material.course?._id}`)} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>수정</button>
                      <button onClick={handleDelete} style={{ background: '#fff', color: 'red', border: '1px solid #e57373', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 