import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    let u = null;
    try {
      const userStr = localStorage.getItem('user');
      u = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
    } catch (e) { u = null; }
    setUser(u);

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/notices/${id}`, {
          headers: { 'x-auth-token': token }
        });
        if (!res.ok) throw new Error('공지사항을 불러올 수 없습니다.');
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  if (loading) return <div style={{ padding: 48, textAlign: 'center' }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>{error}</div>;
  if (!notice) return <div style={{ padding: 48, textAlign: 'center' }}>공지사항을 찾을 수 없습니다.</div>;

  const isMine = user && notice.professor?._id === user._id;

  // 첨부파일 다운로드 링크 절대경로 처리
  let fileDownloadUrl = '';
  if (notice && notice.fileUrl) {
    // 항상 5000포트로 강제, 파일명 인코딩
    const urlParts = notice.fileUrl.split('/');
    const encodedFileName = encodeURIComponent(urlParts[urlParts.length - 1]);
    fileDownloadUrl = `${window.location.protocol}//localhost:5000/uploads/${encodedFileName}`;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2>공지사항 상세</h2>
      <div style={{ marginBottom: 16 }}>
        <h3>{notice.title}</h3>
        <p>과목: {notice.course?.name || '-'}</p>
        <p>작성자: {notice.professor?.name || '-'}</p>
        <p>작성일: {new Date(notice.createdAt).toLocaleDateString()}</p>
        <p>조회수: {notice.views}</p>
        <p>내용: {notice.content}</p>
        {notice.fileUrl && (
          <a href={fileDownloadUrl} download={notice.fileName}>
            첨부파일: {notice.fileName}
          </a>
        )}
      </div>
      <button onClick={() => navigate('/professor/notice')}>목록으로</button>
      {isMine && (
        <>
          <button onClick={() => navigate(`/professor/notice/edit/${id}`)}>수정</button>
          <button onClick={() => navigate(`/professor/notice/delete/${id}`)}>삭제</button>
        </>
      )}
    </div>
  );
} 