import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Productos.css";
import { API_URL } from "../env";

export default function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const obtenerProductos = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const response = await fetch(`${API_URL}/api/productos/admin`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la lista de productos.");
      }

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
      const res = await fetch(`${API_URL}/api/productos/${id}/baja`, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("No se pudo desactivar el producto.");
      }
      await obtenerProductos();
    } catch (err) {
      console.error("Error al desactivar producto:", err);
      alert(err.message || "Error al desactivar producto.");
    }
  };

  const handleActivar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}/activar`, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("No se pudo activar el producto.");
      }
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
    <div className="productos-wrapper">
      <div className="productos-header">
        <h1>Gestión de Productos</h1>
        <div className="productos-botones">
          <button className="btn-volver" onClick={handleVolver}>
            ← Inicio
          </button>
          <button className="btn-agregar" onClick={handleAgregar}>
            + Agregar Producto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="estado">Cargando…</div>
      ) : mensaje ? (
        <div className="estado estado-error">{mensaje}</div>
      ) : (
        <table className="productos-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id_pr}>
                <td>{prod.id_pr}</td>
                <td>{prod.nom_pr}</td>
                <td>{formatPrice(prod.precio_pr)}</td>
                <td>{prod.stock}</td>
                <td>{prod.desc_pr}</td>
                <td>{prod.nom_cat}</td>
                <td>{Number(prod.status_pr) === 1 ? "Activo" : "Inactivo"}</td>
                <td className="acciones">
                  <button
                    className="btn-editar"
                    onClick={() => handleEditar(prod.id_pr)}
                  >
                    Editar
                  </button>
                  {Number(prod.status_pr) === 1 ? (
                    <button
                      className="btn-desactivar"
                      onClick={() => handleDesactivar(prod.id_pr)}
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      className="btn-activar"
                      onClick={() => handleActivar(prod.id_pr)}
                    >
                      Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
