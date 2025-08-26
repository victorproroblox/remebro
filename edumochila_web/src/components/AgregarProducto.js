import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Productos.css";
import { API_URL } from "../env";

export default function AgregarProducto() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom_pr: "",
    precio_pr: "",
    stock: "",
    desc_pr: "",
    img_pr: "",
    id_cat: "",
  });

  const baseUrl = useMemo(() => (API_URL || "").replace(/\/+$/, ""), []);

  /* -------- Helpers -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "precio_pr") {
      setFormData((p) => ({ ...p, [name]: value.replace(/[^\d.,]/g, "") }));
      return;
    }
    if (name === "stock" || name === "id_cat") {
      setFormData((p) => ({ ...p, [name]: value.replace(/[^\d]/g, "") }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* -------- Cargar categorías -------- */
  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/categorias`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => []);
      if (res.ok && Array.isArray(data)) setCategorias(data);
      else setCategorias([]);
    } catch (e) {
      console.error("Error cargando categorías:", e);
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  /* -------- Enviar formulario -------- */
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
      status_pr: 1, // Activo por defecto
    };

    if (Number.isNaN(payload.precio_pr) || Number.isNaN(payload.stock)) {
      alert("Precio o stock inválidos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/productos`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert(data.mensaje || "Producto agregado correctamente");
        navigate("/productos");
      } else {
        alert(data.mensaje || "Error al agregar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prods">
      {/* Topbar */}
      <header className="prods__topbar">
        <div className="prods__title">
          <h1>Agregar producto</h1>
          <p>Registra un nuevo artículo en el catálogo</p>
        </div>
        <div className="prods__actions">
          <button className="btn btn--ghost" onClick={() => navigate("/productos")}>
            ← Volver
          </button>
          <button
            className="btn btn--primary"
            form="form-agregar-producto"
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando…" : "Guardar producto"}
          </button>
        </div>
      </header>

      {/* Contenido */}
      <section className="prods__content">
        <form id="form-agregar-producto" className="prods__form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre*</label>
            <input
              type="text"
              name="nom_pr"
              placeholder="Nombre del producto"
              required
              value={formData.nom_pr}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Precio* (ej. 499.99)</label>
            <input
              type="text"
              inputMode="decimal"
              name="precio_pr"
              placeholder="499.99"
              required
              value={formData.precio_pr}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Stock*</label>
            <input
              type="text"
              inputMode="numeric"
              name="stock"
              placeholder="Cantidad"
              required
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="field span-2">
            <label>Descripción (opcional)</label>
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
              required
              value={formData.img_pr}
              onChange={handleChange}
            />
          </div>

          <div className="field span-2">
            <label>Categoría*</label>
            <select
              name="id_cat"
              required
              value={formData.id_cat}
              onChange={handleChange}
            >
              <option value="">Selecciona…</option>
              {categorias.map((c) => (
                <option key={c.id_cat} value={c.id_cat}>
                  {c.nom_cat}
                </option>
              ))}
            </select>
          </div>

          <div className="prods__formActions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/productos")}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Guardando…" : "Guardar producto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
