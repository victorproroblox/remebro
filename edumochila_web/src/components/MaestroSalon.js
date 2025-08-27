// src/pages/MaestroSalon.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./Login.css";
import { API_URL, API_MONGO_URL } from "../env";

const API_SQL = API_URL || "https://edumochila-api-mysql.onrender.com";
const API_MONGO = API_MONGO_URL || "https://edumochila-api-mongo.onrender.com";

/* =======================
   Helpers de fechas
======================= */
const fmtDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  return `${y}-${m}-${dd}`;
};
const todayStr = () => fmtDate(new Date());

/** Devuelve array de YYYY-MM-DD entre from/to inclusive */
const eachDate = (fromStr, toStr) => {
  const list = [];
  const from = new Date(fromStr + "T00:00:00");
  const to = new Date(toStr + "T00:00:00");
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    list.push(fmtDate(d));
  }
  return list;
};

/* =======================
   Normalización de series
======================= */
/** Intenta mapear cualquier payload a { t, kg } */
const normalizePoint = (obj) => {
  const rawT =
    obj?.t ?? obj?.fecha ?? obj?.date ?? obj?.createdAt ?? obj?.timestamp;
  const rawKg = obj?.kg ?? obj?.peso ?? obj?.weight ?? obj?.valor;
  const t = rawT ? new Date(rawT).toISOString() : null;
  const kg = rawKg != null ? Number(rawKg) : null;
  return { t, kg };
};

/** Recibe array y devuelve solo puntos válidos [{t,kg}] */
const normalizeSeries = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(normalizePoint)
    .filter(
      (p) =>
        p.t &&
        Number.isFinite(new Date(p.t).getTime()) &&
        Number.isFinite(p.kg)
    );
};

