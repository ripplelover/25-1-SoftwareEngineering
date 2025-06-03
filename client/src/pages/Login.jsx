import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

export default function Login({ setUser }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 더미 로그인
    const user = {
      name: studentId === '2022202062' ? '안진수' : '김교수',
      studentId: studentId,
      role: studentId === '2022202062' ? 'student' : 'professor'
    };
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
          }}>학사관리시스템</h1>
          <p style={{ 
            color: '#666',
            fontSize: 16
          }}>로그인하여 서비스를 이용하세요</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            로그인
          </button>

          <div style={{ 
            textAlign: 'center', 
            marginTop: 16,
            color: '#666'
          }}>
            계정이 없으신가요?{' '}
            <a 
              href="/register" 
              style={{ 
                color: '#1976d2', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              회원가입
            </a>
          </div>
        </form>

        <div style={{ 
          marginTop: 32, 
          padding: '16px',
          background: '#f7f7fa',
          borderRadius: 6,
          fontSize: 14,
          color: '#666'
        }}>
          <p style={{ marginBottom: 8 }}>테스트 계정:</p>
          <p>학생: 2022202062 / 비밀번호: 아무거나</p>
          <p>교수: 2022202001 / 비밀번호: 아무거나</p>
        </div>
      </div>
    </div>
  );
} 