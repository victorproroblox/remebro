import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  MdGroups,
  MdPersonAdd,
} from "react-icons/md";

export default function MaestroSalon() {
  const navigate = useNavigate();

  // Placeholder: si quieres mostrar algo, puedes guardar un arreglo demo en localStorage
  // localStorage.setItem('alumnos_demo', JSON.stringify([{nombre:'Alex Ruiz', grado:'3°A'}]));
  const alumnos = JSON.parse(localStorage.getItem("alumnos_demo") || "[]");

  return (
    <>
      <Navbar />

      <main className="msalon">
        {/* HERO */}
        <section className="msalon-hero">
          <div className="msalon-hero__overlay" />
          <div className="msalon-hero__content">
            <div className="msalon-hero__icon">
              <MdGroups />
            </div>

            <h1 className="msalon-hero__title">Este es tu salón de clases</h1>
            <p className="msalon-hero__subtitle">
              Aquí verás a tus alumnos y podrás gestionarlos.
            </p>

            <div className="msalon-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/maestro/alumnos/nuevo")}
              >
                <MdPersonAdd style={{ marginRight: 8 }} />
                Agregar alumno
              </button>

              <button className="btn btn-ghost" onClick={() => navigate("/maestro")}>
                Volver al panel
              </button>
            </div>
          </div>
        </section>

        {/* LISTADO DE ALUMNOS */}
        <section className="msalon-list">
          <h2>Alumnos</h2>

          {alumnos.length === 0 ? (
            <div className="msalon-empty">Aún no hay alumnos agregados.</div>
          ) : (
            <div className="grid grid-alumnos">
              {alumnos.map((al, i) => (
                <article className="al-card" key={al.id || i}>
                  <div className="al-avatar">
                    {(al.iniciales ||
                      (al.nombre && al.nombre[0]) ||
                      "A").toUpperCase()}
                  </div>
                  <div className="al-info">
                    <h3>{al.nombre || "Alumno"}</h3>
                    {al.grado && <p>{al.grado}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
