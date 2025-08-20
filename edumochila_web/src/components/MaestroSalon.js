// src/pages/MaestroSalon.jsx
import "./Login.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/alumnos`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/alumnos`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/alumnos/${producto_id}`, {
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
    <main className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Este es tu salón de clases</h1>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Cerrar' : 'Agregar alumno'}
        </button>
      </header>

      {msg && <p className="mb-4 text-sm">{msg}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-3 bg-gray-50 p-4 rounded">
          <div>
            <label className="block text-sm mb-1">Nombre del alumno</label>
            <input
              name="nom_alumno"
              value={form.nom_alumno}
              onChange={handleChange}
              maxLength={100}
              className="w-full border rounded px-3 py-2"
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Producto ID</label>
            <input
              name="producto_id"
              value={form.producto_id}
              onChange={handleChange}
              maxLength={10}
              className="w-full border rounded px-3 py-2"
              placeholder="Ej. 123456"
              required
            />
          </div>
          <button
            disabled={loading}
            className="mt-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Guardar alumno'}
          </button>
        </form>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">Alumnos registrados</h2>
        {alumnos.length === 0 ? (
          <p className="text-sm text-gray-600">Aún no hay alumnos.</p>
        ) : (
          <ul className="divide-y rounded border">
            {alumnos.map((a) => (
              <li key={a.producto_id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium">{a.nom_alumno || '(Sin nombre)'}</p>
                  <p className="text-sm text-gray-600">Producto ID: {a.producto_id}</p>
                </div>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDelete(a.producto_id)}
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
