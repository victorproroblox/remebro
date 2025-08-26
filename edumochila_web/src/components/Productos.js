import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Productos.css";
import { API_URL } from "../env";

export default function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const baseUrl = useMemo(() => (API_URL || "").replace(/\/+$/, ""), []);

  const obtenerProductos = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const response = await fetch(`${baseUrl}/api/productos/admin`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("No se pudo obtener la lista de productos.");
      const data = await response.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setMensaje(error.message || "Error al obtener productos.");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleDesactivar = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/productos/${id}/baja`, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("No se pudo desactivar el producto.");
      await obtenerProductos();
    } catch (err) {
      console.error("Error al desactivar producto:", err);
      alert(err.message || "Error al desactivar producto.");
    }
  };

  const handleActivar = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/productos/${id}/activar`, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("No se pudo activar el producto.");
      await obtenerProductos();
    } catch (err) {
      console.error("Error al activar producto:", err);
      alert(err.message || "Error al activar producto.");
    }
  };

  const handleEditar = (id) => navigate(`/editarproducto/${id}`);
  const handleAgregar = () => navigate("/agregarproducto");
  const handleVolver = () => navigate("/dashboard");

  const formatPrice = (n) => {
    const num = Number(n ?? 0);
    try {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return `$${num.toFixed(2)}`;
    }
  };

  return (
    <div className="prods">
      {/* Topbar */}
      <header className="prods__topbar">
        <div className="prods__title">
          <h1>Gestión de Productos</h1>
          <p>Administra el catálogo, precios, stock y estatus</p>
        </div>

        <div className="prods__actions">
          <button className="btn btn--ghost" onClick={handleVolver}>← Inicio</button>
          <button className="btn btn--primary" onClick={handleAgregar}>+ Agregar producto</button>
        </div>
      </header>

      {/* Contenido */}
      <section className="prods__content">
        {loading ? (
          <div className="estado">Cargando…</div>
        ) : mensaje ? (
          <div className="estado estado-error">{mensaje}</div>
        ) : productos.length === 0 ? (
          <div className="estado">No hay productos registrados.</div>
        ) : (
          <div className="prods__tableWrap">
            <table className="prods__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Estatus</th>
                  <th className="th-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id_pr}>
                    <td>{p.id_pr}</td>
                    <td>{p.nom_pr}</td>
                    <td>{formatPrice(p.precio_pr)}</td>
                    <td>{p.stock}</td>
                    <td className="td-desc">{p.desc_pr}</td>
                    <td>{p.nom_cat}</td>
                    <td>
                      <span
                        className={
                          Number(p.status_pr) === 1
                            ? "pill pill--ok"
                            : "pill pill--muted"
                        }
                      >
                        {Number(p.status_pr) === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button className="btn mini" onClick={() => handleEditar(p.id_pr)}>
                        Editar
                      </button>
                      {Number(p.status_pr) === 1 ? (
                        <button
                          className="btn mini danger"
                          onClick={() => handleDesactivar(p.id_pr)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          className="btn mini success"
                          onClick={() => handleActivar(p.id_pr)}
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
