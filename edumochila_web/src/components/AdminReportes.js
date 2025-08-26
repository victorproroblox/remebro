import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Reportes.css";
import { API_URL } from "../env";

const TABS = [
  { key: "ventas", label: "Ventas" },
  { key: "productos", label: "Productos" },
  { key: "usuarios", label: "Usuarios" },
  // { key: "codigos", label: "Códigos" },
];

export default function AdminReportes() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("ventas");
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtros, setFiltros] = useState({ from: "", to: "" });

  const baseUrl = useMemo(() => (API_URL || "").replace(/\/+$/, ""), []);

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    try {
      let url = `${baseUrl}/api/reportes/${tab}`;
      if (tab === "ventas") {
        const qs = new URLSearchParams();
        if (filtros.from) qs.set("from", filtros.from);
        if (filtros.to) qs.set("to", filtros.to);
        const str = qs.toString();
        if (str) url += `?${str}`;
      }

      const r = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
      const payload = await r.json().catch(() => null);
      if (!r.ok) {
        const serverMsg = (payload && (payload.message || payload.error)) || `HTTP ${r.status}`;
        throw new Error(serverMsg);
      }

      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setTotals(payload?.totals ?? null);
    } catch (e) {
      setRows([]);
      setTotals(null);
      setMsg(e?.message || "Error al cargar reporte.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [tab]);

  const onFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((f) => ({ ...f, [name]: value }));
  };
  const onAplicar = () => fetchData();
  const volverInicio = () => navigate("/dashboard");

  const renderBadges = () => {
    if (!totals) return null;
    switch (tab) {
      case "ventas":
        return (
          <div className="rep__badges">
            <span className="rep__badge">Registros: <strong>{totals.count ?? 0}</strong></span>
            <span className="rep__badge">Importe total: <strong>${Number(totals.total_importe ?? 0).toFixed(2)}</strong></span>
          </div>
        );
      case "productos":
        return (
          <div className="rep__badges">
            <span className="rep__badge">Productos: <strong>{totals.total_productos ?? 0}</strong></span>
            <span className="rep__badge">Activos: <strong>{totals.total_activos ?? 0}</strong></span>
          </div>
        );
      case "usuarios":
        return (
          <div className="rep__badges">
            <span className="rep__badge">Usuarios: <strong>{totals.total_usuarios ?? 0}</strong></span>
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
          <div className="rep__tableWrap">
            <table className="rep__table">
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
          </div>
        );

      case "productos":
        return (
          <div className="rep__tableWrap">
            <table className="rep__table">
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
                    <td>
                      <span className={Number(r.status_pr) === 1 ? "pill pill--ok" : "pill pill--muted"}>
                        {Number(r.status_pr) === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "usuarios":
        return (
          <div className="rep__tableWrap">
            <table className="rep__table">
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rep">
      {/* Topbar */}
      <header className="rep__topbar">
        <div className="rep__title">
          <h1>Reportes</h1>
          <p>Visualiza ventas, inventario y usuarios</p>
        </div>
        <div className="rep__actions">
          <button className="btn btn--ghost" onClick={volverInicio}>← Inicio</button>
        </div>
      </header>

      {/* Tabs + Filtros */}
      <section className="rep__controls">
        <div className="rep__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`rep__tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "ventas" && (
          <div className="rep__filters">
            <label>
              Desde
              <input type="date" name="from" value={filtros.from} onChange={onFiltroChange} />
            </label>
            <label>
              Hasta
              <input type="date" name="to" value={filtros.to} onChange={onFiltroChange} />
            </label>
            <button className="btn btn--primary" onClick={onAplicar}>Aplicar</button>
          </div>
        )}

        {renderBadges()}
      </section>

      {/* Tabla */}
      <section className="rep__content">{renderTable()}</section>
    </div>
  );
}
