import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-title">EduMochila</Link>
      <div className="nav-links">
        <Link to="/home" className={isActive('/home')}>Inicio</Link>
        <Link to="/catalogo" className={isActive('/catalogo')}>Catálogo</Link>
        <Link to="/nosotros" className={isActive('/nosotros')}>Nosotros</Link>
      </div>
    </nav>
  );
}
