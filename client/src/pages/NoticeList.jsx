import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css';

const dummyNotices = [
  { id: 1, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "주교재에서도 Euler's formula 및 Euler's identity를 혼용해서 설명하고 있으니 참고하시기 바랍니다.", content: '감사합니다.', author: '황호영', views: 7 },
  { id: 2, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "Euler's formula 및 Euler's identity 관련 링크", content: '', author: '황호영', views: 6 },
  { id: 3, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "수업시간에 공지해드린대로 휴강에 대한 녹화동영상들 및 관련 응용 문제들도 기말고사 범위에 포함됩니다.", content: '', author: '황호영', views: 7 },
  { id: 4, course: '소프트웨어공학', date: '2025-06-01', type: '강의 자료실', title: '11-2 Reliability', content: '', author: '이기춘', views: 6 },
  { id: 5, course: '회로이론', date: '2025-05-29', type: '강의 공지사항', title: '6.12.(목) 휴강 및 이에 대한 보강으로 6.13.(금) 18:00~19:15 기말고사 대면실시 예정입니다.', content: '', author: '황호영', views: 17 },
];
const dummyUser = { name: '김동규', studentId: '2022202004' };

export default function NoticeList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const navigate = useNavigate();
  const filtered = dummyNotices.filter(n =>
    (filter === '전체' || n.course === filter) &&
    (n.title.includes(search) || n.content.includes(search))
  );
  const courses = Array.from(new Set(dummyNotices.map(n => n.course)));

  return (
    <div className="dashboard-root">
      <div className="dashboard-header" style={{ borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="dashboard-title">학사관리시스템</div>
          <button style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={() => navigate('/dashboard')}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user">
          <span>{dummyUser.name}({dummyUser.studentId})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>
      <main style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 8, marginBottom: 32, padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#fafbfc', padding: '24px 32px 16px 32px', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 6 }}>강의 공지사항</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc' }}>
                <option value="전체">전체</option>
                {courses.map(c => <option key={c}>{c}</option>)}
              </select>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="검색어를 입력하세요" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc' }} />
              <button style={{ padding: '6px 18px', borderRadius: 4, background: '#b39ddb', color: '#fff', border: 'none', fontWeight: 500 }}>검색</button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, marginTop: 0 }}>
            <thead style={{ background: '#f5f5f7' }}>
              <tr>
                <th style={{ width: 60 }}>번호</th>
                <th>제목</th>
                <th style={{ width: 120 }}>과목</th>
                <th style={{ width: 120 }}>작성자</th>
                <th style={{ width: 120 }}>작성일</th>
                <th style={{ width: 80 }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>공지사항이 없습니다.</td></tr>
              )}
              {filtered.map((n, i) => (
                <tr key={n.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fafbfc' : '#fff', cursor: 'pointer' }} onClick={() => navigate(`/notice/${n.id}`)}>
                  <td>{n.id}</td>
                  <td style={{ textAlign: 'left', color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>{n.title}</td>
                  <td>{n.course}</td>
                  <td>{n.author}</td>
                  <td>{n.date}</td>
                  <td>{n.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
} 