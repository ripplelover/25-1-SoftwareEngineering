import React from 'react';

export default function Grade() {
  return (
    <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 8, padding: 32 }}>
      <h2>강의종합정보 (성적/이수현황)</h2>
      <h3>성적표</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: '#e1bee7' }}>
            <th>과목명</th><th>학점</th><th>성적</th><th>이수구분</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>소프트웨어공학</td><td>3</td><td>A+</td><td>전공필수</td></tr>
          <tr><td>회로이론</td><td>3</td><td>B0</td><td>전공선택</td></tr>
          <tr><td>산학협력캡스톤설계</td><td>3</td><td>A0</td><td>전공필수</td></tr>
          <tr><td>드로잉</td><td>2</td><td>B+</td><td>교양</td></tr>
          <tr><td>GPU컴퓨팅</td><td>3</td><td>A+</td><td>전공선택</td></tr>
        </tbody>
      </table>
      <h3>이수학점</h3>
      <ul>
        <li>전공필수: 24/30</li>
        <li>전공선택: 36/45</li>
        <li>교양: 18/20</li>
        <li>총 이수학점: 78/120</li>
      </ul>
      <h3>졸업요건</h3>
      <ul>
        <li>졸업논문 제출: 완료</li>
        <li>졸업시험: 미응시</li>
        <li>졸업인증 영어: 통과</li>
      </ul>
    </div>
  );
} 