import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import axios from 'axios';

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
  const [noticeModal, setNoticeModal] = useState({ open: false, course: null });
  const navigate = useNavigate();

  // 더미 데이터
  const dummyCourses = [
    { _id: '1', name: '소프트웨어공학', online: null, assignment: '2개의 과제 중 1개가 10일 후 마감입니다.', team: null },
    { _id: '2', name: '회로이론', online: null, assignment: null, team: null },
    { _id: '3', name: '산학협력캡스톤설계', online: null, assignment: null, team: null },
    { _id: '4', name: '드로잉', online: null, assignment: null, team: null },
    { _id: '5', name: 'GPU컴퓨팅', online: null, assignment: null, team: null }
  ];

  const dummyTimetable = [
    { day: '월', period: 1, time: '1-2교시', name: '소프트웨어공학', professor: '김교수', room: 'A101' },
    { day: '화', period: 3, time: '3-4교시', name: '회로이론', professor: '이교수', room: 'B203' },
    { day: '수', period: 5, time: '5-6교시', name: '산학협력캡스톤설계', professor: '박교수', room: 'C305' },
    { day: '목', period: 2, time: '2-3교시', name: '드로잉', professor: '최교수', room: 'D401' },
    { day: '금', period: 4, time: '4-5교시', name: 'GPU컴퓨팅', professor: '정교수', room: 'E502' }
  ];

  const dummyNotices = [
    { id: 1, course: '소프트웨어공학', date: '2024-03-15', type: '공지', title: '중간고사 일정 안내' },
    { id: 2, course: '회로이론', date: '2024-03-14', type: '과제', title: '과제 1 제출 안내' },
    { id: 3, course: '산학협력캡스톤설계', date: '2024-03-13', type: '공지', title: '팀 프로젝트 발표 일정' },
    { id: 4, course: '드로잉', date: '2024-03-12', type: '공지', title: '실습 재료 준비 안내' },
    { id: 5, course: 'GPU컴퓨팅', date: '2024-03-11', type: '과제', title: '프로젝트 제출 안내' }
  ];

  const dummyCourseList = [
    { _id: '1', name: '소프트웨어공학', code: 'CS101', professor: '김교수', times: '월 1-2교시', noticeNew: true },
    { _id: '2', name: '회로이론', code: 'EE201', professor: '이교수', times: '화 3-4교시', noticeNew: false },
    { _id: '3', name: '산학협력캡스톤설계', code: 'CS301', professor: '박교수', times: '수 5-6교시', noticeNew: true },
    { _id: '4', name: '드로잉', code: 'AR101', professor: '최교수', times: '목 2-3교시', noticeNew: false },
    { _id: '5', name: 'GPU컴퓨팅', code: 'CS401', professor: '정교수', times: '금 4-5교시', noticeNew: true }
  ];

  // 과목별 랜덤 색상 매핑 생성
  const colorPalette = ['#b39ddb', '#ffe082', '#80cbc4', '#ce93d8', '#90caf9', '#ffd54f', '#a5d6a7', '#ffab91', '#b0bec5', '#f48fb1'];
  const courseColorMap = {};
  let colorIdx = 0;
  courses.forEach(course => {
    if (!courseColorMap[course.name]) {
      courseColorMap[course.name] = colorPalette[colorIdx % colorPalette.length];
      colorIdx++;
    }
  });

  useEffect(() => {
    if (!user || !user._id) return;
    // 실제 수강신청한 과목 목록 불러오기
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/courses/student/${user._id}`, {
          headers: { 'x-auth-token': token }
        });
        setCourses(res.data);
      } catch (err) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    // API 호출 부분 주석 처리
    /*
    async function fetchAssignmentsAndNotices() {
      let allAssignments = [];
      let allNotices = [];
      
      for (const c of courses) {
        try {
          const res = await fetch(`http://localhost:5000/api/assignments/${c._id}`);
          const items = await res.json();
          items.forEach(item => {
            if (item.type === 'assignment') {
              allAssignments.push({ ...item, course: c.name });
            } else {
              allNotices.push({ ...item, course: c.name });
            }
          });
        } catch (err) {
          console.error(`Error fetching data for course ${c._id}:`, err);
        }
      }
      
      setAssignments(allAssignments);
      setNotices(allNotices);
    }
    
    if (courses.length > 0) {
      fetchAssignmentsAndNotices();
    }
    */
  }, [courses]);

  // 과제 목록 불러오기
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/assignments', {
          headers: { 'x-auth-token': token }
        });
        setAssignments(res.data);
      } catch (err) {
        setAssignments([]);
      }
    };
    if (user && user._id) fetchAssignments();
  }, [user]);

  // 공지사항 목록 불러오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/notices', {
          headers: { 'x-auth-token': token }
        });
        setNotices(res.data);
      } catch (err) {
        setNotices([]);
      }
    };
    if (user && user._id) fetchNotices();
  }, [user]);

  // 수강과목 현황 테이블에서 과제 상태 계산
  const getAssignmentStatus = (courseId) => {
    const courseAssignments = assignments.filter(a => a.course?._id === courseId);
    if (courseAssignments.length === 0) return <span style={{ color: '#388e3c' }}>남아있는 과제가 없습니다!</span>;
    const now = new Date();
    const dueAssignments = courseAssignments.filter(a => new Date(a.dueDate) > now);
    if (dueAssignments.length === 0) return <span style={{ color: '#388e3c' }}>남아있는 과제가 없습니다!</span>;
    const soonest = dueAssignments.reduce((min, a) => new Date(a.dueDate) < new Date(min.dueDate) ? a : min, dueAssignments[0]);
    const daysLeft = Math.ceil((new Date(soonest.dueDate) - now) / (1000*60*60*24));
    const text = `${courseAssignments.length}개의 과제 중 ${dueAssignments.length}개가 ${daysLeft}일 후 마감입니다.`;
    return <span style={{ color: daysLeft <= 1 ? '#d32f2f' : '#222' }}>{text}</span>;
  };

  // 시간표 2차원 배열 만들기 (요일 x 교시, 여러 교시 반영)
  const days = ['월', '화', '수', '목', '금'];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const timetableMatrix = Array.from({ length: periods.length }, () => Array(days.length).fill(null));
  const timetableDisplayMatrix = Array.from({ length: periods.length }, () => Array(days.length).fill(null));
  
  // 실제 과목 시간표 채우기
  courses.forEach(course => {
    if (!course.time) return;
    course.time.split(',').forEach(slot => {
      const match = slot.trim().match(/([월화수목금])\s*(\d{1,2})(?:-(\d{1,2}))?교시\/([^,]+)/);
      if (match) {
        const dayIdx = days.indexOf(match[1]);
        const start = parseInt(match[2], 10);
        const end = match[3] ? parseInt(match[3], 10) : start;
        for (let p = start; p <= end; p++) {
          if (dayIdx !== -1 && p >= 1 && p <= periods.length) {
            timetableMatrix[p-1][dayIdx] = {
              name: course.name,
              professor: course.professor,
              room: match[4],
              time: `${match[2]}${match[3] ? '-' + match[3] : ''}교시`
            };
            timetableDisplayMatrix[p-1][dayIdx] = (p === start);
          }
        }
      }
    });
  });

  if (user?.role === 'professor') {
    // 교수 전용 대시보드
    return (
      <div className="dashboard-root" style={{ background: 'linear-gradient(135deg, #e3f0ff 0%, #fafbfc 100%)', minHeight: '100vh' }}>
        <div className="dashboard-header" style={{ borderRadius: 12, marginBottom: 32, position: 'sticky', top: 0, zIndex: 1000, background: '#26334d', color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="dashboard-title" style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, color: '#fff' }}>학사관리시스템</div>
            <button style={{ fontSize: '1.2em', background: '#b39ddb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', cursor: 'pointer', marginLeft: 16, fontWeight: 700, boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }} onClick={e => {
              const rect = e.target.getBoundingClientRect();
              setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
              setMenuOpen(true);
            }}>☰ 메뉴</button>
          </div>
          <div className="dashboard-user" style={{ fontWeight: 600, fontSize: 17 }}>
            <span>{user?.name || '이름없음'}({user?.studentId || '교번없음'})</span>
            <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ marginLeft: 18, background: '#fff', color: '#26334d', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }}>Logout</button>
          </div>
        </div>
        {menuOpen && (
          <>
            <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000 }} onClick={() => setMenuOpen(false)} />
            <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={user} />
          </>
        )}
        <main style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
          <section style={{ background: '#fff', borderRadius: 18, margin: '60px 0 0 0', padding: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #e0e0e0' }}>
            <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f5f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <div style={{ fontWeight: 900, fontSize: 26, color: '#222', marginBottom: 8, letterSpacing: 0.5 }}>교수 대시보드</div>
              <div style={{ color: '#666', fontSize: 16, fontWeight: 500 }}>강의 공지사항 관리, 자료실 관리, 과제 관리, 학생 성적 관리 등 교수 전용 기능을 사용할 수 있습니다.</div>
            </div>
            <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
              <button onClick={() => navigate('/professor/notice')} style={{ background: 'linear-gradient(90deg,#1976d2 60%,#7e57c2 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '22px 0', fontWeight: 800, fontSize: 20, cursor: 'pointer', marginBottom: 8, boxShadow: '0 2px 12px rgba(25,118,210,0.10)', letterSpacing: 1, transition: '0.2s', outline: 'none' }}>공지사항 관리</button>
              <button onClick={() => navigate('/materials')} style={{ background: 'linear-gradient(90deg,#1976d2 60%,#26c6da 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '22px 0', fontWeight: 800, fontSize: 20, cursor: 'pointer', marginBottom: 8, boxShadow: '0 2px 12px rgba(25,118,210,0.10)', letterSpacing: 1, transition: '0.2s', outline: 'none' }}>자료실 관리</button>
              <button onClick={() => navigate('/assignments')} style={{ background: 'linear-gradient(90deg,#1976d2 60%,#ffb74d 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '22px 0', fontWeight: 800, fontSize: 20, cursor: 'pointer', marginBottom: 8, boxShadow: '0 2px 12px rgba(25,118,210,0.10)', letterSpacing: 1, transition: '0.2s', outline: 'none' }}>과제 관리</button>
              <button onClick={() => navigate('/grade-input')} style={{ background: 'linear-gradient(90deg,#1976d2 60%,#66bb6a 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '22px 0', fontWeight: 800, fontSize: 20, cursor: 'pointer', marginBottom: 8, boxShadow: '0 2px 12px rgba(25,118,210,0.10)', letterSpacing: 1, transition: '0.2s', outline: 'none' }}>학생 목록/성적 관리</button>
              <button onClick={() => navigate('/professor/course-manage')} style={{ background: 'linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)', color: '#fff', border: 'none', borderRadius: 12, padding: '22px 0', fontWeight: 800, fontSize: 20, cursor: 'pointer', marginBottom: 8, boxShadow: '0 2px 12px rgba(25,118,210,0.10)', letterSpacing: 1, transition: '0.2s', outline: 'none' }}>과목 관리</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

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
          <SideMenu setMenuOpen={setMenuOpen} menuPos={menuPos} user={user} />
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
                    {courses.map(c => (
                      <tr key={c._id}>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: '8px 12px', color: '#2e7d32' }}>
                          {c.online ? c.online : '남아있는 강의가 없습니다!'}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#2e7d32', cursor: 'pointer' }}
                          onClick={() => navigate(`/assignments?course=${c._id}`)}
                        >
                          {getAssignmentStatus(c._id)}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#2e7d32' }}>
                          {c.team ? c.team : '남아있는 팀 프로젝트가 없습니다!'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="course-list">
              <h2>수강과목 <span style={{ fontWeight: 400, fontSize: 18, color: '#888' }}>(2025학년도 1학기)</span></h2>
              <div style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #e0e0e0' }}>
                {courses.map(course => (
                  <div key={course._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 0' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{course.name}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{course.professor} / {course.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: '#a5d6a7', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}
                        onClick={() => navigate(`/notices?course=${encodeURIComponent(course.name)}`)}>
                        공지사항
                      </button>
                      <button style={{ background: '#b0bec5', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>강의자료실</button>
                      <button style={{ background: '#bcaaa4', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>강의Q&A</button>
                      <button style={{ background: '#ffe082', color: '#222', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>학습독독</button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && <div style={{ color: '#aaa', textAlign: 'center', padding: 32 }}>수강과목이 없습니다.</div>}
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
                            background: cell ? courseColorMap[cell.name] || '#f5f5f5' : undefined,
                            color: cell ? '#222' : undefined,
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
                    {courses.map(course =>
                      notices.filter(n => n.course === course.name || n.course?.name === course.name).map((n, idx) => (
                        <tr key={n.id || n._id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafbfc' : '#fff' }}>
                          <td style={{ color: '#888', padding: '8px 8px', whiteSpace: 'nowrap' }}>{n.date || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '')}</td>
                          <td style={{ color: '#5e35b1', fontWeight: 500, padding: '8px 8px', whiteSpace: 'nowrap' }}>{n.type}</td>
                          <td style={{ color: '#1976d2', fontWeight: 500, padding: '8px 8px', whiteSpace: 'nowrap' }}>{course.name}</td>
                          <td style={{ padding: '8px 8px' }}>
                            <Link to={`/notice/${n.id || n._id}`} style={{ color: '#222', textDecoration: 'underline', fontWeight: 500 }}>{n.title}</Link>
                          </td>
                        </tr>
                      ))
                    )}
                    {courses.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>공지사항이 없습니다.</td></tr>
                    )}
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
                    <li key={i}>[{n.course?.name || n.course}] {n.title} ({n.dueDate ? new Date(n.dueDate).toLocaleDateString() : ''})</li>
                  ))}
                  {notices.length === 0 && <li>공지사항이 없습니다.</li>}
                </ul>
              </div>
              <div>
                <h2>과제 현황</h2>
                <ul>
                  {assignments.map((a, i) => (
                    <li key={i}>[{a.course?.name}] {a.title} (마감: {new Date(a.dueDate).toLocaleDateString()})</li>
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