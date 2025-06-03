import React from 'react';

export default function Consulting() {
  return (
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 8, padding: 32 }}>
      <h2>공학교육 (상담/평가)</h2>
      <h3>상담 내역</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: '#e1bee7' }}>
            <th>상담일</th><th>상담교수</th><th>상담유형</th><th>상담내용</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2025-03-15</td><td>이기준</td><td>진로상담</td><td>진로 및 취업 관련 상담</td></tr>
          <tr><td>2025-04-10</td><td>황호연</td><td>학업상담</td><td>전공과목 학습법 안내</td></tr>
        </tbody>
      </table>
      <h3>설문/평가</h3>
      <ul>
        <li>공학교육인증 설문: 완료</li>
        <li>설계프로젝트 평가: 미완료</li>
      </ul>
    </div>
  );
} 