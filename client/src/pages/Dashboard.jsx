import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard({ user, setUser }) {
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [noticeDetail, setNoticeDetail] = useState(null);

  // 더미 데이터 (KLAS 스타일)
  const dummyCourses = [
    {
      _id: '1', name: '소프트웨어공학', professor: '홍길동', room: 'IT관 101', time: '월 1-2교시',
      online: '남아있는 강의가 없습니다!',
      assignment: '2개의 과제 중 1개가 10일 후 마감입니다.',
      team: '남아있는 팀 프로젝트가 없습니다!'
    },
    {
      _id: '2', name: '회로이론', professor: '이몽룡', room: 'IT관 102', time: '화 3-4교시',
      online: '남아있는 강의가 없습니다!',
      assignment: '남아있는 과제가 없습니다!',
      team: '남아있는 팀 프로젝트가 없습니다!'
    },
    {
      _id: '3', name: '산학협력캡스톤설계', professor: '성춘향', room: 'IT관 103', time: '수 5-6교시',
      online: '남아있는 강의가 없습니다!',
      assignment: '남아있는 과제가 없습니다!',
      team: '남아있는 팀 프로젝트가 없습니다!'
    },
    {
      _id: '4', name: '드로잉', professor: '임꺽정', room: 'IT관 104', time: '목 1-2교시',
      online: '남아있는 강의가 없습니다!',
      assignment: '남아있는 과제가 없습니다!',
      team: '남아있는 팀 프로젝트가 없습니다!'
    },
    {
      _id: '5', name: 'GPU컴퓨팅', professor: '최길동', room: 'IT관 105', time: '금 3-4교시',
      online: '남아있는 강의가 없습니다!',
      assignment: '남아있는 과제가 없습니다!',
      team: '남아있는 팀 프로젝트가 없습니다!'
    },
  ];

  // 시간표용 더미 데이터 (과목명, 교수명, 강의실, 시간)
  const dummyTimetable = [
    { day: '월', period: 1, name: '소프트웨어공학', professor: '홍길동', room: 'IT관 101', time: '1-2교시' },
    { day: '화', period: 3, name: '회로이론', professor: '이몽룡', room: 'IT관 102', time: '3-4교시' },
    { day: '수', period: 5, name: '산학협력캡스톤설계', professor: '성춘향', room: 'IT관 103', time: '5-6교시' },
    { day: '목', period: 1, name: '드로잉', professor: '임꺽정', room: 'IT관 104', time: '1-2교시' },
    { day: '금', period: 3, name: 'GPU컴퓨팅', professor: '최길동', room: 'IT관 105', time: '3-4교시' },
  ];

  // 과목명별 색상 매핑
  const courseColors = {
    '소프트웨어공학': '#b39ddb',
    '회로이론': '#ffe082',
    '산학협력캡스톤설계': '#80cbc4',
    '드로잉': '#ce93d8',
    'GPU컴퓨팅': '#90caf9',
  };

  // 수강과목 리스트용 더미 데이터 (KLAS 스타일)
  const dummyCourseList = [
    {
      _id: '1',
      name: '소프트웨어공학',
      code: 'I020-4-0846-01',
      professor: '이기춘',
      times: '월 5교시/새빛203, 수 6교시/새빛203',
      noticeNew: false
    },
    {
      _id: '2',
      name: '회로이론',
      code: 'I020-2-1994-02',
      professor: '황호영',
      times: '화 6교시/새빛102, 목 5교시/새빛102',
      noticeNew: true
    },
    {
      _id: '3',
      name: '산학협력캡스톤설계',
      code: 'I020-4-5467-01',
      professor: '이창근',
      times: '화 5교시/새빛102, 목 6교시/새빛102',
      noticeNew: false
    },
    {
      _id: '4',
      name: '드로잉',
      code: 'I000-1-8127-02',
      professor: '이정인',
      times: '화 1,2교시/한울202',
      noticeNew: false
    },
    {
      _id: '5',
      name: 'GPU컴퓨팅',
      code: 'I020-4-9615-01',
      professor: '신동화',
      times: '수 2교시/새빛203',
      noticeNew: false
    },
  ];

  // 공지사항 더미 데이터 (과목별)
  const dummyNotices = [
    { id: 1, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "주교재에서도 Euler's formula 및 Euler's identity를 혼용해서 설명하고 있으니 참고하시기 바랍니다.", content: '감사합니다.' },
    { id: 2, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "Euler's formula 및 Euler's identity 관련 링크", content: '' },
    { id: 3, course: '회로이론', date: '2025-06-03', type: '강의 공지사항', title: "수업시간에 공지해드린대로 휴강에 대한 녹화동영상들 및 관련 응용 문제들도 기말고사 범위에 포함됩니다.", content: '' },
    { id: 4, course: '소프트웨어공학', date: '2025-06-01', type: '강의 자료실', title: '11-2 Reliability', content: '' },
    { id: 5, course: '회로이론', date: '2025-05-29', type: '강의 공지사항', title: '6.12.(목) 휴강 및 이에 대한 보강으로 6.13.(금) 18:00~19:15 기말고사 대면실시 예정입니다.', content: '' },
  ];
  const [noticeModal, setNoticeModal] = useState({ open: false, course: null });

  useEffect(() => {
    if (!user || !user.id) return;
    fetch(`http://localhost:5000/api/courses/${user.id}`)
      .then(res => res.json())
      .then(setCourses);
    fetch(`http://localhost:5000/api/timetable/${user.id}`)
      .then(res => res.json())
      .then(data => setTimetable((data && Array.isArray(data.entries)) ? data.entries : []));
  }, [user]);

  useEffect(() => {
    async function fetchAssignmentsAndNotices() {
      let allAssignments = [];
      let allNotices = [];
      for (const c of courses) {
        const res = await fetch(`http://localhost:5000/api/assignments/${c._id}`);
        const items = await res.json();
        items.forEach(item => {
          if (item.type === 'assignment') allAssignments.push({ ...item, course: c.name });
          else allNotices.push({ ...item, course: c.name });
        });
      }
      setAssignments(allAssignments);
      setNotices(allNotices);
    }
    if (courses.length > 0) fetchAssignmentsAndNotices();
  }, [courses]);

  // 시간표 2차원 배열 만들기 (요일 x 교시, 여러 교시 반영)
  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const timetableData = timetable.length > 0 ? timetable : dummyTimetable;
  const timetableMatrix = Array.from({ length: periods.length }, () => Array(days.length).fill(null));
  const timetableDisplayMatrix = Array.from({ length: periods.length }, () => Array(days.length).fill(null));
  timetableData.forEach(entry => {
    const dayIdx = days.indexOf(entry.day);
    if (dayIdx !== -1 && entry.time) {
      const match = entry.time.match(/(\d+)-(\d+)교시/);
      let start = entry.period;
      let end = entry.period;
      if (match) {
        start = parseInt(match[1], 10);
        end = parseInt(match[2], 10);
      } else if (typeof entry.period === 'number') {
        start = end = entry.period;
      }
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= periods.length) {
          timetableMatrix[p - 1][dayIdx] = entry;
          timetableDisplayMatrix[p - 1][dayIdx] = (p === start);
        }
      }
    }
  });

  return (
    <div className="dashboard-root">
      {/* 상단 유저 정보/로그아웃/메뉴 */}
      <div style={{
        background: '#2d3e50', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', letterSpacing: 2 }}>학사관리시스템</div>
          <button ref={menuBtnRef} style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={() => {
            if (menuBtnRef.current) {
              const rect = menuBtnRef.current.getBoundingClientRect();
              setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            }
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{user?.name || '이름없음'}({user?.studentId || '학번없음'})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </div>
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
          <div style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', zIndex: 2100 }} onClick={e => e.stopPropagation()}>
            <h3>기능 목록</h3>
            <div style={{ marginBottom: 18 }}>
              <b>대학생활</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('dashboard'); setMenuOpen(false); }}>수강관리/시간표</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('grades'); setMenuOpen(false); }}>성적/이수현황</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('enroll'); setMenuOpen(false); }}>수강신청</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>강의종합정보</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('notice'); setMenuOpen(false); }}>강의 공지사항</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('material'); setMenuOpen(false); }}>자료실</li>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('assignment'); setMenuOpen(false); }}>과제</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>공학교육</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('consulting'); setMenuOpen(false); }}>상담/평가</li>
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>학사 서비스</b>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ cursor: 'pointer', padding: '4px 0' }} onClick={() => { setActiveSection('admin'); setMenuOpen(false); }}>등록/행정서비스</li>
              </ul>
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ marginTop: 16 }}>닫기</button>
          </div>
        </>
      )}
      <main>
        {activeSection === 'dashboard' && (
          <>
            <section className="courses">
              <h2>수강 과목 현황</h2>
              <div style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #e0e0e0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>과목명</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>온라인 강의</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>과제</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>팀 프로젝트</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(courses.length > 0 ? courses : dummyCourses).map(c => (
                      <tr key={c._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: '8px 12px', color: '#2e7d32' }}>{c.online}</td>
                        <td style={{ padding: '8px 12px', color: c.assignment.includes('마감') ? '#d84315' : '#2e7d32' }}>{c.assignment}</td>
                        <td style={{ padding: '8px 12px', color: '#2e7d32' }}>{c.team}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="course-list">
              <h2>수강과목 <span style={{ fontWeight: 400, fontSize: 18, color: '#888' }}>(2025학년도 1학기)</span></h2>
              <div style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #e0e0e0' }}>
                {dummyCourseList.map(course => (
                  <div key={course._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 0' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{course.name} <span style={{ color: '#888', fontWeight: 400 }}>({course.code})</span></div>
                      <div style={{ color: '#666', fontSize: 15 }}>{course.professor} / {course.times}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: '#a5d6a7', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => setNoticeModal({ open: true, course: course.name })}>
                        공지사항{course.noticeNew && <span style={{ color: 'red', fontWeight: 700, marginLeft: 4 }}>N</span>}
                      </button>
                      <button style={{ background: '#b0bec5', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>강의자료실</button>
                      <button style={{ background: '#bcaaa4', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>강의Q&A</button>
                      <button style={{ background: '#ffe082', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>학습독독</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {noticeModal.open && (
              <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setNoticeModal({ open: false, course: null })}>
                <div style={{ background: '#fff', borderRadius: 8, minWidth: 480, maxWidth: '90vw', padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
                  <h2 style={{ marginBottom: 16 }}>[{noticeModal.course}] 공지사항</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px' }}>날짜</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px' }}>구분</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px' }}>제목</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyNotices.filter(n => n.course === noticeModal.course).map(n => (
                        <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '8px 12px', color: '#888' }}>{n.date}</td>
                          <td style={{ padding: '8px 12px', color: '#b39ddb' }}>{n.type}</td>
                          <td style={{ padding: '8px 12px' }}>{n.title}</td>
                        </tr>
                      ))}
                      {dummyNotices.filter(n => n.course === noticeModal.course).length === 0 && (
                        <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: 24 }}>공지사항이 없습니다.</td></tr>
                      )}
                    </tbody>
                  </table>
                  <button onClick={() => setNoticeModal({ open: false, course: null })} style={{ marginTop: 8 }}>닫기</button>
                </div>
              </div>
            )}
            <section className="timetable">
              <h2>시간표</h2>
              <table>
                <thead>
                  <tr>
                    <th>교시</th>
                    {days.map(day => <th key={day}>{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, i) => (
                    <tr key={period}>
                      <td>{period}교시</td>
                      {days.map((day, j) => {
                        const cell = timetableMatrix[i][j];
                        const show = timetableDisplayMatrix[i][j];
                        return (
                          <td key={day} style={{
                            minWidth: 120, fontSize: '0.95em', lineHeight: 1.4,
                            background: cell ? courseColors[cell.name] || '#f5f5f5' : undefined,
                            color: cell ? (['#ffe082'].includes(courseColors[cell.name]) ? '#333' : '#222') : undefined,
                            fontWeight: cell ? 500 : undefined
                          }}>
                            {cell && show ? (
                              <>
                                <b>{cell.name}</b><br />
                                <span style={{ color: '#666' }}>{cell.professor}</span><br />
                                <span style={{ color: '#888' }}>{cell.room}</span><br />
                                <span style={{ color: '#222' }}>{cell.time}</span>
                              </>
                            ) : ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="notice-list" style={{ marginTop: 32 }}>
              <h2 style={{ color: '#2d3e50', fontWeight: 700, marginBottom: 12, fontSize: 24, letterSpacing: 0.5 }}>과목별 NOTICE</h2>
              <div style={{ background: '#fff', borderRadius: 8, padding: 0, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                  <thead style={{ background: '#f5f5f7' }}>
                    <tr>
                      <th style={{ padding: '10px 8px', color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>날짜</th>
                      <th style={{ padding: '10px 8px', color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>구분</th>
                      <th style={{ padding: '10px 8px', color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>과목</th>
                      <th style={{ padding: '10px 8px', color: '#666', fontWeight: 600, borderBottom: '1px solid #e0e0e0' }}>제목</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyNotices.map((n, idx) => (
                      <tr key={n.id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafbfc' : '#fff' }}>
                        <td style={{ color: '#888', padding: '8px 8px', whiteSpace: 'nowrap' }}>{n.date}</td>
                        <td style={{ color: '#5e35b1', fontWeight: 500, padding: '8px 8px', whiteSpace: 'nowrap' }}>{n.type}</td>
                        <td style={{ color: '#1976d2', fontWeight: 500, padding: '8px 8px', whiteSpace: 'nowrap' }}>{n.course}</td>
                        <td style={{ padding: '8px 8px' }}>
                          <Link to={`/notice/${n.id}`} style={{ color: '#222', textDecoration: 'underline', fontWeight: 500 }}>{n.title}</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            {noticeDetail && (
              <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setNoticeDetail(null)}>
                <div style={{ background: '#fff', borderRadius: 8, minWidth: 600, maxWidth: '95vw', padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
                  <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>강의 공지사항</h2>
                  <div style={{ borderTop: '2px solid #bdbdbd', borderBottom: '1px solid #eee', padding: '18px 0', marginBottom: 18 }}>
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{noticeDetail.notice.title}</div>
                    <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>
                      작성자 : <b>황호영</b> &nbsp; 등록일 : {noticeDetail.notice.date} &nbsp; 조회수 : 6
                    </div>
                  </div>
                  <div style={{ minHeight: 60, fontSize: 16, color: '#222', marginBottom: 32 }}>
                    {noticeDetail.notice.title}
                    <br />
                    {noticeDetail.notice.content}
                  </div>
                  <div style={{ borderTop: '1px solid #eee', padding: '12px 0', fontSize: 15, color: '#444', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <b>이전 글</b> : {dummyNotices[noticeDetail.idx - 1] ? dummyNotices[noticeDetail.idx - 1].title : '이전글이 없습니다.'}
                    </span>
                    <span>
                      <b>다음 글</b> : {dummyNotices[noticeDetail.idx + 1] ? dummyNotices[noticeDetail.idx + 1].title : '다음글이 없습니다.'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: 18 }}>
                    <button onClick={() => setNoticeDetail(null)} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 500, cursor: 'pointer' }}>목록</button>
                  </div>
                </div>
              </div>
            )}
            <section className="notices-assignments">
              <div>
                <h2>과목별 공지사항</h2>
                <ul>
                  {notices.map((n, i) => (
                    <li key={i}>[{n.course}] {n.title} ({new Date(n.dueDate).toLocaleDateString()})</li>
                  ))}
                  {notices.length === 0 && <li>공지사항이 없습니다.</li>}
                </ul>
              </div>
              <div>
                <h2>과제 현황</h2>
                <ul>
                  {assignments.map((a, i) => (
                    <li key={i}>[{a.course}] {a.title} (마감: {new Date(a.dueDate).toLocaleDateString()})</li>
                  ))}
                  {assignments.length === 0 && <li>진행 중인 과제가 없습니다.</li>}
                </ul>
              </div>
            </section>
          </>
        )}
        {activeSection === 'grades' && (
          <section><h2>성적/이수현황</h2><div>성적/이수현황 기능 구현 예정</div></section>
        )}
        {activeSection === 'enroll' && (
          <section><h2>수강신청</h2><div>수강신청 기능 구현 예정</div></section>
        )}
        {activeSection === 'notice' && (
          <section><h2>강의 공지사항</h2><div>강의 공지사항 기능 구현 예정</div></section>
        )}
        {activeSection === 'material' && (
          <section><h2>자료실</h2><div>자료실 기능 구현 예정</div></section>
        )}
        {activeSection === 'assignment' && (
          <section><h2>과제</h2><div>과제 기능 구현 예정</div></section>
        )}
        {activeSection === 'consulting' && (
          <section><h2>상담/평가</h2><div>상담/평가 기능 구현 예정</div></section>
        )}
        {activeSection === 'admin' && (
          <section><h2>등록/행정서비스</h2><div>등록/행정서비스 기능 구현 예정</div></section>
        )}
      </main>
    </div>
  );
} 