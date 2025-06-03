import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [course, setCourse] = useState('');
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingFileName, setExistingFileName] = useState('');

  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) { user = null; }

  useEffect(() => {
    if (!user || !user._id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    // 기존 공지사항 데이터 불러오기
    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/notices/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setTitle(res.data.title);
        setContent(res.data.content);
        setCourse(res.data.course?._id || '');
        setExistingFileName(res.data.fileName || '');
      } catch (err) {
        setError('공지사항 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (!user || !user._id) return;
    // 교수 담당 과목 목록 불러오기
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/courses/${user._id}`, {
          headers: { 'x-auth-token': token }
        });
        setCourses(res.data);
      } catch (err) {
        setError('과목 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !course) {
      setError('모든 필드를 입력하세요.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('course', course);
      if (file) formData.append('file', file);
      await axios.put(`http://localhost:5000/api/notices/${id}`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('공지사항이 수정되었습니다.');
      navigate('/professor/notice');
    } catch (err) {
      setError('공지사항 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24, color: '#222' }}>공지사항 수정</h2>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', padding: 32, border: '1px solid #e0e0e0' }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 17 }}>과목</label>
          <select value={course} onChange={e => setCourse(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bbb', marginTop: 6 }}>
            <option value="">과목을 선택하세요</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 17 }}>제목</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bbb', marginTop: 6 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 17 }}>내용</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #bbb', minHeight: 180, marginTop: 6 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 17 }}>첨부파일</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginTop: 6 }} />
          {existingFileName && (
            <div style={{ marginTop: 8, color: '#888', fontSize: 15 }}>기존 첨부파일: {existingFileName}</div>
          )}
        </div>
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 44px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>수정</button>
        <button type="button" onClick={() => navigate('/professor/notice')} style={{ marginLeft: 16, background: '#ececec', color: '#333', border: 'none', borderRadius: 8, padding: '12px 44px', fontWeight: 600, fontSize: 17, cursor: 'pointer' }}>취소</button>
      </form>
    </div>
  );
} 