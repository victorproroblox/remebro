// src/pages/MaestroSalon.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./MaestroSalon.css"; // asegúrate que este CSS exista
// Si usas un env: REACT_APP_API_URL=https://edumochila-api-mysql.onrender.com
const API_BASE =
  process.env.REACT_APP_API_URL || "https://edumochila-api-mysql.onrender.com";

export default function MaestroSalon() {
  const [alumnos, setAlumnos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom_alumno: "", producto_id: "" });
  const [msg, setMsg] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // Usuario guardado por el login (sin JWT)
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const id_us = usuario?.id_us;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const fetchAlumnos = useCallback(async () => {
    if (!id_us) {
      setMsg("No hay sesión activa.");
      setAlumnos([]);
      return;
    }
    setLoadingList(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/alumnos?id_us=${id_us}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.mensaje || "No se pudo cargar la lista");
        setAlumnos([]);
        return;
      }
      setAlumnos(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setMsg("Error de red al cargar alumnos");
    } finally {
      setLoadingList(false);
    }
  }, [id_us]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id_us) {
      setMsg("No hay sesión activa.");
      return;
    }
    const { nom_alumno, producto_id } = form;
    if (!nom_alumno?.trim() || !producto_id?.trim()) {
      setMsg("Nombre y producto_id son obligatorios.");
      return;
    }
    if (producto_id.trim().length > 10) {
      setMsg("producto_id debe tener máximo 10 caracteres.");
      return;
    }

    setLoadingSave(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/alumnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_us,
          nom_alumno: nom_alumno.trim(),
          producto_id: producto_id.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.mensaje || "No se pudo registrar");
        return;
      }
      setMsg("Alumno registrado");
      setForm({ nom_alumno: "", producto_id: "" });
      setShowForm(false);
      fetchAlumnos();
    } catch {
      setMsg("Error de red al registrar");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDelete = async (producto_id) => {
    if (!id_us) {
      setMsg("No hay sesión activa.");
      return;
    }
    if (!window.confirm("¿Eliminar este alumno?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/alumnos/${encodeURIComponent(
          producto_id
        )}?id_us=${id_us}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.mensaje || "No se pudo eliminar");
        return;
      }
      setMsg("Alumno eliminado");
      setAlumnos((prev) =>
        prev.filter((a) => a.producto_id !== producto_id)
      );
    } catch {
      setMsg("Error de red al eliminar");
    }
  };

  return (
    <main className="msalon">
      {/* HERO */}
      <section className="msalon-hero">
        <div className="msalon-hero__overlay" />
        <div className="msalon-hero__content">
          <div className="msalon-hero__icon">🎓</div>
          <h1 className="msalon-hero__title">Este es tu salón de clases</h1>
          <p className="msalon-hero__subtitle">
            Administra a tus alumnos y vincula sus producto_id
          </p>

          <div className="msalon-actions">
            <button
              className="btn-primary"
              onClick={() => setShowForm((s) => !s)}
            >
              {showForm ? "Cerrar" : "Agregar alumno"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="form-alumno" noValidate>
              <input
                name="nom_alumno"
                value={form.nom_alumno}
                onChange={handleChange}
                maxLength={100}
                placeholder="Nombre del alumno"
                required
              />
              <input
                name="producto_id"
                value={form.producto_id}
                onChange={handleChange}
                maxLength={10}
                placeholder="Producto ID"
                required
              />
              <button className="btn-success" disabled={loadingSave}>
                {loadingSave ? "Guardando..." : "Guardar"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* LISTA */}
      <section className="msalon-list">
        <h2>Alumnos registrados</h2>

        {!!msg && (
          <div className="msalon-empty" style={{ marginBottom: 10 }}>
            {msg}
          </div>
        )}

        {loadingList ? (
          <div className="msalon-empty">Cargando...</div>
        ) : alumnos.length === 0 ? (
          <div className="msalon-empty">Aún no hay alumnos.</div>
        ) : (
          <ul className="grid-alumnos">
            {alumnos.map((a) => (
              <li key={a.producto_id} className="al-card">
                <div className="al-avatar">
                  {(a.nom_alumno || "?").slice(0, 2).toUpperCase()}
                </div>
                <div className="al-info">
                  <h3>{a.nom_alumno || "(Sin nombre)"}</h3>
                  <p>Producto ID: {a.producto_id}</p>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(a.producto_id)}
                  title="Eliminar"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
