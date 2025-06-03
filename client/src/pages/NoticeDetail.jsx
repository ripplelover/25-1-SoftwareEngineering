import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NoticeDetail() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [prevNext, setPrevNext] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotice() {
      setLoading(true);
      setError('');
      try {
        // 실제 API 경로에 맞게 수정 필요
        const res = await axios.get(`http://localhost:5000/api/notices/${noticeId}`);
        setNotice(res.data.notice);
        setPrevNext({ prev: res.data.prev, next: res.data.next });
      } catch (e) {
        setError('공지사항을 불러오지 못했습니다.');
      }
      setLoading(false);
    }
    fetchNotice();
  }, [noticeId]);

  if (loading) return <div style={{ padding: 48, textAlign: 'center' }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>{error}</div>;
  if (!notice) return null;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '40px 36px', fontFamily: 'inherit' }}>
      <div style={{ borderBottom: '2px solid #e0e0e0', marginBottom: 24, paddingBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#2d3e50', margin: 0 }}>{notice.title}</h1>
        <div style={{ color: '#888', fontSize: 15, marginTop: 8 }}>
          <span>작성자: <b>{notice.author || '교수자'}</b></span>
          <span style={{ marginLeft: 18 }}>등록일: {notice.date ? new Date(notice.date).toLocaleDateString() : '-'}</span>
          <span style={{ marginLeft: 18 }}>조회수: {notice.views ?? '-'}</span>
        </div>
      </div>
      <div style={{ minHeight: 120, fontSize: 17, color: '#222', lineHeight: 1.7, marginBottom: 32, whiteSpace: 'pre-line' }}>
        {notice.content}
      </div>
      <div style={{ borderTop: '1px solid #eee', padding: '16px 0', fontSize: 15, color: '#444', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <b>이전 글</b> : {prevNext.prev ? <a href={`/notice/${prevNext.prev._id}`} style={{ color: '#1976d2', textDecoration: 'underline' }}>{prevNext.prev.title}</a> : '이전글이 없습니다.'}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <b>다음 글</b> : {prevNext.next ? <a href={`/notice/${prevNext.next._id}`} style={{ color: '#1976d2', textDecoration: 'underline' }}>{prevNext.next.title}</a> : '다음글이 없습니다.'}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={() => navigate(-1)} style={{ background: '#ececec', color: '#333', border: 'none', borderRadius: 4, padding: '10px 36px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>목록</button>
      </div>
    </div>
  );
} 