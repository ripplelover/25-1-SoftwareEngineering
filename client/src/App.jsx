import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import Dashboard from './pages/Dashboard';
import Grade from './pages/Grade';
import Consulting from './pages/Consulting';
import AdminService from './pages/AdminService';

export default function App() {
  return (
    <Router>
      <TopNav />
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