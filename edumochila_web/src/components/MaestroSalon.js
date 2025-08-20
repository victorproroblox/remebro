// src/pages/MaestroSalon.jsx
import "./Login.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REACT_APP_API_URL } from "../env";

export default function MaestroSalon() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom_alumno: '', producto_id: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token'); // JWT del maestro

  const fetchAlumnos = async () => {
    try {
      const res = await fetch(`${REACT_APP_API_URL || ''}/api/alumnos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAlumnos(data.data || []);
      else setMsg(data.message || 'No se pudo cargar la lista');
    } catch (e) {
      setMsg('Error al cargar alumnos');
    }
  };

  useEffect(() => {
    fetchAlumnos();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${REACT_APP_API_URL || ''}/api/alumnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || 'No se pudo registrar');
      } else {
        setMsg('Alumno registrado');
        setForm({ nom_alumno: '', producto_id: '' });
        setShowForm(false);
        fetchAlumnos();
      }
    } catch (e) {
      setMsg('Error de red/servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (producto_id) => {
    if (!window.confirm('¿Eliminar este alumno?')) return;
    try {
      const res = await fetch(`${REACT_APP_API_URL || ''}/api/alumnos/${producto_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.message || 'No se pudo eliminar');
      else {
        setMsg('Alumno eliminado');
        setAlumnos((prev) => prev.filter((a) => a.producto_id !== producto_id));
      }
    } catch {
      setMsg('Error al eliminar');
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
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? 'Cerrar' : 'Agregar alumno'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="form-alumno">
              <input
                name="nom_alumno"
                value={form.nom_alumno}
                onChange={handleChange}
                placeholder="Nombre del alumno"
                maxLength={100}
                required
              />
              <input
                name="producto_id"
                value={form.producto_id}
                onChange={handleChange}
                placeholder="Producto ID"
                maxLength={10}
                required
              />
              <button className="btn-success" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* LISTA */}
      <section className="msalon-list">
        <h2>Alumnos registrados</h2>
        {msg && <p>{msg}</p>}
        {alumnos.length === 0 ? (
          <div className="msalon-empty">Aún no hay alumnos.</div>
        ) : (
          <ul className="grid-alumnos">
            {alumnos.map((a) => (
              <li key={a.producto_id} className="al-card">
                <div className="al-avatar">{(a.nom_alumno || '?').slice(0, 2).toUpperCase()}</div>
                <div className="al-info">
                  <h3>{a.nom_alumno}</h3>
                  <p>Producto ID: {a.producto_id}</p>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(a.producto_id)}>
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