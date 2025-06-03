import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Grade from './pages/Grade';
import Consulting from './pages/Consulting';
import AdminService from './pages/AdminService';
import Login from './pages/Login';
import Register from './pages/Register';
import NoticeDetail from './pages/NoticeDetail';
import NoticeList from './pages/NoticeList';
import LecturePlan from './pages/LecturePlan';
import Enroll from './pages/Enroll';
import GradeInput from './pages/GradeInput';
import MaterialRoom from './pages/MaterialRoom';
import AssignmentRoom from './pages/AssignmentRoom';
import StudentMaterialRoom from './pages/StudentMaterialRoom';
import MaterialDetail from './pages/MaterialDetail';
import StudentMaterialDetail from './pages/StudentMaterialDetail';
import AssignmentDetail from './pages/AssignmentDetail';
import NoticeListProfessor from './pages/professor/NoticeList';
import NoticeWrite from './pages/professor/NoticeWrite';
import NoticeEdit from './pages/professor/NoticeEdit';
import NoticeDelete from './pages/professor/NoticeDelete';
import LecturePlanProfessor from './pages/professor/LecturePlanProfessor';

function AppContent() {
  let initialUser = null;
  try {
    const userStr = localStorage.getItem('user');
    initialUser = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    initialUser = null;
  }
  const [user, setUser] = useState(initialUser);
  const location = useLocation();
  const hideHeader = ['/login', '/register'].includes(location.pathname);
  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      <Route path="/grades" element={<Grade user={user} setUser={setUser} />} />
      <Route path="/consulting" element={<Consulting />} />
      <Route path="/admin" element={<AdminService />} />
      <Route path="/notice/:noticeId" element={<NoticeDetail />} />
      <Route path="/notices" element={<NoticeList />} />
      <Route path="/lecture-plan" element={<LecturePlan />} />
      <Route path="/enroll" element={<Enroll />} />
      <Route path="/grade-input" element={<GradeInput user={user} setUser={setUser} />} />
      <Route path="/materials" element={<MaterialRoom user={user} setUser={setUser} />} />
      <Route path="/assignments" element={<AssignmentRoom user={user} setUser={setUser} />} />
      <Route path="/student-materials" element={<StudentMaterialRoom user={user} setUser={setUser} />} />
      <Route path="/materials/:id" element={<MaterialDetail user={user} setUser={setUser} />} />
      <Route path="/student-materials/:id" element={<StudentMaterialDetail user={user} setUser={setUser} />} />
      <Route path="/assignments/:id" element={<AssignmentDetail user={user} setUser={setUser} />} />
      <Route path="/professor/notice" element={<NoticeListProfessor />} />
      <Route path="/professor/notice/:id" element={<NoticeDetail />} />
      <Route path="/professor/notice/write" element={<NoticeWrite />} />
      <Route path="/professor/notice/edit/:id" element={<NoticeEdit />} />
      <Route path="/professor/notice/delete/:id" element={<NoticeDelete />} />
      <Route path="/professor/lecture-plan" element={<LecturePlanProfessor />} />
      <Route path="*" element={<Dashboard user={user} setUser={setUser} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
} 