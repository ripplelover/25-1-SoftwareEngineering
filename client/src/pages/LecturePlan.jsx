import React, { useState, useRef } from 'react';
import '../pages/Dashboard.css';
import SideMenu from '../components/SideMenu';

const dummyUser = { name: '김동규', studentId: '2022202004' };
const dummyPlans = [
  { id: 1, year: 2025, semester: '1학기', course: 'AI기초', professor: '홍길동', department: '인공지능학과', major: 'AI', type: '전공', credit: 3, time: '월 1-2교시/AI101', contact: 'hong@aiuniv.edu', review: '흥미로운 수업', etc: '팀플 있음',
    syllabus: [
      { week: 1, topic: 'AI 개요 및 역사', content: 'AI의 정의와 발전 과정 소개' },
      { week: 2, topic: '기초 수학', content: '행렬, 벡터, 미분 기초' },
      { week: 3, topic: 'Python 기초', content: 'AI 실습을 위한 Python 문법' }
    ],
    textbook: '인공지능 개론(홍길동 저, AI출판사)',
    evaluation: '중간 30%, 기말 30%, 과제 20%, 출석 20%',
    objective: 'AI 기초 개념 습득 및 실습 경험'
  },
  { id: 2, year: 2025, semester: '1학기', course: '데이터사이언스', professor: '이몽룡', department: '데이터과학과', major: '데이터', type: '전공', credit: 3, time: '화 3-4교시/DS201', contact: 'lee@dsuniv.edu', review: '실습 위주', etc: '과제 많음',
    syllabus: [
      { week: 1, topic: '데이터 과학 개요', content: '데이터 과학의 역할과 사례' },
      { week: 2, topic: '데이터 수집', content: '크롤링, API 활용' },
      { week: 3, topic: '데이터 전처리', content: '결측치, 이상치 처리' }
    ],
    textbook: '데이터사이언스 입문(이몽룡 저, DS출판사)',
    evaluation: '중간 25%, 기말 25%, 프로젝트 30%, 출석 20%',
    objective: '데이터 분석 실무 능력 배양'
  },
  { id: 3, year: 2025, semester: '1학기', course: '웹프로그래밍', professor: '성춘향', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '수 5-6교시/IT301', contact: 'sung@csuniv.edu', review: '실용적', etc: '조모임 있음',
    syllabus: [
      { week: 1, topic: 'HTML/CSS 기초', content: '웹 구조와 스타일링' },
      { week: 2, topic: 'JavaScript 기초', content: '동적 웹 구현' },
      { week: 3, topic: 'React 입문', content: '컴포넌트와 상태' }
    ],
    textbook: '모던 웹프로그래밍(성춘향 저, IT출판사)',
    evaluation: '중간 30%, 기말 30%, 실습 20%, 출석 20%',
    objective: '웹 개발 실무 능력 배양'
  },
  { id: 4, year: 2025, semester: '1학기', course: '네트워크', professor: '변학도', department: '정보통신공학과', major: '정보통신', type: '전공', credit: 3, time: '목 1-2교시/NET101', contact: 'byun@netuniv.edu', review: '이론+실습', etc: '퀴즈 자주' },
  { id: 5, year: 2025, semester: '1학기', course: '운영체제', professor: '박문수', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '금 3-4교시/OS201', contact: 'park@csuniv.edu', review: '난이도 높음', etc: '과제 어려움' },
  { id: 6, year: 2025, semester: '2학기', course: '기계학습', professor: '최지우', department: '인공지능학과', major: 'AI', type: '전공', credit: 3, time: '월 5-6교시/AI102', contact: 'choi@aiuniv.edu', review: '수학적', etc: '중간/기말 프로젝트' },
  { id: 7, year: 2025, semester: '2학기', course: '빅데이터분석', professor: '김철수', department: '데이터과학과', major: '데이터', type: '전공', credit: 3, time: '화 1-2교시/DS202', contact: 'kim@dsuniv.edu', review: '실무 중심', etc: '실제 데이터 활용' },
  { id: 8, year: 2025, semester: '2학기', course: '알고리즘', professor: '장보고', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '수 3-4교시/IT302', contact: 'jang@csuniv.edu', review: '문제풀이 많음', etc: '코딩테스트 대비' },
  { id: 9, year: 2025, semester: '2학기', course: '컴퓨터구조', professor: '신사임당', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '목 5-6교시/IT303', contact: 'shin@csuniv.edu', review: '이론 위주', etc: '퀴즈/과제' },
  { id: 10, year: 2025, semester: '2학기', course: '정보보호', professor: '유관순', department: '정보보호학과', major: '정보보호', type: '전공', credit: 3, time: '금 1-2교시/SEC101', contact: 'ryu@secuniv.edu', review: '실습 많음', etc: '해킹 실습' },
  { id: 11, year: 2024, semester: '1학기', course: '모바일프로그래밍', professor: '강감찬', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '월 3-4교시/IT304', contact: 'kang@csuniv.edu', review: '앱 개발', etc: '팀 프로젝트' },
  { id: 12, year: 2024, semester: '1학기', course: '데이터베이스', professor: '이순신', department: '데이터과학과', major: '데이터', type: '전공', credit: 3, time: '화 5-6교시/DS203', contact: 'lee@dsuniv.edu', review: 'SQL 실습', etc: '과제/실습' },
  { id: 13, year: 2024, semester: '1학기', course: '컴퓨터비전', professor: '김유신', department: '인공지능학과', major: 'AI', type: '전공', credit: 3, time: '수 1-2교시/AI103', contact: 'kimys@aiuniv.edu', review: '이미지 처리', etc: '프로젝트' },
  { id: 14, year: 2024, semester: '1학기', course: '자료구조', professor: '허준', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '목 3-4교시/IT305', contact: 'heo@csuniv.edu', review: '기초 필수', etc: '과제/퀴즈' },
  { id: 15, year: 2024, semester: '1학기', course: '소프트웨어공학', professor: '윤봉길', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '금 5-6교시/IT306', contact: 'yoon@csuniv.edu', review: '팀플 많음', etc: '조모임/발표' },
  { id: 16, year: 2024, semester: '2학기', course: '인공지능개론', professor: '장영실', department: '인공지능학과', major: 'AI', type: '전공', credit: 3, time: '월 7-8교시/AI104', contact: 'jang@aiuniv.edu', review: 'AI 기초', etc: '실습/과제' },
  { id: 17, year: 2024, semester: '2학기', course: '정보검색', professor: '최무선', department: '정보통신공학과', major: '정보통신', type: '전공', credit: 3, time: '화 7-8교시/NET102', contact: 'choi@netuniv.edu', review: '검색엔진', etc: '실습/퀴즈' },
  { id: 18, year: 2024, semester: '2학기', course: '컴퓨터그래픽스', professor: '안중근', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '수 7-8교시/IT307', contact: 'ahn@csuniv.edu', review: '그래픽스 실습', etc: '과제/프로젝트' },
  { id: 19, year: 2024, semester: '2학기', course: '클라우드컴퓨팅', professor: '신채호', department: '컴퓨터공학과', major: '컴퓨터공학', type: '전공', credit: 3, time: '목 7-8교시/IT308', contact: 'shin@csuniv.edu', review: '최신 기술', etc: '실습/과제' },
  { id: 20, year: 2024, semester: '2학기', course: '로봇공학', professor: '유성룡', department: '로봇공학과', major: '로봇', type: '전공', credit: 3, time: '금 7-8교시/ROB101', contact: 'ryu@robotuniv.edu', review: '로봇 실습', etc: '팀 프로젝트' },
];

