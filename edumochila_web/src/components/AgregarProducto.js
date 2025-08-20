import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Productos.css";
import { API_URL } from "../env"; // Asegúrate de que apunte a tu API MySQL

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

  /* -------- Helpers -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "precio_pr") {
      // Solo dígitos, punto o coma
      setFormData((p) => ({ ...p, [name]: value.replace(/[^\d.,]/g, "") }));
      return;
    }
    if (name === "stock" || name === "id_cat") {
      // Solo dígitos
      setFormData((p) => ({ ...p, [name]: value.replace(/[^\d]/g, "") }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* -------- Cargar categorías -------- */
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
        console.error("No se pudieron cargar categorías");
      }
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
      status_pr: 1, // Activo por defecto
    };

    if (Number.isNaN(payload.precio_pr) || Number.isNaN(payload.stock)) {
      alert("Precio o stock inválidos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
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
    <div className="productos-wrapper">
      <div className="productos-header">
        <h1>Agregar Producto</h1>
        <button className="btn-volver" onClick={() => navigate("/productos")}>
          ← Volver
        </button>
      </div>

      <form className="formulario-producto" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom_pr"
          placeholder="Nombre del producto*"
          required
          value={formData.nom_pr}
          onChange={handleChange}
        />

        <input
          type="text"
          inputMode="decimal"
          name="precio_pr"
          placeholder="Precio* (ej. 499.99)"
          required
          value={formData.precio_pr}
          onChange={handleChange}
        />

        <input
          type="text"
          inputMode="numeric"
          name="stock"
          placeholder="Stock*"
          required
          value={formData.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          name="desc_pr"
          placeholder="Descripción (opcional)"
          value={formData.desc_pr}
          onChange={handleChange}
        />

        <input
          type="text"
          name="img_pr"
          placeholder="URL de la imagen*"
          required
          value={formData.img_pr}
          onChange={handleChange}
        />

        <select
          name="id_cat"
          required
          value={formData.id_cat}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_cat} value={cat.id_cat}>
              {cat.nom_cat}
            </option>
          ))}
        </select>

        <div className="acciones">
          <button type="submit" className="btn-agregar" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
          <button
            type="button"
            className="btn-desactivar"
            onClick={() => navigate("/productos")}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
