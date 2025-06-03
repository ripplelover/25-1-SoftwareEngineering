import React from 'react';
import { useNavigate } from 'react-router-dom';

const menuItemStyle = {
  cursor: 'pointer',
  padding: '8px 0',
  borderRadius: 6,
  fontWeight: 500,
  color: '#26334d',
  transition: 'background 0.15s, color 0.15s',
  marginBottom: 2
};
const menuItemHover = {
  background: 'linear-gradient(90deg,#1976d2 60%,#26c6da 100%)',
  color: '#fff'
};

export default function SideMenu({ setMenuOpen, menuPos, user }) {
  const navigate = useNavigate();
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  const [hoverProfIdx, setHoverProfIdx] = React.useState(-1);
  // 교수 전용 메뉴
  const professorMenus = [
    { label: '대시보드', path: '/dashboard' },
    { label: '공지사항 관리', path: '/professor/notice' },
    { label: '자료실 관리', path: '/materials' },
    { label: '과제 관리', path: '/assignments' },
    { label: '학생 목록/성적 관리', path: '/grade-input' }
  ];
  if (user?.role === 'professor') {
    return (
      <div style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', zIndex: 2100 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontWeight: 900, fontSize: 22, marginBottom: 18, color: '#222' }}>교수 전용 관리</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 8, marginBottom: 18 }}>
          {professorMenus.map((m, i) => (
            <li
              key={m.label}
              style={hoverProfIdx === i ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle}
              onMouseEnter={() => setHoverProfIdx(i)}
              onMouseLeave={() => setHoverProfIdx(-1)}
              onClick={() => { navigate(m.path); setMenuOpen(false); }}
            >
              {m.label}
            </li>
          ))}
        </ul>
        <button onClick={() => setMenuOpen(false)} style={{ marginTop: 16, background: '#ececec', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, color: '#26334d', cursor: 'pointer' }}>닫기</button>
      </div>
    );
  }
  // 학생/일반 메뉴
  return (
    <div style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', zIndex: 2100 }} onClick={e => e.stopPropagation()}>
      <h3 style={{ fontWeight: 900, fontSize: 22, marginBottom: 18, color: '#222' }}>기능 목록</h3>
      <div style={{ marginBottom: 18 }}>
        <b>대학생활</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={hoverIdx === 0 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(0)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>수강관리/시간표</li>
          <li style={hoverIdx === 1 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(1)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/grades'); setMenuOpen(false); }}>성적/이수현황</li>
          <li style={hoverIdx === 2 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(2)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/enroll'); setMenuOpen(false); }}>수강신청</li>
          {user?.role === 'professor' && (
            <li style={hoverIdx === 3 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(3)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/grade-input'); setMenuOpen(false); }}>성적입력</li>
          )}
        </ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>강의종합정보</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={hoverIdx === 4 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(4)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/notices'); setMenuOpen(false); }}>강의 공지사항</li>
          <li style={hoverIdx === 5 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(5)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/materials'); setMenuOpen(false); }}>자료실</li>
          <li style={hoverIdx === 6 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(6)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/assignments'); setMenuOpen(false); }}>과제</li>
          <li style={hoverIdx === 7 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(7)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/lecture-plan'); setMenuOpen(false); }}>강의계획서 조회</li>
          <li style={hoverIdx === 8 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(8)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { navigate('/student-materials'); setMenuOpen(false); }}>수강생 자료실</li>
        </ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>공학교육</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={hoverIdx === 9 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(9)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { setMenuOpen(false); }}>상담/평가</li>
        </ul>
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>학사 서비스</b>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={hoverIdx === 10 ? { ...menuItemStyle, ...menuItemHover } : menuItemStyle} onMouseEnter={() => setHoverIdx(10)} onMouseLeave={() => setHoverIdx(-1)} onClick={() => { setMenuOpen(false); }}>등록/행정서비스</li>
        </ul>
      </div>
      <button onClick={() => setMenuOpen(false)} style={{ marginTop: 16, background: '#ececec', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, color: '#26334d', cursor: 'pointer' }}>닫기</button>
    </div>
  );
} 