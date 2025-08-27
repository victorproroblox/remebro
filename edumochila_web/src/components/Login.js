import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { MdBackpack } from "react-icons/md";
import { API_URL } from "../env";

export default function Login() {
  const [nom_us, setNomUs] = useState("");
  const [pass_us, setPassUs] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ---- Util: parsear query
  const getQuery = () => new URLSearchParams(location.search);

  // ---- Al regresar del callback de Google (sin JWT):
  // Esperamos ?u=<base64url(JSON del usuario)>
  useEffect(() => {
    const q = getQuery();
    const u = q.get("u");
    if (!u) return;

    try {
      // decode base64url
      const b64 = u.replace(/-/g, "+").replace(/_/g, "/");
      const jsonStr = decodeURIComponent(
        atob(b64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const usuario = JSON.parse(jsonStr);

      if (usuario && usuario.id_us) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("logged_in", "true");

        const tip = Number(usuario?.tip_us ?? 2);
        if (tip === 1) navigate("/dashboard", { replace: true });
        else if (tip === 3) navigate("/maestro", { replace: true });
        else navigate("/home", { replace: true });
      } else {
        setMensaje("No se recibió un usuario válido desde Google.");
      }
    } catch (e) {
      setMensaje("Error procesando el inicio con Google.");
    }
    // limpiamos el query para que no quede en la URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nom_us.trim() || !pass_us) {
      setMensaje("Ingresa tu usuario y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ nom_us: nom_us.trim(), pass_us }),
      });

      if (!res.ok) {
        let msg = `Error del servidor (${res.status})`;
        try {
          const data = await res.json();
          msg = data?.mensaje || data?.error || msg;
        } catch {}
        setMensaje(msg);
        return;
      }

      const data = await res.json().catch(() => null);

      // Contrato sin JWT: { estatus: "exitoso", usuario: {...} }
      if (data?.estatus === "exitoso" && data?.usuario) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("logged_in", "true");

        const tip_us = Number(data.usuario?.tip_us ?? 2);
        if (tip_us === 1) navigate("/dashboard", { replace: true });
        else if (tip_us === 3) navigate("/maestro", { replace: true });
        else navigate("/home", { replace: true });
        return;
      }

      setMensaje(data?.mensaje || "Credenciales inválidas.");
    } catch (err) {
      setMensaje("Error de red: " + (err?.message || "Failed to fetch"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // puedes mandar 'from' si luego quieres volver a donde estaba el usuario
    const from = encodeURIComponent(window.location.href);
    window.location.href = `${API_URL}/api/auth/google/redirect?from=${from}`;
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <form className="login-form" onSubmit={handleLogin}>
        <MdBackpack size={40} className="form-icon" />
        <h2>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nom_us}
          onChange={(e) => setNomUs(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass_us}
          onChange={(e) => setPassUs(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button className="btn-login" type="submit" disabled={loading}>
          {loading ? "Ingresando…" : "Entrar"}
        </button>

        <div className="divider">
          <span>o</span>
        </div>

        <button
  type="button"
  className="btn-google"
  onClick={() => {
    const from = window.location.origin; // o la ruta actual
    window.location.href = `${API_URL}/api/auth/google/redirect?from=${encodeURIComponent(from)}`;
  }}
>
  Continuar con Google
</button>


        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="register-link">
          ¿No tienes cuenta? <span onClick={() => navigate("/register")}>Regístrate</span>
        </p>
      </form>

      <p className="login-footer">© 2025 EduMochila. Todos los derechos reservados.</p>
    </div>
  );
}
