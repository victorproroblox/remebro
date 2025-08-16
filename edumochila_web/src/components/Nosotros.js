import React from 'react';
import './Login.css';
import Navbar from './Navbar';
import {
  MdBackpack,
  MdSecurity,
  MdGpsFixed,
  MdScale,
  MdNotificationsActive,
  MdSchool,
  MdFavorite,
  MdEco,
  MdTimeline,
  MdHelpOutline
} from 'react-icons/md';

export default function Nosotros() {
  return (
    <>
      <Navbar />

      <main className="about">
        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero__overlay" />
          <div className="about-hero__content">
            <div className="about-hero__icon">
              <MdBackpack />
            </div>
            <h1 className="about-hero__title">¿Quiénes somos?</h1>
            <p className="about-hero__subtitle">
              En <strong>EduMochila</strong> usamos tecnología para cuidar, guiar
              y acompañar el aprendizaje de tus peques.
            </p>
            <p className="about-hero__desc">
              Integramos sensores de peso, GPS, alertas de seguridad y una app
              sencilla para que cada día escolar sea más seguro y organizado.
            </p>
          </div>
        </section>

        {/* MISIÓN / VISIÓN / VALORES */}
        <section className="about-mvv">
          <article className="mvv-card">
            <div className="mvv-icon"><MdSchool /></div>
            <h3>Misión</h3>
            <p>Empoderar a las familias con soluciones prácticas y accesibles
              que mejoren la seguridad y la experiencia educativa.</p>
          </article>
          <article className="mvv-card">
            <div className="mvv-icon"><MdTimeline /></div>
            <h3>Visión</h3>
            <p>Ser la referencia en mochilas inteligentes en LATAM, integrando
              IoT y educación con impacto real en el día a día.</p>
          </article>
          <article className="mvv-card">
            <div className="mvv-icon"><MdFavorite /></div>
            <h3>Valores</h3>
            <p>Seguridad, responsabilidad, innovación y cercanía con las
              familias y escuelas.</p>
          </article>
        </section>

        {/* FEATURES DEL PRODUCTO */}
        <section className="about-features">
          <div className="feature-card">
            <div className="feature-icon"><MdSecurity /></div>
            <h4>Seguridad</h4>
            <p>Alertas en tiempo real y detección de metales para mayor tranquilidad.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MdGpsFixed /></div>
            <h4>GPS en vivo</h4>
            <p>Ubicación actualizada y ruta del día desde la app móvil.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MdScale /></div>
            <h4>Peso inteligente</h4>
            <p>Monitoreo y avisos cuando el peso excede lo recomendado.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MdNotificationsActive /></div>
            <h4>Recordatorios</h4>
            <p>Agenda escolar y notificaciones para no olvidar lo importante.</p>
          </div>
        </section>

        {/* LÍNEA DE TIEMPO */}
        <section className="about-timeline">
          <h2>Nuestra historia</h2>
          <div className="timeline">
            <div className="t-item">
              <span className="t-dot" />
              <div className="t-content">
                <h5>2023 — Idea</h5>
                <p>Detectamos el problema del peso y la seguridad escolar y
                  empezamos a prototipar.</p>
              </div>
            </div>
            <div className="t-item">
              <span className="t-dot" />
              <div className="t-content">
                <h5>2024 — Piloto</h5>
                <p>Pruebas con familias y escuelas; integración de sensores y app.</p>
              </div>
            </div>
            <div className="t-item">
              <span className="t-dot" />
              <div className="t-content">
                <h5>2025 — Lanzamiento</h5>
                <p>Versión estable con GPS, alertas, y panel web para monitores.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DATOS RÁPIDOS */}
        <section className="about-stats">
          <div className="stat">
            <span className="stat-num">+50</span>
            <span className="stat-label">Escuelas interesadas</span>
          </div>
          <div className="stat">
            <span className="stat-num">98%</span>
            <span className="stat-label">Satisfacción piloto</span>
          </div>
          <div className="stat">
            <span className="stat-num">24/7</span>
            <span className="stat-label">Monitoreo</span>
          </div>
          <div className="stat">
            <span className="stat-num">IoT</span>
            <span className="stat-label">Tecnología clave</span>
          </div>
        </section>

        {/* SOSTENIBILIDAD / COMPROMISO */}
        <section className="about-commit">
          <div className="commit-card">
            <div className="commit-icon"><MdEco /></div>
            <div>
              <h3>Compromiso sostenible</h3>
              <p>Materiales resistentes, ciclos de vida más largos y empaques
                responsables para reducir nuestra huella ambiental.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="about-faq">
          <h2>Preguntas frecuentes</h2>

          <details className="faq-item">
            <summary><MdHelpOutline /> ¿La mochila funciona sin internet?</summary>
            <p>La app requiere conexión para mapas y notificaciones. Los sensores
              registran datos localmente y se sincronizan después.</p>
          </details>

          <details className="faq-item">
            <summary><MdHelpOutline /> ¿Qué tan precisa es la ubicación?</summary>
            <p>Dependemos del GPS del módulo y la cobertura; típicamente precisión de 3–10 m en exteriores.</p>
          </details>

          <details className="faq-item">
            <summary><MdHelpOutline /> ¿Cómo se cargan los componentes?</summary>
            <p>Incluye batería recargable y puerto de carga; la app muestra el nivel de batería.</p>
          </details>
        </section>

        {/* CTA FINAL */}
        <section className="about-cta">
          <h2>¿Te gustaría probar EduMochila en tu escuela?</h2>
          <p>Contáctanos para un demo y opciones de implementación.</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/catalogo'}
          >
            Ver catálogo
          </button>
        </section>
      </main>
    </>
  );
}
