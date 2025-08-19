// src/pages/CompraExitosa.js
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { MdCheckCircle } from "react-icons/md";

export default function CompraExitosa() {
  const navigate = useNavigate();
  const location = useLocation();

  // Intentamos leer un id pasado por state (navigate('/compra-exitosa', { state: { producto_id } }))
  // Si no viene, usamos un ejemplo por ahora: 123456
  const productoId = useMemo(() => {
    return (
      location?.state?.producto_id ||
      sessionStorage.getItem("last_compra_producto_id") ||
      "123456"
    );
  }, [location]);

  // Guardamos por si refrescan la página
  useEffect(() => {
    if (location?.state?.producto_id) {
      sessionStorage.setItem(
        "last_compra_producto_id",
        String(location.state.producto_id)
      );
    }
  }, [location]);

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
              {productoId}
            </p>
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
