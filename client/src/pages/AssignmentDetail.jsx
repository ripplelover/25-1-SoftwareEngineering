import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
import '../pages/Dashboard.css';
import axios from 'axios';

export default function AssignmentDetail({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 60, left: 32 });
  const [assignment, setAssignment] = useState(null);
  const [submitBlob, setSubmitBlob] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [assignments, setAssignments] = useState([]);

  // 과제 상세 조회
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/assignments/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setAssignment(response.data);
      } catch (err) {
        console.error('과제 상세 조회 실패:', err);
        alert('과제 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchAssignment();
  }, [id]);

  // 과제 목록 조회 (이전/다음 과제용)
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/assignments', {
          headers: { 'x-auth-token': token }
        });
        setAssignments(response.data);
      } catch (err) {
        console.error('과제 목록 조회 실패:', err);
      }
    };
    fetchAssignments();
  }, []);

  // 파일 다운로드
  const handleDownload = (fileUrl, fileName) => {
    window.open(fileUrl, '_blank');
  };

  // 파일 업로드
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      throw err;
    }
  };

  // 학생 과제 제출
  const handleSubmit = async () => {
    if (!submitBlob) return;
    try {
      const token = localStorage.getItem('token');
      const { fileUrl, fileName } = await handleFileUpload(submitBlob);
      
      const response = await axios.post(`http://localhost:5000/api/assignments/${id}/submit`, {
        fileUrl,
        fileName
      }, {
        headers: { 'x-auth-token': token }
      });
      setAssignment(response.data);
      setSubmitBlob(null);
      alert('제출이 완료되었습니다.');
    } catch (err) {
      console.error('과제 제출 실패:', err);
      alert('과제 제출에 실패했습니다.');
    }
  };

  // 교수 과제 평가
  const handleGrade = async (submissionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/assignments/${id}/submissions/${submissionId}`, {
        score,
        feedback
      }, {
        headers: { 'x-auth-token': token }
      });
      setAssignment(response.data);
      setScore('');
      setFeedback('');
      alert('평가가 완료되었습니다.');
    } catch (err) {
      console.error('과제 평가 실패:', err);
      alert('과제 평가에 실패했습니다.');
    }
  };

  if (!assignment) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>과제를 찾을 수 없습니다.</div>;

  // 이전/다음과제
  const currentIndex = assignments.findIndex(a => a._id === id);
  const prev = assignments[currentIndex + 1]; // 최신순 정렬이므로 +1
  const next = assignments[currentIndex - 1]; // 최신순 정렬이므로 -1

  return (
    <div className="dashboard-root">
      <div className="dashboard-header" style={{ borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="dashboard-title">학사관리시스템</div>
          <button style={{ fontSize: '1.2em', background: '#e1bee7', color: '#2d3e50', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', marginLeft: 8 }} onClick={e => {
            const rect = e.target.getBoundingClientRect();
            setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
            setMenuOpen(true);
          }}>☰ 메뉴</button>
        </div>
        <div className="dashboard-user">
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
      <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>
        <section style={{ background: '#fff', borderRadius: 12, marginBottom: 32, padding: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #e0e0e0' }}>
          <div style={{ borderBottom: '2px solid #bdbdbd', background: '#f7f7fa', padding: '28px 40px 18px 40px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 23, color: '#2d3e50', marginBottom: 8, letterSpacing: 0.5 }}>{assignment.title}</div>
            <div style={{ color: '#666', marginBottom: 8 }}>
              마감일: {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: 8 }}>
              파일: {assignment.fileName ? (
                <button style={{ marginLeft: 8, background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDownload(assignment.fileUrl, assignment.fileName)}>다운로드</button>
              ) : '파일 없음'}
            </div>
          </div>
          <div style={{ padding: '32px 40px', minHeight: 120, fontSize: 16 }}>
            {assignment.content}
          </div>
          {user?.role === 'student' && (
            <div style={{ padding: '0 40px 32px 40px' }}>
              <h4>과제 제출</h4>
              <input type="file" onChange={e => setSubmitBlob(e.target.files[0])} style={{ marginRight: 8 }} />
              <button onClick={handleSubmit} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>제출</button>
            </div>
          )}
          {user?.role === 'professor' && (
            <div style={{ marginTop: 32, background: '#f7f7fa', borderRadius: 10, padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>제출 현황</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead>
                  <tr style={{ background: '#e3e3f7' }}>
                    <th>학생명</th>
                    <th>학번</th>
                    <th>제출일</th>
                    <th>파일</th>
                    <th>점수</th>
                    <th>피드백</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.submissions.map(sub => (
                    <tr key={sub._id}>
                      <td>{sub.student.name}</td>
                      <td>{sub.student.studentId}</td>
                      <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <a href={sub.fileUrl} download>{sub.fileName}</a>
                      </td>
                      <td>
                        <input type="number" value={sub.score || ''} onChange={(e) => setScore(e.target.value)} style={{ width: 60 }} />
                      </td>
                      <td>
                        <input type="text" value={sub.feedback || ''} onChange={(e) => setFeedback(e.target.value)} style={{ width: 120 }} />
                      </td>
                      <td>
                        <button onClick={() => handleGrade(sub._id)}>저장</button>
                      </td>
                    </tr>
                  ))}
                  {assignment.submissions.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: 24 }}>아직 제출한 학생이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ borderTop: '1px solid #eee', padding: '18px 40px', fontSize: 15, color: '#444', display: 'flex', justifyContent: 'space-between', gap: 16, background: '#f7f7fa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <b style={{ color: '#222' }}>이전 과제</b> : {prev ? <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/assignments/${prev._id}`)}>{prev.title}</span> : <span style={{ color: '#aaa' }}>이전과제가 없습니다.</span>}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <b style={{ color: '#222' }}>다음 과제</b> : {next ? <span style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/assignments/${next._id}`)}>{next.title}</span> : <span style={{ color: '#aaa' }}>다음과제가 없습니다.</span>}
            </div>
          </div>
          <div style={{ textAlign: 'center', margin: '36px 0 32px 0' }}>
            <button onClick={() => navigate('/assignments')} style={{ background: '#ececec', color: '#333', border: 'none', borderRadius: 6, padding: '12px 44px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>목록</button>
          </div>
        </section>
      </main>
    </div>
  );
} 