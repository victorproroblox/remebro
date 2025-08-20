import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  MdSchool,
  MdGroups,
  MdEventNote,
  MdNotificationsActive,
  MdMap,
  MdSecurity,
} from "react-icons/md";

export default function MaestroHome() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const go = (path) => navigate(path);

  return (
    <>
      <Navbar />

      <main className="mh">
        {/* HERO */}
        <section className="mh-hero">
          <div className="mh-hero__overlay" />
          <div className="mh-hero__content">
            <div className="mh-hero__icon">
              <MdSchool />
            </div>

            <h1 className="mh-hero__title">
              Panel del Maestro
            </h1>

            <p className="mh-hero__subtitle">
              {usuario?.nom1_us
                ? `¡Bienvenido, Profe ${usuario.nom1_us}!`
                : "¡Bienvenido, Profe!"}
            </p>

            <p className="mh-hero__desc">
              Administra grupos, agenda recordatorios y consulta información
              relevante de tus alumnos con EduMochila.
            </p>

            <div className="mh-hero__actions">
              <button className="btn btn-primary" onClick={() => go("/maestro/grupos")}>
                <MdGroups style={{ marginRight: 8 }} /> Mis grupos
              </button>
              <button className="btn btn-outline" onClick={() => go("/maestro/avisos")}>
                <MdNotificationsActive style={{ marginRight: 8 }} /> Crear aviso
              </button>
              <button className="btn btn-ghost" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>

        {/* TARJETAS RÁPIDAS */}
        <section className="mh-grid">
          <article className="mh-card" onClick={() => go("/maestro/agenda")}>
            <div className="mh-card__icon"><MdEventNote /></div>
            <h3>Agenda y recordatorios</h3>
            <p>Planifica tareas, exámenes y eventos del grupo.</p>
          </article>

          <article className="mh-card" onClick={() => go("/maestro/ubicaciones")}>
            <div className="mh-card__icon"><MdMap /></div>
            <h3>Ubicaciones</h3>
            <p>Consulta la última ubicación registrada de cada alumno.</p>
          </article>

          <article className="mh-card" onClick={() => go("/maestro/seguridad")}>
            <div className="mh-card__icon"><MdSecurity /></div>
            <h3>Seguridad y alertas</h3>
            <p>Revisa alertas de peso y notificaciones importantes.</p>
          </article>
        </section>
      </main>
    </>
  );
}
