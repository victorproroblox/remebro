import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { MdBackpack } from "react-icons/md";
import { API_URL } from "../env";
import { setToken } from "../lib/auth";

export default function Login() {
  const [nom_us, setNomUs] = useState("");
  const [pass_us, setPassUs] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!nom_us.trim() || !pass_us) {
      setMensaje("Ingresa tu usuario y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const payload = { nom_us: nom_us.trim(), pass_us };

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (data && (data.mensaje || data.error)) ||
          `Error del servidor (${res.status})`;
        setMensaje(msg);
        return;
      }

      if (!data || data.estatus !== "exitoso" || !data.access_token) {
        setMensaje(
          (data && data.mensaje) || "Respuesta inválida del servidor."
        );
        return;
      }

      // Guardar token y usuario
      setToken(data.access_token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setMensaje("Inicio de sesión exitoso. Redirigiendo…");

      // 👉 Ruteo según tipo de usuario:
      const tip_us = Number(data.usuario?.tip_us ?? 2);

      setTimeout(() => {
        if (tip_us === 1) {
          navigate("/dashboard", { replace: true }); // admin (si lo usas)
        } else if (tip_us === 3) {
          navigate("/maestro", { replace: true });   // maestro
        } else {
          navigate("/home", { replace: true });      // cliente/alumno
        }
      }, 400);
    } catch (err) {
      setMensaje("Error de red: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoadingGoogle(true);
    window.location.href = `${API_URL}/api/auth/google`;
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
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          aria-disabled={loadingGoogle}
          title="Continuar con Google"
        >
          {/* icono google */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
            className="google-icon"
            aria-hidden="true"
          >
            <path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.3c-6.3 34-25 62.7-53.3 81.9v67h86.2c50.4-46.4 81.3-114.9 81.3-193.8z" />
            <path d="M272 544.3c73.5 0 135.2-24.3 180.2-65.9l-86.2-67c-23.9 16.1-54.7 25.5-94 25.5-72.2 0-133.6-48.8-155.5-114.4H28.5v71.9C73 486.5 166 544.3 272 544.3z" />
            <path d="M116.5 322.5c-10.6-31.5-10.6-65.4 0-96.9v-71.9H28.5C-9.5 206-9.5 338.1 28.5 417.5l88-95z" />
            <path d="M272 106.3c39.9-.6 77.9 14 106.7 41.4l80-80C440.8 24.7 378.9-.7 309.4 0 203.5 0 110.5 57.9 68.5 146.3l88 71.9C138.5 154.8 199.9 106.3 272 106.3z" />
          </svg>
          {loadingGoogle ? "Redirigiendo…" : "Continuar con Google"}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="register-link">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")}>Regístrate</span>
        </p>
      </form>

      <p className="login-footer">© 2025 EduMochila. Todos los derechos reservados.</p>
    </div>
  );
}
