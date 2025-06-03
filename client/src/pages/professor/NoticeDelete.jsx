import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function NoticeDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/notices/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setNotice(res.data);
      } catch (err) {
        setError('공지사항 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notices/${id}`, {
        headers: { 'x-auth-token': token }
      });
      alert('공지사항이 삭제되었습니다.');
      navigate('/professor/notice');
    } catch (err) {
      setError('공지사항 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center' }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 48, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!notice) return <div style={{ padding: 48, textAlign: 'center', color: '#b71c1c' }}>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2>공지사항 삭제</h2>
      <p>정말로 "{notice.title}" 공지사항을 삭제하시겠습니까?</p>
      <button onClick={handleDelete}>삭제</button>
      <button onClick={() => navigate('/professor/notice')}>취소</button>
    </div>
  );
} 