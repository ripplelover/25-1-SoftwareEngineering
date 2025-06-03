import React, { useState } from 'react';
import SideMenu from '../../components/SideMenu';
import { useNavigate } from 'react-router-dom';

const dummyPlans = [
  { id: 1, course: '소프트웨어공학', professor: '김교수', year: 2024, semester: 1, status: '공개', updated: '2024-03-01', content: '1주차: SW개론\n2주차: 요구분석...' },
  { id: 2, course: 'GPU컴퓨팅', professor: '김교수', year: 2024, semester: 1, status: '비공개', updated: '2024-03-02', content: '1주차: CUDA 소개...' }
];

export default function LecturePlanProfessor() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }
  const [plans, setPlans] = useState(dummyPlans);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState('공개');
  const [newPlan, setNewPlan] = useState({ course: '', year: 2024, semester: 1, status: '공개', content: '' });
  const [showWrite, setShowWrite] = useState(false);
  const navigate = useNavigate();

  // 저장/수정
  const handleSave = () => {
    if (editId) {
      setPlans(plans.map(p => p.id === editId ? { ...p, content: editContent, status: editStatus, updated: new Date().toISOString().slice(0, 10) } : p));
      setEditId(null); setEditContent('');
    } else {
      setPlans([
        ...plans,
        { id: Date.now(), ...newPlan, professor: user?.name, updated: new Date().toISOString().slice(0, 10) }
      ]);
      setShowWrite(false);
      setNewPlan({ course: '', year: 2024, semester: 1, status: '공개', content: '' });
    }
  };
  // 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) setPlans(plans.filter(p => p.id !== id));
  };
  // 수정 모드 진입
  const handleEdit = (plan) => {
    setEditId(plan.id);
    setEditContent(plan.content);
    setEditStatus(plan.status);
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
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 18 }}>강의계획서 관리</h2>
        {!showWrite && editId === null && (
          <button onClick={() => setShowWrite(true)} style={{ marginBottom: 18, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>강의계획서 작성</button>
        )}
        {(showWrite || editId) && (
          <div style={{ background: '#f7f7fa', borderRadius: 10, padding: 24, marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <input value={editId ? plans.find(p => p.id === editId)?.course : newPlan.course} onChange={e => editId ? setPlans(plans.map(p => p.id === editId ? { ...p, course: e.target.value } : p)) : setNewPlan({ ...newPlan, course: e.target.value })} placeholder="과목명" style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180, marginRight: 12 }} />
              <input type="number" value={editId ? plans.find(p => p.id === editId)?.year : newPlan.year} onChange={e => editId ? setPlans(plans.map(p => p.id === editId ? { ...p, year: e.target.value } : p)) : setNewPlan({ ...newPlan, year: e.target.value })} placeholder="년도" style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 90, marginRight: 12 }} />
              <select value={editId ? plans.find(p => p.id === editId)?.semester : newPlan.semester} onChange={e => editId ? setPlans(plans.map(p => p.id === editId ? { ...p, semester: e.target.value } : p)) : setNewPlan({ ...newPlan, semester: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 90, marginRight: 12 }}>
                <option value={1}>1학기</option>
                <option value={2}>2학기</option>
              </select>
              <select value={editId ? editStatus : newPlan.status} onChange={e => editId ? setEditStatus(e.target.value) : setNewPlan({ ...newPlan, status: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: 110 }}>
                <option value="공개">공개</option>
                <option value="비공개">비공개</option>
              </select>
            </div>
            <textarea value={editId ? editContent : newPlan.content} onChange={e => editId ? setEditContent(e.target.value) : setNewPlan({ ...newPlan, content: e.target.value })} placeholder="강의계획서 내용을 입력하세요 (주차별, 평가방식 등)" style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }} />
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button onClick={handleSave} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginRight: 8 }}>저장</button>
              <button onClick={() => { setShowWrite(false); setEditId(null); setEditContent(''); setEditStatus('공개'); }} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>취소</button>
            </div>
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff', marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#f5e6fa' }}>
              <th>과목명</th>
              <th>년도</th>
              <th>학기</th>
              <th>상태</th>
              <th>최종수정일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                <td>{plan.course}</td>
                <td>{plan.year}</td>
                <td>{plan.semester}</td>
                <td>{plan.status}</td>
                <td>{plan.updated}</td>
                <td>
                  <button onClick={() => handleEdit(plan)} style={{ marginRight: 8 }}>수정</button>
                  <button onClick={() => handleDelete(plan.id)} style={{ color: 'red' }}>삭제</button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>강의계획서가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ background: '#f7f7fa', borderRadius: 10, padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>강의계획서 미리보기</h3>
          {plans.map(plan => (
            <div key={plan.id} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
              <b>{plan.course} ({plan.year}-{plan.semester}) [{plan.status}]</b><br />
              <pre style={{ fontFamily: 'inherit', fontSize: 15, margin: 0, whiteSpace: 'pre-wrap' }}>{plan.content}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 