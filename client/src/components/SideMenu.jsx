import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SideMenu({ setMenuOpen, menuPos, user }) {
  const navigate = useNavigate();
  return (
    <div style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', zIndex: 2100 }} onClick={e => e.stopPropagation()}>
      <h3>기능 목록</h3>
      <div style={{ marginBottom: 18 }}>
        <b>대학생활</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>수강관리/시간표</li>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/grades'); setMenuOpen(false); }}>성적/이수현황</li>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/enroll'); setMenuOpen(false); }}>수강신청</li>
          {user?.role === 'professor' && (
            <li style={{ cursor: 'pointer', padding: '4px 0', color: '#1976d2', fontWeight: 600 }} onClick={() => { navigate('/grade-input'); setMenuOpen(false); }}>성적입력</li>
          )}
        </ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>강의종합정보</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/notices'); setMenuOpen(false); }}>강의 공지사항</li>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/materials'); setMenuOpen(false); }}>자료실</li>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/assignments'); setMenuOpen(false); }}>과제</li>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/lecture-plan'); setMenuOpen(false); }}>강의계획서 조회</li>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { navigate('/student-materials'); setMenuOpen(false); }}>수강생 자료실</li>
        </ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>공학교육</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>상담/평가</li>
        </ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>학사 서비스</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setMenuOpen(false); }}>등록/행정서비스</li>
        </ul>
      </div>
      <button onClick={() => setMenuOpen(false)} style={{ marginTop: 16 }}>닫기</button>
    </div>
  );
} 