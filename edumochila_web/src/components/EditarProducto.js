import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Productos.css";
import { API_URL } from "../env";

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

  const baseUrl = useMemo(() => (API_URL || "").replace(/\/+$/, ""), []);

  /* ---------- Cargar producto ---------- */
  const obtenerProducto = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/productos/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Producto no encontrado");

      const raw = await res.json();
      const p = raw?.producto ?? raw;

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

  /* ---------- Cargar categorías ---------- */
  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/categorias`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => []);
      if (res.ok && Array.isArray(data)) setCategorias(data);
      else setCategorias([]);
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
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

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
      precio_pr: Number(String(formData.precio_pr).replace(/\./g, "").replace(",", ".")),
      stock: parseInt(formData.stock, 10),
      desc_pr: formData.desc_pr?.trim() || null,
      img_pr: formData.img_pr.trim(),
      id_cat: parseInt(formData.id_cat, 10),
      status_pr: parseInt(formData.status_pr, 10) || 0,
    };

    if (Number.isNaN(payload.precio_pr) || Number.isNaN(payload.stock)) {
      alert("Precio o stock inválidos.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/productos/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert(data.mensaje || "Producto actualizado correctamente");
        navigate("/productos");
      } else {
        alert(data.mensaje || "Error al actualizar producto");
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="prods">
      {/* Topbar */}
      <header className="prods__topbar">
        <div className="prods__title">
          <h1>Editar producto</h1>
          <p>Actualiza información del catálogo</p>
        </div>
        <div className="prods__actions">
          <button className="btn btn--ghost" onClick={() => navigate("/productos")}>
            ← Volver
          </button>
          <button
            className="btn btn--primary"
            form="form-editar-producto"
            type="submit"
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </header>

      {/* Contenido */}
      <section className="prods__content">
        {loading ? (
          <div className="estado">Cargando…</div>
        ) : error ? (
          <div className="estado estado-error">{error}</div>
        ) : (
          <form id="form-editar-producto" className="prods__form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Nombre*</label>
              <input
                type="text"
                name="nom_pr"
                placeholder="Nombre del producto"
                value={formData.nom_pr}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Precio* (ej. 499.99)</label>
              <input
                type="text"
                inputMode="decimal"
                name="precio_pr"
                placeholder="499.99"
                value={formData.precio_pr}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Stock*</label>
              <input
                type="text"
                inputMode="numeric"
                name="stock"
                placeholder="Cantidad"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field span-2">
              <label>Descripción</label>
              <input
                type="text"
                name="desc_pr"
                placeholder="Descripción breve"
                value={formData.desc_pr}
                onChange={handleChange}
              />
            </div>

            <div className="field span-2">
              <label>URL de la imagen*</label>
              <input
                type="text"
                name="img_pr"
                placeholder="https://..."
                value={formData.img_pr}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Categoría*</label>
              <select name="id_cat" value={formData.id_cat} onChange={handleChange} required>
                <option value="">Selecciona…</option>
                {categorias.map((c) => (
                  <option key={c.id_cat} value={c.id_cat}>
                    {c.nom_cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Estado</label>
              <select name="status_pr" value={formData.status_pr} onChange={handleChange}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>

            {/* Botonera responsive (por si prefieres aquí en vez del topbar) */}
            <div className="prods__formActions">
              <button className="btn btn--ghost" type="button" onClick={() => navigate("/productos")} disabled={saving}>
                Cancelar
              </button>
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
