import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../env"; // ajusta la ruta si es necesario

export default function Logout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Cerrando sesión…");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const doLogout = async () => {
      const token = localStorage.getItem("token");

      try {
        if (token) {
          // Intentamos cerrar sesión en el backend (ignora si da 401/403)
          await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }).catch(() => {});
        }
      } catch (_) {
        // noop
      } finally {
        // Siempre limpiamos credenciales del lado del cliente
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        sessionStorage.removeItem("checkout_producto");

        if (!cancelled) {
          setStatus("Sesión cerrada. Redirigiendo…");
          setTimeout(() => navigate("/"), 700);
        }
      }
    };

    doLogout();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [navigate]);

  return (
    <div
      className="logout-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
      }}
    >
      <div
        className="logout-card"
        style={{
          background: "rgba(0,0,0,0.5)",
          padding: 24,
          borderRadius: 16,
          color: "#fff",
          textAlign: "center",
          width: 340,
        }}
      >
        <div
          className="spinner"
          style={{
            margin: "0 auto 12px",
            width: 28,
            height: 28,
            border: "3px solid #0af",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <h2 style={{ margin: "0 0 8px" }}>Cerrando sesión</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>{status}</p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 16,
            background: "#00aaff",
            border: 0,
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Ir al inicio
        </button>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
