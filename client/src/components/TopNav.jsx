import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopNav.css';

export default function TopNav() {
  const location = useLocation();
  return (
    <nav className="topnav">
      <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>대학생활</Link>
      <Link to="/grades" className={location.pathname === '/grades' ? 'active' : ''}>강의종합정보</Link>
      <Link to="/consulting" className={location.pathname === '/consulting' ? 'active' : ''}>공학교육</Link>
      <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>학사 서비스</Link>
    </nav>
  );
} 