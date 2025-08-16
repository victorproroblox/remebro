import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Productos.css";
import { API_URL } from "../env"; // o la ruta correcta


export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom_pr: "",
    precio_pr: "",
    stock: "",
    desc_pr: "",
    img_pr: "",
    id_cat: "",
    status_pr: 1,
  });

  const getToken = () => localStorage.getItem("token") || "";

  // ---------- Cargar producto
  const obtenerProducto = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Producto no encontrado");

      const raw = await res.json();
      const p = raw?.producto ?? raw; // acepta ambas formas

      setFormData({
        nom_pr: p.nom_pr ?? "",
        precio_pr: String(p.precio_pr ?? ""),
        stock: String(p.stock ?? ""),
        desc_pr: p.desc_pr ?? "",
        img_pr: p.img_pr ?? "",
        id_cat: String(p.id_cat ?? ""),
        status_pr: Number(p.status_pr ?? 1),
      });
      setError("");
    } catch (e) {
      console.error("Error al obtener producto:", e);
      setError(e.message || "No se pudo cargar el producto.");
    }
  };

  // ---------- Cargar categorías
  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categorias`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => []);
      if (res.ok && Array.isArray(data)) {
        setCategorias(data);
      } else {
        setCategorias([]);
      }
    } catch (e) {
      console.error("Error al obtener categorías:", e);
      setCategorias([]);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      await Promise.all([obtenerProducto(), obtenerCategorias()]);
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Normaliza entradas numéricas
    if (name === "precio_pr") {
      setFormData((p) => ({ ...p, [name]: value.replace(/[^\d.,]/g, "") }));
      return;
    }
    if (name === "stock" || name === "id_cat" || name === "status_pr") {
      setFormData((p) => ({ ...p, [name]: value.replace(/[^\d-]/g, "") }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    // Validaciones básicas
    if (
      !formData.nom_pr.trim() ||
      !formData.precio_pr ||
      !formData.stock ||
      !formData.img_pr.trim() ||
      !formData.id_cat
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const payload = {
      nom_pr: formData.nom_pr.trim(),
      precio_pr: Number(
        String(formData.precio_pr).replace(/\./g, "").replace(",", ".")
      ),
      stock: parseInt(formData.stock, 10),
      desc_pr: formData.desc_pr?.trim() || null,
      img_pr: formData.img_pr.trim(),
      id_cat: parseInt(formData.id_cat, 10),
      status_pr: parseInt(formData.status_pr, 10) || 0, // 1 activo, 0 inactivo
    };

    if (Number.isNaN(payload.precio_pr) || Number.isNaN(payload.stock)) {
      alert("Precio o stock inválidos.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert(data.mensaje || "Producto actualizado correctamente");
        navigate("/productos");
      } else if (res.status === 401 || res.status === 403) {
        alert("No autorizado. Inicia sesión como administrador.");
        navigate("/login");
      } else {
        alert(data.mensaje || "Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="productos-wrapper">
      <div className="productos-header">
        <h1>Editar Producto</h1>
        <button className="btn-volver" onClick={() => navigate("/productos")}>
          ← Volver
        </button>
      </div>

      {loading ? (
        <div className="estado">Cargando…</div>
      ) : error ? (
        <div className="estado estado-error">{error}</div>
      ) : (
        <form className="formulario-producto" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom_pr"
            placeholder="Nombre del producto*"
            value={formData.nom_pr}
            required
            onChange={handleChange}
          />

          <input
            type="text"
            inputMode="decimal"
            name="precio_pr"
            placeholder="Precio* (ej. 499.99)"
            value={formData.precio_pr}
            required
            onChange={handleChange}
          />

          <input
            type="text"
            inputMode="numeric"
            name="stock"
            placeholder="Stock*"
            value={formData.stock}
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="desc_pr"
            placeholder="Descripción"
            value={formData.desc_pr}
            onChange={handleChange}
          />

          <input
            type="text"
            name="img_pr"
            placeholder="URL de la imagen*"
            value={formData.img_pr}
            required
            onChange={handleChange}
          />

          <select
            name="id_cat"
            value={formData.id_cat}
            required
            onChange={handleChange}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_cat} value={cat.id_cat}>
                {cat.nom_cat}
              </option>
            ))}
          </select>

          <select
            name="status_pr"
            value={formData.status_pr}
            onChange={handleChange}
            title="Estado"
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>

          <div className="acciones">
            <button type="submit" className="btn-editar" disabled={saving}>
              {saving ? "Guardando…" : "Guardar Cambios"}
            </button>
            <button
              type="button"
              className="btn-desactivar"
              onClick={() => navigate("/productos")}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
