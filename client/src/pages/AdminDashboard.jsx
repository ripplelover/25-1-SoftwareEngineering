import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideMenu from '../components/SideMenu';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [stats, setStats] = useState(null);
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }

  useEffect(() => {
    fetchUsers();
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      setError('사용자 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { 'x-auth-token': token }
      });
      setStats(res.data);
    } catch (err) {
      setStats(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(users.filter(u => u._id !== id));
      fetchStats();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafbfc 100%)' }}>
      <div className="dashboard-header" style={{ borderRadius: 12, marginBottom: 32, position: 'sticky', top: 0, zIndex: 1000, background: '#26334d', color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="dashboard-title" style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, color: '#fff' }}>관리자 대시보드</div>
          <button style={{ fontSize: '1.2em', background: '#b39ddb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', cursor: 'pointer', marginLeft: 16, fontWeight: 700, boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }} onClick={e => {
            const rect = e.target.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user" style={{ fontWeight: 600, fontSize: 17 }}>
          <span>{user?.name || '관리자'}({user?.email || '-'})</span>
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
        {/* 통계 표시 */}
        {stats && (
          <section style={{ background: '#fff', borderRadius: 12, marginBottom: 24, padding: '32px 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e0e0e0' }}>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 18, color: '#26334d', letterSpacing: 1 }}>사용자 통계</div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 18 }}>
              {/* 전체 카드 */}
              <div style={{ flex: '1 1 180px', background: 'linear-gradient(135deg, #b2dfdb 0%, #80cbc4 100%)', borderRadius: 12, padding: '24px 18px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 32, marginRight: 8 }}>👥</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#00695c' }}>전체</div>
                  <div style={{ fontWeight: 900, fontSize: 26, color: '#004d40' }}>{stats.total}명</div>
                </div>
              </div>
              {/* 권한별 카드 */}
              {stats.byRole && stats.byRole.map(r => (
                <div key={r._id} style={{ flex: '1 1 180px', background: r._id === 'admin' ? 'linear-gradient(135deg, #ffd54f 0%, #ffb300 100%)' : r._id === 'professor' ? 'linear-gradient(135deg, #b39ddb 0%, #7e57c2 100%)' : 'linear-gradient(135deg, #90caf9 0%, #1976d2 100%)', borderRadius: 12, padding: '24px 18px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: 32, marginRight: 8 }}>{r._id === 'admin' ? '🛡️' : r._id === 'professor' ? '🎓' : '🧑‍🎓'}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: r._id === 'admin' ? '#ff8f00' : r._id === 'professor' ? '#4527a0' : '#1565c0' }}>{r._id === 'admin' ? '관리자' : r._id === 'professor' ? '교수' : '학생'}</div>
                    <div style={{ fontWeight: 900, fontSize: 26 }}>{r.count}명</div>
                  </div>
                </div>
              ))}
            </div>
            {/* 학과별 카드 */}
            {stats.byDepartment && stats.byDepartment.filter(d => d._id).length > 0 && (
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 10 }}>
                {stats.byDepartment.filter(d => d._id).map(d => (
                  <div key={d._id} style={{ flex: '1 1 120px', background: 'linear-gradient(135deg, #ffe082 0%, #ffd54f 100%)', borderRadius: 10, padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10, minWidth: 120, marginBottom: 6 }}>
                    <span style={{ fontSize: 20, marginRight: 6 }}>🏫</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: '#b28704' }}>{d._id}</div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: '#795548' }}>{d.count}명</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>전체 사용자 목록</div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            {loading ? <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>로딩 중...</div> : error ? <div style={{ color: 'red', textAlign: 'center', padding: 16 }}>{error}</div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#f5e6fa' }}>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>학번/교번</th>
                    <th>권한</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ padding: '12px 8px' }}>{u.name}</td>
                      <td style={{ padding: '12px 8px' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>{u.studentId || u.professorId || '-'}</td>
                      <td style={{ padding: '12px 8px' }}>{u.role === 'admin' ? '관리자' : u.role === 'professor' ? '교수' : '학생'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <button onClick={() => handleDelete(u._id)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>사용자가 없습니다.</td></tr>
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