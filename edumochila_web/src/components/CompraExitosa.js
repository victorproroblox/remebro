// src/pages/CompraExitosa.js
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { MdCheckCircle } from "react-icons/md";
import { API_URL } from "../env"; // asegúrate que apunte a tu API MySQL en Render

export default function CompraExitosa() {
  const navigate = useNavigate();
  const location = useLocation();

  // Guardamos el producto que se compró por si quieres usarlo como fallback
  const productoId = useMemo(() => {
    return (
      location?.state?.producto_id ||
      sessionStorage.getItem("last_compra_producto_id") ||
      ""
    );
  }, [location]);

  // Mantener el producto_id en sessionStorage, por si recargan la página
  useEffect(() => {
    if (location?.state?.producto_id) {
      sessionStorage.setItem(
        "last_compra_producto_id",
        String(location.state.producto_id)
      );
    }
  }, [location]);

  // Estado para el código más reciente
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let alive = true;

    const fetchUltimoCodigo = async () => {
      setLoading(true);
      setMensaje("");
      try {
        // Llama al endpoint público: GET /api/codigos/ultimo
        const res = await fetch(`${API_URL}/api/codigos/ultimo`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          // Si por alguna razón falla, no rompas la vista
          const raw = await res.text().catch(() => "");
          throw new Error(
            `No se pudo obtener el código. (${res.status}) ${raw.slice(0, 180)}`
          );
        }

        const data = await res.json().catch(() => ({}));
        // Esperamos algo como: { codigo: "ABC123", id_ve, creado_en }
        const c = data?.codigo || data?.data?.codigo || "";
        if (alive) {
          if (c) {
            setCodigo(String(c));
          } else {
            // Fallback si la API no trae el campo esperado
            setMensaje("No se recibió el código recién generado.");
          }
        }
      } catch (e) {
        if (alive) {
          setMensaje(
            e?.message || "No se pudo consultar el código recién generado."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchUltimoCodigo();
    return () => {
      alive = false;
    };
  }, []);

  // Lo que vamos a mostrar: prioriza el código traído de la API; si no, muestra el productoId como respaldo
  const codigoMostrado = codigo || productoId || "—";

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
              }}
            >
              {loading ? "Cargando..." : codigoMostrado}
            </p>

            {!!mensaje && (
              <p
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "#ffd9d9",
                  opacity: 0.85,
                }}
              >
                {mensaje}
              </p>
            )}
          </div>

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