export default function LecturePlan() {
  const [year, setYear] = useState(2025);
  const [semester, setSemester] = useState('1학기');
  const [mine, setMine] = useState('전체');
  const [course, setCourse] = useState('');
  const [prof, setProf] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [common, setCommon] = useState('전체');
  const [results, setResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSearch = () => {
    // 실제로는 API 호출, 여기선 더미 필터
    setResults(dummyPlans.filter(p =>
      (year ? p.year === year : true) &&
      (semester ? p.semester === semester : true) &&
      (mine === '내 과목' ? p.professor === dummyUser.name : true) &&
      (course ? p.course.includes(course) : true) &&
      (prof ? p.professor.includes(prof) : true) &&
      (department ? p.department.includes(department) : true) &&
      (major ? p.major.includes(major) : true) &&
      (common === '전체' ? true : false)
    ));
  };

  const pagedResults = results.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="dashboard-root">
      <div className="dashboard-header" style={{ borderRadius: 12, marginBottom: 32, position: 'sticky', top: 0, zIndex: 1000, background: '#26334d', color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="dashboard-title" style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, color: '#fff' }}>학사관리시스템</div>
          <button ref={menuBtnRef} style={{ fontSize: '1.2em', background: '#b39ddb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', cursor: 'pointer', marginLeft: 16, fontWeight: 700, boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }} onClick={e => {
            const rect = e.target.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user" style={{ fontWeight: 600, fontSize: 17 }}>
          <span>{dummyUser.name}({dummyUser.studentId})</span>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ marginLeft: 18, background: '#fff', color: '#26334d', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(100,100,200,0.08)' }}>Logout</button>
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
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>강의계획서 조회</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 24, borderBottom: '1px solid #e0e0e0' }}>
              <button style={{ border: 'none', background: 'none', fontWeight: 600, fontSize: 18, color: '#b71c1c', borderBottom: '3px solid #b71c1c', padding: '8px 24px 10px 24px', cursor: 'pointer' }}>학부</button>
              <button style={{ border: 'none', background: 'none', fontWeight: 600, fontSize: 18, color: '#888', borderBottom: '3px solid transparent', padding: '8px 24px 10px 24px', cursor: 'pointer' }}>대학원</button>
            </div>
            <div style={{ padding: '32px 0 0 0' }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
                <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }}>
                  <option value={2025}>2025년</option>
                  <option value={2024}>2024년</option>
                </select>
                <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 80 }}>
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                </select>
                <span style={{ marginLeft: 16, fontWeight: 500 }}>수강 여부</span>
                <label style={{ marginLeft: 8 }}><input type="radio" checked={mine === '전체'} onChange={() => setMine('전체')} /> 전체</label>
                <label style={{ marginLeft: 8 }}><input type="radio" checked={mine === '내 과목'} onChange={() => setMine('내 과목')} /> 내 과목</label>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <input value={course} onChange={e => setCourse(e.target.value)} placeholder="과목명" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }} />
                <input value={prof} onChange={e => setProf(e.target.value)} placeholder="교수명" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <select value={common} onChange={e => setCommon(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}>
                  <option value="전체">- 전체 -</option>
                </select>
                <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="학과" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                <input value={major} onChange={e => setMajor(e.target.value)} placeholder="전공" style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
                <button onClick={handleSearch} style={{ padding: '8px 32px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, marginLeft: 12 }}>조회</button>
              </div>
            </div>
          </div>
          <div style={{ padding: '32px 40px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f5e6fa' }}>
                  <th>학정번호</th>
                  <th>과목명</th>
                  <th>이수 구분</th>
                  <th>학점 / 시간</th>
                  <th>교수명</th>
                  <th>연락처</th>
                  <th>강의평 (everytime.kr)</th>
                  <th>과제 / 조모임 / 성적</th>
                </tr>
              </thead>
              <tbody>
                {pagedResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 48 }}>
                      <div style={{ fontSize: 18, marginBottom: 12 }}>조회된 데이터가 없습니다</div>
                      <div style={{ fontSize: 40, color: '#e0e0e0' }}>📄</div>
                    </td>
                  </tr>
                ) : pagedResults.map(plan => (
                  <tr key={plan.id} style={{ cursor: 'pointer' }} onClick={() => setDetail(plan)}>
                    <td>{plan.id}</td>
                    <td>{plan.course}</td>
                    <td>{plan.type}</td>
                    <td>{plan.credit} / {plan.time}</td>
                    <td>{plan.professor}</td>
                    <td>{plan.contact}</td>
                    <td>{plan.review}</td>
                    <td>{plan.etc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length > pageSize && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0' }}>
                {Array.from({ length: Math.ceil(results.length / pageSize) }, (_, i) => (
                  <button key={i+1} onClick={() => setPage(i+1)} style={{ background: page === i+1 ? '#1976d2' : '#ececec', color: page === i+1 ? '#fff' : '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{i+1}</button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      {detail && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDetail(null)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 36, minWidth: 420, maxWidth: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 18, color: '#222' }}>강의계획서 상세</h2>
            <div style={{ marginBottom: 12 }}><b>과목명:</b> {detail.course}</div>
            <div style={{ marginBottom: 12 }}><b>교수명:</b> {detail.professor}</div>
            <div style={{ marginBottom: 12 }}><b>학과:</b> {detail.department}</div>
            <div style={{ marginBottom: 12 }}><b>전공:</b> {detail.major}</div>
            <div style={{ marginBottom: 12 }}><b>이수구분:</b> {detail.type}</div>
            <div style={{ marginBottom: 12 }}><b>학점/시간:</b> {detail.credit} / {detail.time}</div>
            <div style={{ marginBottom: 12 }}><b>연락처:</b> {detail.contact}</div>
            <div style={{ marginBottom: 12 }}><b>강의평:</b> {detail.review}</div>
            <div style={{ marginBottom: 12 }}><b>과제/조모임/성적:</b> {detail.etc}</div>
            <div style={{ marginBottom: 12 }}><b>수업목표:</b> {detail.objective}</div>
            <div style={{ marginBottom: 12 }}><b>평가방식:</b> {detail.evaluation}</div>
            <div style={{ marginBottom: 12 }}><b>교재:</b> {detail.textbook}</div>
            <div style={{ marginBottom: 12 }}><b>주차별 강의 내용:</b>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {detail.syllabus && detail.syllabus.map((w, i) => (
                  <li key={i}><b>{w.week}주차:</b> {w.topic} - {w.content}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => setDetail(null)} style={{ marginTop: 18, background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', position: 'absolute', right: 36, bottom: 36 }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
} 