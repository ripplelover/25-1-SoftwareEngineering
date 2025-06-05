import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

const BG_URL = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80';

export default function Login({ setUser }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || '로그인 실패');
        return;
      }
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('서버 오류');
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      {/* 배경 이미지 + 어두운 오버레이 + 블러 */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `url(${BG_URL}) center center / cover no-repeat`,
        width: '100vw', height: '100vh',
        filter: 'blur(4px) brightness(0.5)'
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'rgba(0,0,0,0.55)'
      }} />
      {/* 중앙 카드 */}
      <div style={{
        position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <form onSubmit={handleSubmit} style={{
          minWidth: 320, maxWidth: 350, width: '100%',
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
          padding: '32px 28px 24px 28px',
          display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center'
        }}>
          <div style={{ fontWeight: 800, fontSize: 22, color: '#2d3e50', letterSpacing: 1, marginBottom: 18, textAlign: 'center' }}>학사관리시스템</div>
          <input
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            placeholder="ID(학번 또는 사번)"
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none',
              background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2,
              boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2
            }}
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="PASSWORD"
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none',
              background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2,
              boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '2px 0 2px 0' }}>
            <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#bdbdbd', marginRight: 7 }} />
            <label htmlFor="remember" style={{ color: '#444', fontSize: 14, userSelect: 'none' }}>아이디 저장</label>
          </div>
          <button type="submit" style={{
            width: '100%', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 0',
            fontWeight: 700, fontSize: 17, letterSpacing: 1, margin: '8px 0 0 0', cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
          }}>로그인</button>
          {error && <div style={{ color: '#c62828', background: '#fff3f3', borderRadius: 8, padding: '10px 0', textAlign: 'center', marginTop: 8, fontWeight: 500, fontSize: 15 }}><span style={{ fontSize: 18, marginRight: 6 }}>⚠️</span>{error}</div>}
          <div style={{ marginTop: 10, textAlign: 'center', width: '100%' }}>
            <button type="button" onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: 15, textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 500 }}>회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
} 