/* =======================
   Mini LineChart SVG (con ejes)
======================= */
function LineChart({
  data,
  width = 860,
  height = 260,
  yTicks = 5, // cantidad de marcas en eje Y
  xLabelsMax = 6, // máximo de etiquetas en eje X
}) {
  const clean = normalizeSeries(data || []);
  if (clean.length === 0) {
    return (
      <div className="msalon-empty" style={{ marginTop: 8 }}>
        Sin datos para graficar.
      </div>
    );
  }

  // ordenar por tiempo
  const sorted = [...clean].sort(
    (a, b) => new Date(a.t).getTime() - new Date(b.t).getTime()
  );
  const times = sorted.map((d) => new Date(d.t).getTime());
  const values = sorted.map((d) => Number(d.kg));

  // padding para ejes/etiquetas
  const padLeft = 64;
  const padRight = 18;
  const padTop = 16;
  const padBottom = 36;

  // dominios
  let minX = Math.min(...times);
  let maxX = Math.max(...times);
  if (minX === maxX) maxX = minX + 1; // evita /0

  let minY = Math.min(...values);
  let maxY = Math.max(...values);
  if (minY === maxY) {
    // expandir un poquito si todo es constante
    minY = minY - Math.abs(minY) * 0.05 - 0.01;
    maxY = maxY + Math.abs(maxY) * 0.05 + 0.01;
  }

  // escalas
  const xScale = (x) =>
    padLeft +
    ((x - minX) / (maxX - minX)) * (width - padLeft - padRight);

  const yScale = (y) =>
    height -
    padBottom -
    ((y - minY) / (maxY - minY)) * (height - padTop - padBottom);

  // formato
  const fmtKg = (n) => {
    // 3 decimales si es pequeño, 2 si es > 1
    const abs = Math.abs(n);
    return abs >= 1 ? n.toFixed(2) : n.toFixed(3);
  };
  const fmtTime = (t) => {
    const d = new Date(t);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  // ticks Y "bonitos" sencillos
  const ticksY = [];
  for (let i = 0; i <= yTicks; i++) {
    ticksY.push(minY + ((maxY - minY) * i) / yTicks);
  }

  // etiquetas X: seleccionar ~xLabelsMax puntos espaciados
  const xLabelIdxStep = Math.max(1, Math.ceil(sorted.length / xLabelsMax));
  const xLabels = [];
  for (let i = 0; i < sorted.length; i += xLabelIdxStep) {
    xLabels.push({ t: times[i], x: xScale(times[i]) });
  }
  // asegurar el último
  if (xLabels.length === 0 || xLabels[xLabels.length - 1].t !== times[times.length - 1]) {
    xLabels.push({ t: times[times.length - 1], x: xScale(times[times.length - 1]) });
  }

  // path de la línea
  const pathD = sorted
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(new Date(d.t).getTime())} ${yScale(d.kg)}`)
    .join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* fondo sutil del plot */}
      <rect
        x={padLeft}
        y={padTop}
        width={width - padLeft - padRight}
        height={height - padTop - padBottom}
        fill="rgba(255,255,255,0.03)"
        rx="8"
      />

      {/* grid horizontal (Y) + etiquetas */}
      {ticksY.map((val, i) => {
        const y = yScale(val);
        return (
          <g key={`yg-${i}`}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke="#4b5563"
              strokeOpacity="0.28"
              strokeWidth="1"
            />
            <text
              x={padLeft - 10}
              y={y + 4}
              fill="#cfe7ee"
              fontSize="11"
              textAnchor="end"
            >
              {fmtKg(val)} kg
            </text>
          </g>
        );
      })}

      {/* grid vertical (X) + etiquetas */}
      {xLabels.map((lbl, i) => (
        <g key={`xg-${i}`}>
          <line
            x1={lbl.x}
            y1={padTop}
            x2={lbl.x}
            y2={height - padBottom}
            stroke="#4b5563"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <text
            x={lbl.x}
            y={height - padBottom + 16}
            fill="#cfe7ee"
            fontSize="11"
            textAnchor="middle"
          >
            {fmtTime(lbl.t)}
          </text>
        </g>
      ))}

      {/* ejes base */}
      <line
        x1={padLeft}
        y1={height - padBottom}
        x2={width - padRight}
        y2={height - padBottom}
        stroke="#9ca3af"
        strokeWidth="1.2"
      />
      <line
        x1={padLeft}
        y1={padTop}
        x2={padLeft}
        y2={height - padBottom}
        stroke="#9ca3af"
        strokeWidth="1.2"
      />

      {/* serie */}
      <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="3" />
      {sorted.map((d, i) => (
        <circle
          key={i}
          cx={xScale(new Date(d.t).getTime())}
          cy={yScale(d.kg)}
          r="3.8"
          fill="#22d3ee"
        />
      ))}
    </svg>
  );
}

/* =======================
   Componente principal
======================= */
export default function MaestroSalon() {
  const [alumnos, setAlumnos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom_alumno: "", producto_id: "" });
  const [msg, setMsg] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // { [producto_id]: { actual, hoy[], rango[], filtros:{from,to}, loading, error } }
  const [pesos, setPesos] = useState({});

  // Usuario sin JWT
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const id_us = usuario?.id_us;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* ----------- ALUMNOS (MySQL) ----------- */
  const fetchAlumnos = useCallback(async () => {
    if (!id_us) {
      setMsg("No hay sesión activa.");
      setAlumnos([]);
      return;
    }
    setLoadingList(true);
    setMsg("");
    try {
      const res = await fetch(`${API_SQL}/api/alumnos?id_us=${id_us}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.mensaje || "No se pudo cargar la lista");
        setAlumnos([]);
        return;
      }
      const list = Array.isArray(data.data) ? data.data : [];
      setAlumnos(list);

      // Inicializa pesos/filtros
      setPesos((prev) => {
        const next = { ...prev };
        list.forEach((a) => {
          if (!next[a.producto_id]) {
            next[a.producto_id] = {
              filtros: { from: todayStr(), to: todayStr() },
              actual: null,
              hoy: [],
              rango: [],
              loading: false,
              error: "",
            };
          }
        });
        return next;
      });
    } catch {
      setMsg("Error de red al cargar alumnos");
      setAlumnos([]);
    } finally {
      setLoadingList(false);
    }
  }, [id_us]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id_us) {
      setMsg("No hay sesión activa.");
      return;
    }
    const { nom_alumno, producto_id } = form;
    if (!nom_alumno?.trim() || !producto_id?.trim()) {
      setMsg("Nombre y producto_id son obligatorios.");
      return;
    }
    if (producto_id.trim().length > 10) {
      setMsg("producto_id debe tener máximo 10 caracteres.");
      return;
    }

    setLoadingSave(true);
    setMsg("");
    try {
      const res = await fetch(`${API_SQL}/api/alumnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_us,
          nom_alumno: nom_alumno.trim(),
          producto_id: producto_id.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.mensaje || "No se pudo registrar");
        return;
      }
      setMsg("Alumno registrado");
      setForm({ nom_alumno: "", producto_id: "" });
      setShowForm(false);
      fetchAlumnos();
    } catch {
      setMsg("Error de red al registrar");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDelete = async (producto_id) => {
    if (!id_us) {
      setMsg("No hay sesión activa.");
      return;
    }
    if (!window.confirm("¿Eliminar este alumno?")) return;
    try {
      const res = await fetch(
        `${API_SQL}/api/alumnos/${encodeURIComponent(
          producto_id
        )}?id_us=${id_us}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || data?.mensaje || "No se pudo eliminar");
        return;
      }
      setMsg("Alumno eliminado");
      setAlumnos((prev) =>
        prev.filter((a) => a.producto_id !== producto_id)
      );
      setPesos((p) => {
        const n = { ...p };
        delete n[producto_id];
        return n;
      });
    } catch {
      setMsg("Error de red al eliminar");
    }
  };

  /* ----------- MONGO: pesos (tus rutas) ----------- */

  // GET /api/peso/:producto_id/latest
  const fetchPesoActual = async (producto_id) => {
    setPesos((p) => ({
      ...p,
      [producto_id]: { ...p[producto_id], loading: true, error: "" },
    }));
    try {
      const res = await fetch(
        `${API_MONGO}/api/pesos/${encodeURIComponent(producto_id)}/latest`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.message || data?.mensaje || "Error al obtener peso actual"
        );

      const actualKg =
        data?.kg ??
        data?.peso ??
        data?.weight ??
        data?.valor ??
        (Number.isFinite(Number(data)) ? Number(data) : null);

      setPesos((p) => ({
        ...p,
        [producto_id]: {
          ...p[producto_id],
          actual: actualKg,
          loading: false,
        },
      }));
    } catch (e) {
      setPesos((p) => ({
        ...p,
        [producto_id]: {
          ...p[producto_id],
          loading: false,
          error: String(e.message || e),
        },
      }));
    }
  };

  // GET /api/peso/:producto_id/hoy -> array
  const fetchPesoDeHoy = async (producto_id) => {
    setPesos((p) => ({
      ...p,
      [producto_id]: { ...p[producto_id], loading: true, error: "" },
    }));
    try {
      const res = await fetch(
        `${API_MONGO}/api/pesos/${encodeURIComponent(producto_id)}/hoy`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.message || data?.mensaje || "Error al obtener pesos del día"
        );

      const hoySeries = normalizeSeries(data);
      setPesos((p) => ({
        ...p,
        [producto_id]: {
          ...p[producto_id],
          hoy: hoySeries,
          rango: [],
          loading: false,
        },
      }));
    } catch (e) {
      setPesos((p) => ({
        ...p,
        [producto_id]: {
          ...p[producto_id],
          loading: false,
          error: String(e.message || e),
        },
      }));
    }
  };

  // GET /api/peso/:producto_id?fecha=YYYY-MM-DD (acumula por rango)
  const fetchPesoPorRango = async (producto_id) => {
    const f = pesos[producto_id]?.filtros;
    const from = f?.from || todayStr();
    const to = f?.to || todayStr();

    const days = eachDate(from, to);
    if (days.length === 0) return;

    setPesos((p) => ({
      ...p,
      [producto_id]: { ...p[producto_id], loading: true, error: "" },
    }));

    try {
      const requests = days.map((fecha) =>
        fetch(
          `${API_MONGO}/api/pesos/${encodeURIComponent(
            producto_id
          )}?fecha=${encodeURIComponent(fecha)}`
        )
          .then((r) => r.json().catch(() => []))
          .then((arr) => normalizeSeries(arr))
          .catch(() => [])
      );
      const chunks = await Promise.all(requests);
      const merged = chunks.flat();

      setPesos((p) => ({
        ...p,
        [producto_id]: {
          ...p[producto_id],
          rango: merged,
          loading: false,
        },
      }));
    } catch (e) {
      setPesos((p) => ({
        ...p,
        [producto_id]: {
          ...p[producto_id],
          loading: false,
          error: String(e.message || e),
        },
      }));
    }
  };

  // Auto-carga: actual + hoy cuando hay alumnos
  useEffect(() => {
    (async () => {
      for (const a of alumnos) {
        await Promise.allSettled([
          fetchPesoActual(a.producto_id),
          fetchPesoDeHoy(a.producto_id),
        ]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alumnos.length]);

  const setFiltro = (producto_id, field, value) => {
    setPesos((p) => ({
      ...p,
      [producto_id]: {
        ...p[producto_id],
        filtros: { ...p[producto_id].filtros, [field]: value },
      },
    }));
  };

  return (
    <main className="msalon">
      {/* HERO */}
      <section className="msalon-hero">
        <div className="msalon-hero__overlay" />
        <div className="msalon-hero__content">
          <div className="msalon-hero__icon">🎓</div>
          <h1 className="msalon-hero__title">Este es tu salón de clases</h1>
          <p className="msalon-hero__subtitle">
            Administra a tus alumnos y vincula sus producto_id
          </p>

          <div className="msalon-actions">
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Cerrar" : "Agregar alumno"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="form-alumno" noValidate>
              <input
                name="nom_alumno"
                value={form.nom_alumno}
                onChange={handleChange}
                maxLength={100}
                placeholder="Nombre del alumno"
                required
              />
              <input
                name="producto_id"
                value={form.producto_id}
                onChange={handleChange}
                maxLength={10}
                placeholder="Producto ID"
                required
              />
              <button className="btn-success" disabled={loadingSave}>
                {loadingSave ? "Guardando..." : "Guardar"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* LISTA */}
      <section className="msalon-list">
        <h2>Alumnos registrados</h2>

        {!!msg && (
          <div className="msalon-empty" style={{ marginBottom: 10 }}>
            {msg}
          </div>
        )}

        {loadingList ? (
          <div className="msalon-empty">Cargando...</div>
        ) : alumnos.length === 0 ? (
          <div className="msalon-empty">Aún no hay alumnos.</div>
        ) : (
          <ul className="grid-alumnos" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {alumnos.map((a) => {
              const p = pesos[a.producto_id] || {
                filtros: { from: todayStr(), to: todayStr() },
                actual: null,
                hoy: [],
                rango: [],
                loading: false,
                error: "",
              };
              const iniciales = (a.nom_alumno || "?")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((s) => s[0]?.toUpperCase())
                .join("");

              return (
                <li
                  key={a.producto_id}
                  className="al-card"
                  style={{
                    gridTemplateColumns: "72px 1fr auto",
                    padding: 18,
                  }}
                >
                  <div className="al-avatar" style={{ width: 72, height: 72, fontSize: 22 }}>
                    {iniciales || "?"}
                  </div>

                  <div className="al-info">
                    <h3 style={{ fontSize: 18 }}>{a.nom_alumno || "(Sin nombre)"}</h3>
                    <p>Producto ID: {a.producto_id}</p>

                    {/* PESO ACTUAL */}
                    <div style={{ marginTop: 8, fontSize: 14, color: "#cfe7ee" }}>
                      <strong>Peso actual:</strong>{" "}
                      {p.loading
                        ? "Cargando..."
                        : p.actual != null
                        ? `${p.actual} kg`
                        : "—"}
                      <button
                        className="btn-link"
                        style={{ marginLeft: 10 }}
                        onClick={() => fetchPesoActual(a.producto_id)}
                        type="button"
                        title="Actualizar peso actual"
                      >
                        Actualizar
                      </button>
                    </div>

                    {/* FILTRO DE FECHAS */}
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input
                        type="date"
                        value={p.filtros.from}
                        onChange={(e) => setFiltro(a.producto_id, "from", e.target.value)}
                        className="date-input"
                        max={p.filtros.to || todayStr()}
                      />
                      <input
                        type="date"
                        value={p.filtros.to}
                        onChange={(e) => setFiltro(a.producto_id, "to", e.target.value)}
                        className="date-input"
                        min={p.filtros.from}
                        max={todayStr()}
                      />
                      <button
                        className="btn-primary"
                        type="button"
                        onClick={() => fetchPesoPorRango(a.producto_id)}
                        disabled={p.loading}
                        title="Consultar por rango"
                      >
                        Ver rango
                      </button>
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => fetchPesoDeHoy(a.producto_id)}
                        disabled={p.loading}
                        title="Ver pesos de hoy"
                      >
                        Hoy
                      </button>
                    </div>

                    {/* ERRORES MONGO */}
                    {p.error && (
                      <div className="msalon-empty" style={{ marginTop: 8 }}>
                        {p.error}
                      </div>
                    )}

                    {/* GRÁFICA */}
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}
                      >
                        <span style={{ fontSize: 13, color: "#9cc9d8" }}>
                          {p.rango && p.rango.length > 0
                            ? `Rango ${p.filtros.from} a ${p.filtros.to}`
                            : "Pesos del día"}
                        </span>
                        {p.loading && <span style={{ fontSize: 12 }}>Cargando...</span>}
                      </div>
                      <LineChart
                        data={p.rango && p.rango.length > 0 ? p.rango : p.hoy}
                        width={860}
                        height={260}
                        yTicks={5}
                        xLabelsMax={6}
                      />
                    </div>
                  </div>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(a.producto_id)}
                    title="Eliminar"
                    style={{ alignSelf: "start", padding: "10px 14px" }}
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
