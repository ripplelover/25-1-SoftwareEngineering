import React from 'react';

export default function AdminService() {
  return (
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 8, padding: 32 }}>
      <h2>학사 서비스 (등록/상담/행정)</h2>
      <h3>등록관리</h3>
      <ul>
        <li>등록금 고지서 출력</li>
        <li>분할납부 고지서 출력</li>
        <li>등록금 납부내역 조회</li>
      </ul>
      <h3>상담관리</h3>
      <ul>
        <li>상담이력 입력</li>
        <li>상담예약</li>
        <li>상담결과 조회</li>
      </ul>
      <h3>행정서비스</h3>
      <ul>
        <li>재학/졸업증명서 발급</li>
        <li>장학금 신청</li>
        <li>기타 행정서류 신청</li>
      </ul>
      {/* 실제 데이터 연동 및 표/리스트 구현 가능 */}
    </div>
  );
} 