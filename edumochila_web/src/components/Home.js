// src/pages/Home.jsx
import React, { useMemo, useEffect } from 'react';
import './Login.css';
import Navbar from './Navbar';
import {
  MdBackpack,
  MdSecurity,
  MdGpsFixed,
  MdScale,
  MdNotificationsActive,
  MdShoppingCart
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../env';

export default function Home() {
  const navigate = useNavigate();

  // ---------- Guard local de sesión ----------
  useEffect(() => {
    // Consideramos sesión válida si existen ambos valores
    const hasUser = !!localStorage.getItem('usuario');
    const isLogged = localStorage.getItem('logged_in') === 'true';
    if (!hasUser || !isLogged) {
      // Redirige al login si no hay sesión local
      navigate('/', { replace: true });
    }
  }, [navigate]);
  // ------------------------------------------

  const usuario = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('usuario') || '{}'); }
    catch { return {}; }
  }, []);

  const nombre = usuario?.nom1_us || usuario?.nom_us || '';

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } catch (_) {
      // noop
    } finally {
      // Limpieza local siempre (modo local sin JWT)
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('logged_in'); // 👈 importante para el guard
      sessionStorage.removeItem('checkout_producto');
      navigate('/', { replace: true });
    }
  };

  const handleComprar = () => navigate('/catalogo');

  return (
    <>
      <Navbar />

      <main className="home">
        {/* HERO */}
        <section className="home-hero">
          <div className="home-hero__overlay" />
          <div className="home-hero__content">
            <div className="home-hero__icon">
              <MdBackpack />
            </div>

            <h1 className="home-hero__title">EduMochila</h1>

            <p className="home-hero__subtitle">
              La mochila inteligente que evoluciona contigo
            </p>

            <p className="home-hero__desc">
              Sensores, GPS, peso inteligente y asistencia escolar integrada.
              <strong> EduMochila</strong> cuida a tus peques y potencia su aprendizaje.
              {nombre ? ` ¡Bienvenid@, ${nombre}!` : ''}
            </p>

            <div className="home-hero__actions">
              <button className="btn btn-primary" onClick={handleComprar}>
                <MdShoppingCart size={20} style={{ marginRight: 8 }} />
                Comprar ahora
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/catalogo')}>
                Explorar catálogo
              </button>
            </div>

            <button className="btn btn-ghost logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="home-features">
          <div className="feature-card">
            <div className="feature-icon"><MdSecurity /></div>
            <h3>Seguridad</h3>
            <p>Detección de metales y alertas en tiempo real para mantener todo bajo control.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><MdGpsFixed /></div>
            <h3>GPS en vivo</h3>
            <p>Ubicación actualizada y ruta del día para mayor tranquilidad.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><MdScale /></div>
            <h3>Peso inteligente</h3>
            <p>Monitorea el peso y recibe avisos cuando se excede lo recomendado.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><MdNotificationsActive /></div>
            <h3>Recordatorios</h3>
            <p>Horario escolar y notificaciones para no olvidar lo importante.</p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="home-cta">
          <h2>List@ para empezar</h2>
          <p>Equipa a tus hij@s con tecnología pensada para su seguridad y aprendizaje.</p>
          <button className="btn btn-primary" onClick={handleComprar}>
            Ir al catálogo
          </button>
        </section>
      </main>
    </>
  );
}
