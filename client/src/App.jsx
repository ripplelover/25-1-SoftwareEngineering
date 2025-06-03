import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Grade from './pages/Grade';
import Consulting from './pages/Consulting';
import AdminService from './pages/AdminService';
import Login from './pages/Login';
import Register from './pages/Register';

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
      <Route path="/grades" element={<Grade />} />
      <Route path="/consulting" element={<Consulting />} />
      <Route path="/admin" element={<AdminService />} />
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