// src/pages/AdminReportes.jsx
import React, { useEffect, useState } from "react";
import "./Reportes.css";
import { API_URL } from "../env";

const TABS = [
  { key: "ventas", label: "Ventas" },
  { key: "productos", label: "Productos" },
  { key: "usuarios", label: "Usuarios" },
  // Si quieres agregar "Códigos", descomenta:
  // { key: "codigos", label: "Códigos" },
];

export default function AdminReportes() {
  const [tab, setTab] = useState("ventas");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [filtros, setFiltros] = useState({ from: "", to: "" });

  const fetchData = async () => {
    setLoading(true);
    setMsg("");
    try {
      let url = `${API_URL}/api/reportes/${tab}`;
      // Sólo ventas soporta filtros por fecha en este ejemplo
      if (tab === "ventas") {
        const qs = new URLSearchParams();
        if (filtros.from) qs.set("from", filtros.from);
        if (filtros.to) qs.set("to", filtros.to);
        const str = qs.toString();
        if (str) url += `?${str}`;
      }

      const r = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await r.json().catch(() => (Array.isArray(rows) ? [] : []));
      if (!r.ok) throw new Error(data?.message || "No se pudo cargar el reporte.");
      setRows(Array.isArray(data) ? data : []);
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
                  <td>{new Date(r.fec_ve).toLocaleString()}</td>
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

      // Si habilitas la pestaña "Códigos":
      // case "codigos":
      //   return (
      //     <table className="rep-table">
      //       <thead>
      //         <tr>
      //           <th>ID</th>
      //           <th>Código</th>
      //           <th>Creado</th>
      //           <th>ID Venta</th>
      //           <th>Usuario</th>
      //           <th>Producto</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {rows.map((r) => (
      //           <tr key={r.id}>
      //             <td>{r.id}</td>
      //             <td>{r.codigo}</td>
      //             <td>{new Date(r.creado_en).toLocaleString()}</td>
      //             <td>{r.id_ve}</td>
      //             <td>{r.nom_us}</td>
      //             <td>{r.nom_pr}</td>
      //           </tr>
      //         ))}
      //       </tbody>
      //     </table>
      //   );

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
      </div>

      <div className="rep-content">{renderTable()}</div>
    </main>
  );
}
