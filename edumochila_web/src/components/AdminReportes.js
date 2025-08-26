// src/pages/AdminReportes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reportes.css";
import { API_URL } from "../env";

const TABS = [
  { key: "ventas", label: "Ventas" },
  { key: "productos", label: "Productos" },
  { key: "usuarios", label: "Usuarios" },
  // { key: "codigos", label: "Códigos" },
];

const money = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Number(n || 0)
  );

export default function AdminReportes() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("ventas");
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtros, setFiltros] = useState({ from: "", to: "" });

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    setMeta(null);
    try {
      let url = `${API_URL}/api/reportes/${tab}`;
      if (tab === "ventas") {
        const qs = new URLSearchParams();
        if (filtros.from) qs.set("from", filtros.from);
        if (filtros.to) qs.set("to", filtros.to);
        const str = qs.toString();
        if (str) url += `?${str}`;
      }

      const r = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.message || "No se pudo cargar el reporte.");

      // Soportar ambos formatos: objeto {rows, meta} o arreglo plano (retrocompatibilidad)
      if (Array.isArray(data)) {
        setRows(data);
        setMeta(null);
      } else {
        setRows(Array.isArray(data.rows) ? data.rows : []);
        setMeta(data.meta || null);
      }
    } catch (e) {
      setRows([]);
      setMsg(e.message || "Error al cargar reporte.");
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

  const VentasFooter = () => {
    const totalReg = meta?.total_rows ?? rows.length;
    const totalSum = meta?.total_sum ?? rows.reduce((a, r) => a + Number(r.total_ve || 0), 0);
    return (
      <div className="rep-summary">
        <div className="rep-summary-chip">
          <strong>Registros:</strong> {totalReg}
        </div>
        <div className="rep-summary-chip rep-summary-total">
          <strong>Total de ventas:</strong> {money(totalSum)}
        </div>
      </div>
    );
  };

  const ProductosFooter = () => {
    const totalReg = meta?.total_rows ?? rows.length;
    const activos = meta?.total_activos ?? rows.filter((r) => Number(r.status_pr) === 1).length;
    return (
      <div className="rep-summary">
        <div className="rep-summary-chip">
          <strong>Total productos:</strong> {totalReg}
        </div>
        <div className="rep-summary-chip rep-summary-total">
          <strong>Activos:</strong> {activos}
        </div>
      </div>
    );
  };

  const UsuariosFooter = () => {
    const totalReg = meta?.total_rows ?? rows.length;
    return (
      <div className="rep-summary">
        <div className="rep-summary-chip rep-summary-total">
          <strong>Total de usuarios:</strong> {totalReg}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (loading) return <div className="estado">Cargando…</div>;
    if (msg) return <div className="estado estado-error">{msg}</div>;
    if (!rows.length) return <div className="estado">Sin resultados.</div>;

    switch (tab) {
      case "ventas":
        return (
          <>
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
                    <td>{new Date(r.fec_ve).toLocaleString()}</td>
                    <td>{money(r.total_ve)}</td>
                    <td>{r.nom_us}</td>
                    <td>{r.email_us}</td>
                    <td>{r.nom_pr}</td>
                    <td>{money(r.precio_pr)}</td>
                    <td>{r.paypal_order_id || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <VentasFooter />
          </>
        );

      case "productos":
        return (
          <>
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
                    <td>{money(r.precio_pr)}</td>
                    <td>{r.stock}</td>
                    <td>{Number(r.status_pr) === 1 ? "Activo" : "Inactivo"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ProductosFooter />
          </>
        );

      case "usuarios":
        return (
          <>
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
            <UsuariosFooter />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="rep-wrapper">
      <div className="rep-header">
        <div className="rep-header-top">
          <h1 className="rep-title">Reportes</h1>
          <button className="rep-back" onClick={() => navigate("/dashboard")}>
            ← Regresar
          </button>
        </div>

        <div className="rep-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`rep-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
              title={`Ver reporte de ${t.label.toLowerCase()}`}
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
      </div>

      <div className="rep-content">{renderTable()}</div>
    </main>
  );
}
