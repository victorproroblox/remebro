// src/pages/AdminReportes.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./Reportes.css";
import { API_URL } from "../env";

const TABS = [
  { key: "ventas", label: "Ventas" },
  { key: "productos", label: "Productos" },
  { key: "usuarios", label: "Usuarios" },
  // { key: "codigos", label: "Códigos" },
];

export default function AdminReportes() {
  const [tab, setTab] = useState("ventas");
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtros, setFiltros] = useState({ from: "", to: "" });

  const baseUrl = useMemo(() => {
    // Evita dobles "/" si API_URL ya viene con slash al final
    return (API_URL || "").replace(/\/+$/, "");
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    try {
      let url = `${baseUrl}/api/reportes/${tab}`;

      // Sólo ventas soporta filtros por fecha
      if (tab === "ventas") {
        const qs = new URLSearchParams();
        if (filtros.from) qs.set("from", filtros.from);
        if (filtros.to) qs.set("to", filtros.to);
        const str = qs.toString();
        if (str) url += `?${str}`;
      }

      const r = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      // Intenta parsear JSON aunque no sea ok para sacar mensaje del server
      const payload = await r.json().catch(() => null);

      if (!r.ok) {
        const serverMsg =
          (payload && (payload.message || payload.error)) ||
          `HTTP ${r.status}`;
        throw new Error(serverMsg);
      }

      // El backend responde: { data: [...], totals: {...} }
      const dataArray = Array.isArray(payload?.data) ? payload.data : [];
      setRows(dataArray);
      setTotals(payload?.totals ?? null);
    } catch (e) {
      setRows([]);
      setTotals(null);
      setMsg(e?.message || "Error al cargar reporte.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((f) => ({ ...f, [name]: value }));
  };

  const onAplicar = () => fetchData();

  const renderBadges = () => {
    if (!totals) return null;

    switch (tab) {
      case "ventas":
        return (
          <div className="rep-badges">
            <span className="rep-badge">
              Registros: <strong>{totals.count ?? 0}</strong>
            </span>
            <span className="rep-badge">
              Importe total:{" "}
              <strong>${Number(totals.total_importe ?? 0).toFixed(2)}</strong>
            </span>
          </div>
        );
      case "productos":
        return (
          <div className="rep-badges">
            <span className="rep-badge">
              Productos: <strong>{totals.total_productos ?? 0}</strong>
            </span>
            <span className="rep-badge">
              Activos: <strong>{totals.total_activos ?? 0}</strong>
            </span>
          </div>
        );
      case "usuarios":
        return (
          <div className="rep-badges">
            <span className="rep-badge">
              Usuarios: <strong>{totals.total_usuarios ?? 0}</strong>
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTable = () => {
    if (loading) return <div className="estado">Cargando…</div>;
    if (msg) return <div className="estado estado-error">{msg}</div>;
    if (!rows.length) return <div className="estado">Sin resultados.</div>;

    switch (tab) {
      case "ventas":
        return (
          <table className="rep-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>OrderId</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id_ve}>
                  <td>{r.id_ve}</td>
                  <td>{r.fec_ve ? new Date(r.fec_ve).toLocaleString() : "-"}</td>
                  <td>${Number(r.total_ve ?? 0).toFixed(2)}</td>
                  <td>{r.nom_us}</td>
                  <td>{r.email_us}</td>
                  <td>{r.nom_pr}</td>
                  <td>${Number(r.precio_pr ?? 0).toFixed(2)}</td>
                  <td>{r.paypal_order_id || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "productos":
        return (
          <table className="rep-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id_pr}>
                  <td>{r.id_pr}</td>
                  <td>{r.nom_pr}</td>
                  <td>{r.categoria || "-"}</td>
                  <td>${Number(r.precio_pr ?? 0).toFixed(2)}</td>
                  <td>{r.stock}</td>
                  <td>{Number(r.status_pr) === 1 ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "usuarios":
        return (
          <table className="rep-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id_us}>
                  <td>{r.id_us}</td>
                  <td>{r.nom_us}</td>
                  <td>{r.email_us}</td>
                  <td>{r.tip_us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      // case "codigos":
      //   return (...);
      default:
        return null;
    }
  };

  return (
    <main className="rep-wrapper">
      <div className="rep-header">
        <h1>Reportes</h1>

        <div className="rep-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`rep-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "ventas" && (
          <div className="rep-filtros">
            <div className="row">
              <label>
                Desde
                <input
                  type="date"
                  name="from"
                  value={filtros.from}
                  onChange={onFiltroChange}
                />
              </label>
              <label>
                Hasta
                <input
                  type="date"
                  name="to"
                  value={filtros.to}
                  onChange={onFiltroChange}
                />
              </label>
              <button className="rep-apply" onClick={onAplicar}>
                Aplicar
              </button>
            </div>
          </div>
        )}

        {renderBadges()}
      </div>

      <div className="rep-content">{renderTable()}</div>
    </main>
  );
}
