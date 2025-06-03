import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

// Dashboard의 dummyNotices와 동일하게 복사/사용
const dummyNotices = [
  { id: 1, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "주교재에서도 Euler's formula 및 Euler's identity를 혼용해서 설명하고 있으니 참고하시기 바랍니다.", content: '감사합니다.' },
  { id: 2, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "Euler's formula 및 Euler's identity 관련 링크", content: '' },
  { id: 3, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "수업시간에 공지해드린대로 휴강에 대한 녹화동영상들 및 관련 응용 문제들도 기말고사 범위에 포함됩니다.", content: '' },
  { id: 4, course: '소프트웨어공학', date: '2025-06-01', type: '강의 자료실', title: '11-2 Reliability', content: '' },
  { id: 5, course: '회로이론', date: '2025-05-29', type: '강의 공지사항', title: '6.12.(목) 휴강 및 이에 대한 보강으로 6.13.(금) 18:00~19:15 기말고사 대면실시 예정입니다.', content: '' },
];

// 임시 유저 정보 (실제 연동 시 props로 대체)
const dummyUser = { name: '김동규', studentId: '2022202004' };

export default function NoticeDetail() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const idx = dummyNotices.findIndex(n => String(n.id) === String(noticeId));
  const notice = dummyNotices[idx];
  const prev = dummyNotices[idx - 1] || null;
  const next = dummyNotices[idx + 1] || null;

  // 메뉴 오버레이 상태 및 위치
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });

  if (!notice) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="dashboard-root">
      {/* 상단 헤더/유저정보/메뉴 */}
      <div className="dashboard-header" style={{ borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="dashboard-title">학사관리시스템</div>
          <button ref={menuBtnRef} style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={() => {
            if (menuBtnRef.current) {
              const rect = menuBtnRef.current.getBoundingClientRect();
              setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            }
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user">
          <span>{dummyUser.name}({dummyUser.studentId})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={dummyUser} />
        </>
      )}
      <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          {/* 타이틀 영역 */}
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>강의 공지사항</div>
            <div style={{ fontWeight: 700, fontSize: 21, color: '#222', marginBottom: 10, lineHeight: 1.4 }}>{notice.title}</div>
            <div style={{ color: '#888', fontSize: 15, marginBottom: 0, display: 'flex', gap: 18 }}>
              <span>작성자: <b>교수자</b></span>
              <span>등록일: {notice.date}</span>
              <span>조회수: 6</span>
            </div>
          </div>
          {/* 본문 영역 */}
          <div style={{ padding: '40px', fontSize: 17, color: '#222', lineHeight: 1.8, minHeight: 120, background: '#fff', borderBottom: '1px solid #eee' }}>
            {notice.content || notice.title}
          </div>
          {/* 이전/다음글 */}
          <div style={{ borderTop: '1px solid #eee', padding: '18px 40px', fontSize: 15, color: '#444', display: 'flex', justifyContent: 'space-between', gap: 16, background: '#f7f7fa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <b style={{ color: '#222' }}>이전 글</b> : {prev ? <a href={`/notice/${prev.id}`} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>{prev.title}</a> : <span style={{ color: '#aaa' }}>이전글이 없습니다.</span>}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <b style={{ color: '#222' }}>다음 글</b> : {next ? <a href={`/notice/${next.id}`} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>{next.title}</a> : <span style={{ color: '#aaa' }}>다음글이 없습니다.</span>}
            </div>
          </div>
          {/* 목록 버튼 */}
          <div style={{ textAlign: 'center', margin: '36px 0 32px 0' }}>
            <button onClick={() => navigate('/notices')} style={{ background: '#ececec', color: '#333', border: 'none', borderRadius: 6, padding: '12px 44px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>목록</button>
          </div>
        </section>
      </main>
    </div>
  );
} 