import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const dummyNotices = [
  { id: 1, title: '중간고사 일정 안내', date: '2024-03-15', views: 12, hasFile: true, content: '중간고사는 4월 15일부터 4월 19일까지 진행됩니다.' },
  { id: 2, title: '과제 1 제출 안내', date: '2024-03-14', views: 8, hasFile: false, content: '과제 1은 3월 20일까지 제출해주세요.' },
  { id: 3, title: '강의 자료 업로드 안내', date: '2024-03-13', views: 15, hasFile: true, content: '강의 자료가 업로드되었습니다. 확인해주세요.' },
  { id: 4, title: '기말고사 일정 안내', date: '2024-03-12', views: 10, hasFile: false, content: '기말고사는 6월 10일부터 6월 14일까지 진행됩니다.' },
  { id: 5, title: '강의 평가 안내', date: '2024-03-11', views: 7, hasFile: true, content: '강의 평가를 진행합니다. 참여해주세요.' }
];

export default function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasFile, setHasFile] = useState(false);

  useEffect(() => {
    const notice = dummyNotices.find(n => n.id === parseInt(id));
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
      setHasFile(notice.hasFile);
    } else {
      alert('공지사항을 찾을 수 없습니다.');
      navigate('/professor/notice');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to the server
    alert('공지사항이 수정되었습니다.');
    navigate('/professor/notice');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2>공지사항 수정</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>제목:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>내용:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required style={{ width: '100%', padding: 8, height: 200 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input type="checkbox" checked={hasFile} onChange={(e) => setHasFile(e.target.checked)} />
            첨부파일
          </label>
        </div>
        <button type="submit">수정</button>
      </form>
    </div>
  );
} 