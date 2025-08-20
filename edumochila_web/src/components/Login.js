import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { MdBackpack } from "react-icons/md";
import { API_URL } from "../env";
// import { setToken } from "../lib/auth"; // <-- quitar

export default function Login() {
  const [nom_us, setNomUs] = useState("");
  const [pass_us, setPassUs] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nom_us.trim() || !pass_us) {
      setMensaje("Ingresa tu usuario y contraseña.");
      return;
    }

    setLoading(true);
    try {
      // si quitaste por completo las rutas de auth del backend,
      // cambia esta URL a la que sí tengas para validar credenciales
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ nom_us: nom_us.trim(), pass_us }),
      });

      // Si falla por CORS, fetch lanza TypeError y caemos al catch
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

      // Nuevo contrato SIN JWT: esperamos usuario pero NO access_token
      // { estatus: "exitoso", usuario: {...}, mensaje? }
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
      // "Failed to fetch" casi siempre = CORS o red
      setMensaje("Error de red: " + (err?.message || "Failed to fetch"));
    } finally {
      setLoading(false);
    }
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

        {/* Quitar Google si ya no usas OAuth en el backend */}
        {/* <div className="divider"><span>o</span></div>
        <button type="button" className="btn-google" onClick={() => window.location.href = `${API_URL}/api/auth/google`}>
          Continuar con Google
        </button> */}

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="register-link">
          ¿No tienes cuenta? <span onClick={() => navigate("/register")}>Regístrate</span>
        </p>
      </form>

      <p className="login-footer">© 2025 EduMochila. Todos los derechos reservados.</p>
    </div>
  );
}
