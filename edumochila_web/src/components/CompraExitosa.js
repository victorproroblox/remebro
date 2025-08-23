import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { MdCheckCircle } from "react-icons/md";
import { API_URL } from "../env";

export default function CompraExitosa() {
  const navigate = useNavigate();
  const location = useLocation();

  // Preferimos el id_ve (venta) para pedir el código recién generado
  const ventaId = useMemo(() => {
    return (
      location?.state?.venta_id ||
      sessionStorage.getItem("last_venta_id") ||
      null
    );
  }, [location]);

  const [codigo, setCodigo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Guarda venta_id si vino por state (para F5)
  useEffect(() => {
    if (location?.state?.venta_id) {
      sessionStorage.setItem("last_venta_id", String(location.state.venta_id));
    }
  }, [location]);

  // Pide el código más reciente (por venta, o global si no hay venta_id)
  useEffect(() => {
    let vivo = true;
    (async () => {
      setCargando(true);
      setError("");
      try {
        let url = `${API_URL}/api/codigos/ultimo`;
        if (ventaId) url += `?id_ve=${encodeURIComponent(ventaId)}`;

        const r = await fetch(url, { headers: { Accept: "application/json" } });
        const data = await r.json().catch(() => ({}));

        if (!r.ok) {
          throw new Error(data?.message || "No se pudo obtener el código.");
        }

        if (vivo) setCodigo(data?.codigo || null);
      } catch (e) {
        if (vivo) setError(e.message || "No se pudo obtener el código.");
      } finally {
        if (vivo) setCargando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [ventaId]);

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            background: "rgba(0,0,0,0.55)",
            borderRadius: 20,
            padding: 28,
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
          }}
        >
          <MdCheckCircle size={72} color="#00cfff" />
          <h1 style={{ margin: "12px 0 6px", fontSize: 28 }}>
            ¡Gracias por tu compra! 🎉
          </h1>
          <p style={{ margin: "0 0 16px", opacity: 0.9 }}>
            Tu pago se ha procesado correctamente.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 16,
              margin: "10px auto 18px",
            }}
          >
            <p style={{ margin: 0, fontSize: 16 }}>Tu código de producto es:</p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 26,
                fontWeight: "bold",
                color: "#00cfff",
                letterSpacing: 1,
                minHeight: 32,
              }}
            >
              {cargando ? "Cargando…" : codigo ?? "—"}
            </p>
          </div>

          {!!error && (
            <p style={{ marginTop: 6, color: "#fca5a5", fontSize: 14 }}>
              {error}
            </p>
          )}

          <button
            onClick={() => navigate("/home")}
            style={{
              marginTop: 8,
              background: "#00aaff",
              border: 0,
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Regresar al inicio
          </button>
        </div>
      </main>
    </>
  );
}
