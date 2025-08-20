import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { MdAdminPanelSettings } from 'react-icons/md';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Solo limpiamos la info de usuario guardada por la app (sin JWT)
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const irAProductos = () => {
    navigate('/productos');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <MdAdminPanelSettings className="dashboard-icon" />
        <h1 className="dashboard-title">Panel de Administrador</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card" onClick={irAProductos} style={{ cursor: 'pointer' }}>
          <h2>Productos</h2>
          <p>Administra el catálogo de productos, stock e imágenes.</p>
        </div>

        <div className="card">
          <h2>Ventas y Reportes</h2>
          <p>Consulta reportes diarios, exporta ventas y genera gráficas.</p>
        </div>
      </div>
    </div>
  );
}
