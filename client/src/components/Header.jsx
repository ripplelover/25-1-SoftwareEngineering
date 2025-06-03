import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

console.log('Header 렌더링됨');

export default function Header({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="main-header" style={{ background: 'red', zIndex: 9999, position: 'relative' }}>
        <div className="header-title">학사관리시스템</div>
        <div className="header-user">
          <span>{user?.name || '이름없음'}({user?.studentId || '학번없음'})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
          <button className="menu-btn" onClick={() => setOpen(true)}>☰ 메뉴</button>
        </div>
      </header>
      {open && (
        <div className="menu-overlay" onClick={() => setOpen(false)}>
          <div className="menu-modal" onClick={e => e.stopPropagation()}>
            <h3>기능 목록</h3>
            <div className="menu-section">
              <b>대학생활</b>
              <ul>
                <li onClick={() => {navigate('/dashboard'); setOpen(false);}}>수강관리/시간표</li>
                <li onClick={() => {navigate('/grades'); setOpen(false);}}>성적/이수현황</li>
                <li onClick={() => {navigate('/enroll'); setOpen(false);}}>수강신청</li>
              </ul>
            </div>
            <div className="menu-section">
              <b>강의종합정보</b>
              <ul>
                <li onClick={() => {navigate('/notice'); setOpen(false);}}>강의 공지사항</li>
                <li onClick={() => {navigate('/material'); setOpen(false);}}>자료실</li>
                <li onClick={() => {navigate('/assignment'); setOpen(false);}}>과제</li>
              </ul>
            </div>
            <div className="menu-section">
              <b>공학교육</b>
              <ul>
                <li onClick={() => {navigate('/consulting'); setOpen(false);}}>상담/평가</li>
              </ul>
            </div>
            <div className="menu-section">
              <b>학사 서비스</b>
              <ul>
                <li onClick={() => {navigate('/admin'); setOpen(false);}}>등록/행정서비스</li>
              </ul>
            </div>
            <button onClick={() => setOpen(false)} style={{marginTop: 16}}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
} 