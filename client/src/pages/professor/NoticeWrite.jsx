import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoticeWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to the server
    alert('공지사항이 작성되었습니다.');
    navigate('/professor/notice');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2>공지사항 작성</h2>
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
        <button type="submit">작성</button>
      </form>
    </div>
  );
} 