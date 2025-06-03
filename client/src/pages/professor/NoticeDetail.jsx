import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const dummyNotices = [
  { id: 1, title: '중간고사 일정 안내', date: '2024-03-15', views: 12, hasFile: true, content: '중간고사는 4월 15일부터 4월 19일까지 진행됩니다.' },
  { id: 2, title: '과제 1 제출 안내', date: '2024-03-14', views: 8, hasFile: false, content: '과제 1은 3월 20일까지 제출해주세요.' },
  { id: 3, title: '강의 자료 업로드 안내', date: '2024-03-13', views: 15, hasFile: true, content: '강의 자료가 업로드되었습니다. 확인해주세요.' },
  { id: 4, title: '기말고사 일정 안내', date: '2024-03-12', views: 10, hasFile: false, content: '기말고사는 6월 10일부터 6월 14일까지 진행됩니다.' },
  { id: 5, title: '강의 평가 안내', date: '2024-03-11', views: 7, hasFile: true, content: '강의 평가를 진행합니다. 참여해주세요.' }
];

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = dummyNotices.find(n => n.id === parseInt(id));

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2>공지사항 상세</h2>
      <div style={{ marginBottom: 16 }}>
        <h3>{notice.title}</h3>
        <p>작성일: {notice.date}</p>
        <p>조회수: {notice.views}</p>
        <p>첨부파일: {notice.hasFile ? 'O' : '-'}</p>
        <p>내용: {notice.content}</p>
      </div>
      <button onClick={() => navigate(`/professor/notice/edit/${id}`)}>수정</button>
      <button onClick={() => navigate(`/professor/notice/delete/${id}`)}>삭제</button>
      <button onClick={() => navigate('/professor/notice')}>목록으로</button>
    </div>
  );
} 