import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  MdAdminPanelSettings,
  MdLogout,
  MdInventory2,
  MdAssessment,
  MdRocketLaunch,
  MdSettings,
} from "react-icons/md";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const irAProductos = () => navigate("/productos");
  const irAReportes = () => navigate("/reportes");

  // Valores demo para las métricas rápidas (conéctalos a tu API luego)
  const stats = [
    { label: "Ventas (hoy)", value: "—", hint: "Conecta API", icon: <MdAssessment /> },
    { label: "Productos activos", value: "—", hint: "Conecta API", icon: <MdInventory2 /> },
    { label: "Usuarios", value: "—", hint: "Conecta API", icon: <MdAdminPanelSettings /> },
  ];

  return (
    <div className="dash">
      {/* Barra superior */}
      <header className="dash__topbar">
        <div className="dash__brand">
          <div className="dash__badge">
            <MdAdminPanelSettings />
          </div>
          <div className="dash__brandText">
            <h1>Panel de Administrador</h1>
            <p>Control central de tu tienda</p>
          </div>
        </div>

        <button className="dash__logout" onClick={handleLogout} aria-label="Cerrar sesión">
          <MdLogout />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Hero */}
      <section className="dash__hero">
        <div className="dash__heroContent">
          <h2>¡Bienvenido!</h2>
          <p>Gestiona productos, revisa ventas y genera reportes, todo desde un solo lugar.</p>
          <div className="dash__ctaRow">
            <button className="btn btn--primary" onClick={irAProductos}>
              <MdInventory2 />
              <span>Administrar productos</span>
            </button>
            <button className="btn btn--ghost" onClick={irAReportes}>
              <MdAssessment />
              <span>Ver reportes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Métricas rápidas */}
      <section className="dash__stats">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat__icon">{s.icon}</div>
            <div className="stat__data">
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">{s.label}</span>
              <span className="stat__hint">{s.hint}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Accesos rápidos */}
      <section className="dash__quick">
        <div className="quick__card" onClick={irAProductos} role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" ? irAProductos() : null)}>
          <div className="quick__icon"><MdInventory2 /></div>
          <h3>Productos</h3>
          <p>Administra el catálogo, precios, stock e imágenes.</p>
          <div className="quick__action">
            <MdRocketLaunch />
            <span>Ir a Productos</span>
          </div>
        </div>

        <div className="quick__card" onClick={irAReportes} role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" ? irAReportes() : null)}>
          <div className="quick__icon"><MdAssessment /></div>
          <h3>Ventas y Reportes</h3>
          <p>Explora métricas, filtra por fechas y exporta información.</p>
          <div className="quick__action">
            <MdRocketLaunch />
            <span>Ir a Reportes</span>
          </div>
        </div>

        <div className="quick__card quick__card--muted" aria-disabled="true">
          <div className="quick__icon"><MdSettings /></div>
          <h3>Configuración</h3>
          <p>Próximamente: ajustes de la tienda, roles y permisos.</p>
          <div className="quick__action quick__action--disabled">
            <span>Muy pronto</span>
          </div>
        </div>
      </section>

      <footer className="dash__footer">
        © {new Date().getFullYear()} EduMochila — Panel Admin
      </footer>
    </div>
  );
}
