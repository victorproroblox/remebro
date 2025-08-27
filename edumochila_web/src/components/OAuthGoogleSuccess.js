// src/pages/OAuthGoogleSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../env";

export default function OAuthGoogleSuccess() {
  const [msg, setMsg] = useState("Procesando inicio de sesión…");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",            // ← MUY IMPORTANTE (cookie de sesión)
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("logged_in", "true");

          const tip = Number(data.usuario?.tip_us ?? 2);
          if (tip === 1) navigate("/dashboard", { replace: true });
          else if (tip === 3) navigate("/maestro", { replace: true });
          else navigate("/home", { replace: true });
        } else {
          setMsg(data?.mensaje || "No hay sesión activa");
          navigate("/login?error=google", { replace: true });
        }
      } catch (e) {
        setMsg("Error conectando con el servidor");
        navigate("/login?error=net", { replace: true });
      }
    })();
  }, [navigate]);

  return <p style={{ color: "#fff", textAlign: "center" }}>{msg}</p>;
}
