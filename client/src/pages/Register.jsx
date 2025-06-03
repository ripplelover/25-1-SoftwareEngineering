import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

const BG_URL = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80';

export default function Register({ setUser }) {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [grade, setGrade] = useState('1');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    const user = {
      name,
      studentId,
      password,
      email,
      department,
      role,
      ...(role === 'student' ? { major, grade } : {})
    };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    navigate('/dashboard');
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
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none',
              background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2,
              boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2
            }}
          >
            <option value="student">학생</option>
            <option value="professor">교수</option>
          </select>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} autoFocus />
          <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder={role === 'student' ? '학번' : '교번'} style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="비밀번호 확인" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />
          <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="학과" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />
          {role === 'student' && <input type="text" value={major} onChange={e => setMajor(e.target.value)} placeholder="전공" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />}
          {role === 'student' && <input type="number" min="1" max="5" value={grade} onChange={e => setGrade(e.target.value)} placeholder="학년" style={{ width: '100%', padding: '13px 16px', borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#f7f7fa', color: '#222', fontSize: 16, marginBottom: 2, boxSizing: 'border-box', fontWeight: 500, letterSpacing: 0.2 }} />}
          <button type="submit" style={{ width: '100%', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 0', fontWeight: 700, fontSize: 17, letterSpacing: 1, margin: '8px 0 0 0', cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>회원가입</button>
          {error && <div style={{ color: '#c62828', background: '#fff3f3', borderRadius: 8, padding: '10px 0', textAlign: 'center', marginTop: 8, fontWeight: 500, fontSize: 15 }}><span style={{ fontSize: 18, marginRight: 6 }}>⚠️</span>{error}</div>}
          <div style={{ marginTop: 10, textAlign: 'center', width: '100%' }}>
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: 15, textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 500 }}>로그인</button>
          </div>
        </form>
      </div>
    </div>
  );
} 