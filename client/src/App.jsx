import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard';
import Grade from './pages/Grade';
import Consulting from './pages/Consulting';
import AdminService from './pages/AdminService';

export default function App() {
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grades" element={<Grade />} />
        <Route path="/consulting" element={<Consulting />} />
        <Route path="/admin" element={<AdminService />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
} 