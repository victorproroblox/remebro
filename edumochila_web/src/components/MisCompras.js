// src/pages/MisCompras.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./MisCompras.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { API_URL } from "../env";

function formatCurrency(n) {
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
}

function formatDate(d) {
  try {
    const dt = new Date(d);
    return dt.toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d || "");
  }
}

export default function MisCompras() {
  const navigate = useNavigate();
  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario") || "null");
    } catch {
      return null;
    }
  }, []);

  const id_us = usuario?.id_us;
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id_us) {
        setMsg("No hay sesión activa. Inicia sesión para ver tus compras.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(`${API_URL}/api/codigos/mios?id_us=${encodeURIComponent(id_us)}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMsg(data?.message || "No se pudieron cargar tus compras.");
          setCompras([]);
          return;
        }
        const list = Array.isArray(data?.data) ? data.data : [];
        setCompras(list);
      } catch (e) {
        setMsg("Error de red al consultar tus compras.");
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_us]);

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
          padding: "24px 16px",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ color: "#fff", margin: "12px 0" }}>Mis compras y códigos</h1>
            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={() => navigate("/catalogo")}
                style={{
                  background: "#00aaff",
                  color: "#fff",
                  border: 0,
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Ir al catálogo
              </button>
            </div>
          </header>

          {loading ? (
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#e6f8ff",
                padding: 16,
                borderRadius: 12,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              Cargando…
            </div>
          ) : msg ? (
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#ffdddd",
                padding: 16,
                borderRadius: 12,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              {msg}
            </div>
          ) : compras.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#e6f8ff",
                padding: 16,
                borderRadius: 12,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              Aún no tienes compras registradas.
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "14px 0 24px",
                display: "grid",
                gap: 14,
              }}
            >
              {compras.map((item) => (
                <li
                  key={`${item.codigo_id}-${item.id_ve}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "82px 1fr auto",
                    gap: 14,
                    alignItems: "center",
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: 14,
                    padding: 12,
                    color: "#fff",
                  }}
                >
                  <img
                    src={
                      item.img_pr ||
                      "https://via.placeholder.com/160x160?text=EduMochila"
                    }
                    alt={item.nom_pr || "Producto"}
                    style={{
                      width: 82,
                      height: 82,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{item.nom_pr || "Producto"}</h3>
                    <div style={{ opacity: 0.9, marginTop: 4, fontSize: 14 }}>
                      <strong>Código:</strong>{" "}
                      <span style={{ color: "#22d3ee", fontWeight: 700 }}>
                        {item.codigo}
                      </span>
                    </div>
                    <div style={{ opacity: 0.9, marginTop: 4, fontSize: 14 }}>
                      <strong>Comprado:</strong> {formatDate(item.fec_ve)}
                      {" · "}
                      <strong>Registrado:</strong> {formatDate(item.creado_en)}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "#c2f0ff" }}>
                      {formatCurrency(item.total_ve ?? item.precio_pr)}
                    </div>
                    <button
                      onClick={() => navigate(`/producto/${item.id_pr}`)}
                      style={{
                        marginTop: 8,
                        background: "transparent",
                        color: "#00cfff",
                        border: "1px solid #00cfff",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Ver producto
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
