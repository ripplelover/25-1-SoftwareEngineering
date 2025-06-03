import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyNotices = [
  { id: 1, title: '중간고사 일정 안내', date: '2024-03-15', views: 12, hasFile: true },
  { id: 2, title: '과제 1 제출 안내', date: '2024-03-14', views: 8, hasFile: false },
  { id: 3, title: '강의 자료 업로드 안내', date: '2024-03-13', views: 15, hasFile: true },
  { id: 4, title: '기말고사 일정 안내', date: '2024-03-12', views: 10, hasFile: false },
  { id: 5, title: '강의 평가 안내', date: '2024-03-11', views: 7, hasFile: true }
];

export default function NoticeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 2;

  const filteredNotices = dummyNotices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h2>공지사항 관리</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <button onClick={() => navigate('/professor/notice/write')} style={{ marginBottom: 16 }}>공지사항 작성</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>첨부</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentNotices.map(n => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>
                <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate(`/professor/notice/${n.id}`)}>
                  {n.title}
                </span>
              </td>
              <td>{n.date}</td>
              <td>{n.views}</td>
              <td>{n.hasFile ? 'O' : '-'}</td>
              <td>
                <button onClick={() => navigate(`/professor/notice/edit/${n.id}`)}>수정</button>
                <button onClick={() => navigate(`/professor/notice/delete/${n.id}`)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => handlePageChange(i + 1)} style={{ margin: '0 4px' }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 