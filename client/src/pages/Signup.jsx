<label style={{ fontWeight: 600, marginRight: 12 }}>권한
  <select value={role} onChange={e => setRole(e.target.value)} style={{ marginLeft: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
    <option value="student">학생</option>
    <option value="professor">교수</option>
    <option value="admin">관리자</option>
  </select>
</label> 