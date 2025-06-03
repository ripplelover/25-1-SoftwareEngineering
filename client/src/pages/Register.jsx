import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

export default function Register({ setUser }) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 더미 회원가입
    const user = { name, studentId, role };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f7f7fa'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '40px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 32,
          color: '#2d3e50'
        }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            marginBottom: 8,
            letterSpacing: 0.5
          }}>회원가입</h1>
          <p style={{ 
            color: '#666',
            fontSize: 16
          }}>새로운 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#2d3e50',
              fontWeight: 500
            }}>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 6,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#2d3e50',
              fontWeight: 500
            }}>학번</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 6,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="학번을 입력하세요"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#2d3e50',
              fontWeight: 500
            }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 6,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#2d3e50',
              fontWeight: 500
            }}>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 6,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#2d3e50',
              fontWeight: 500
            }}>역할</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 6,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                background: '#fff'
              }}
            >
              <option value="student">학생</option>
              <option value="professor">교수</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '14px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8,
              transition: 'background-color 0.2s'
            }}
          >
            회원가입
          </button>

          <div style={{ 
            textAlign: 'center', 
            marginTop: 16,
            color: '#666'
          }}>
            이미 계정이 있으신가요?{' '}
            <a 
              href="/login" 
              style={{ 
                color: '#1976d2', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              로그인
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 