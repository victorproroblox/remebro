import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Catalogo.css";
import Navbar from "./Navbar";
import { API_URL } from "../env"; // asegúrate de que apunte a tu API

export default function Catalogo() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState("");
  const [orden, setOrden] = useState("nombre"); // precio_asc | precio_desc | nombre
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${API_URL}/api/catalogo`, {
          headers: { Accept: "application/json" },
        });
        if (!r.ok) throw new Error("No se pudo cargar el catálogo.");
        const data = await r.json();
        if (alive) {
          setProductos(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (e) {
        if (alive) setError(e.message || "Error al cargar el catálogo.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtrarOrdenar = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = productos.filter(
      (p) =>
        !q ||
        p.nom_pr?.toLowerCase().includes(q) ||
        p.desc_pr?.toLowerCase().includes(q)
    );

    switch (orden) {
      case "precio_asc":
        list = [...list].sort(
          (a, b) => Number(a.precio_pr ?? 0) - Number(b.precio_pr ?? 0)
        );
        break;
      case "precio_desc":
        list = [...list].sort(
          (a, b) => Number(b.precio_pr ?? 0) - Number(a.precio_pr ?? 0)
        );
        break;
      case "nombre":
        list = [...list].sort((a, b) =>
          (a.nom_pr || "").localeCompare(b.nom_pr || "")
        );
        break;
      default:
        // Si llegara un valor desconocido, no reordenamos.
        break;
    }
    return list;
  }, [productos, query, orden]);

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

  const onComprar = (prod) => {
    // Guarda snapshot opcional para el checkout
    sessionStorage.setItem("checkout_producto", JSON.stringify(prod));
    navigate(`/checkout/${prod.id_pr}`);
  };

  const fallbackImg = (e) => {
    e.currentTarget.src =
      "https://via.placeholder.com/600x400?text=EduMochila";
  };

  return (
    <>
      <Navbar />

      <main className="catalogo">
        {/* HERO */}
        <section className="catalogo-hero">
          <div className="catalogo-hero__overlay" />
          <div className="catalogo-hero__content">
            <h1 className="catalogo-hero__title">Catálogo de Mochilas</h1>
            <p className="catalogo-hero__subtitle">
              Descubre modelos con GPS, peso inteligente y seguridad integrada.
            </p>

            <div className="catalogo-controls">
              <input
                className="input-search"
                type="text"
                placeholder="Buscar por nombre o descripción"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <select
                className="input-order"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A–Z)</option>
              </select>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="productos-wrap">
          {loading && (
            <div className="grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="producto-card skeleton" key={`s-${i}`}>
                  <div className="s-img" />
                  <div className="s-line" />
                  <div className="s-line short" />
                  <div className="s-btn" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="estado estado-error">{error}</div>
          )}

          {!loading && !error && filtrarOrdenar.length === 0 && (
            <div className="estado">
              No hay productos que coincidan con tu búsqueda.
            </div>
          )}

          {!loading && !error && filtrarOrdenar.length > 0 && (
            <div className="grid">
              {filtrarOrdenar.map((prod) => (
                <article className="producto-card" key={prod.id_pr}>
                  <div className="producto-media">
                    <img
                      src={prod.img_pr}
                      alt={prod.nom_pr}
                      className="producto-img"
                      onError={fallbackImg}
                      loading="lazy"
                    />
                    {prod.disponible ? (
                      <span className="badge badge-success">En stock</span>
                    ) : (
                      <span className="badge badge-danger">Agotado</span>
                    )}
                  </div>

                  <div className="producto-body">
                    {prod.categoria_nom && (
                      <span className="chip chip-info">{prod.categoria_nom}</span>
                    )}
                    <h3 className="producto-title">{prod.nom_pr}</h3>
                    {prod.desc_pr && (
                      <p className="producto-desc">
                        {prod.desc_pr.length > 90
                          ? prod.desc_pr.slice(0, 90) + "…"
                          : prod.desc_pr}
                      </p>
                    )}
                  </div>

                  <div className="producto-footer">
                    <span className="precio">{formatPrice(prod.precio_pr)}</span>
                    <button
                      className="btn btn-primary btn-comprar"
                      onClick={() => onComprar(prod)}
                      disabled={!prod.disponible}
                      aria-disabled={!prod.disponible}
                      title={
                        !prod.disponible
                          ? "Producto agotado"
                          : "Proceder al checkout"
                      }
                    >
                      {prod.disponible ? "Comprar" : "Agotado"}
                    </button>
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
