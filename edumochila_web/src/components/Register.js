import React, { useState } from "react";
import "./Login.css";
import { MdBackpack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../env"; // o la ruta correcta


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom1_us: "",
    nom2_us: "",
    ap_us: "",
    am_us: "",
    email_us: "",
    nom_us: "",
    pass_us: "",
    tip_us: 2, // 2=Cliente (default), 3=Maestro
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleTipoUsuario = (tipo) => {
    setForm((p) => ({ ...p, tip_us: tipo }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validaciones básicas
    if (
      !form.nom1_us.trim() ||
      !form.ap_us.trim() ||
      !form.am_us.trim() ||
      !form.email_us.trim() ||
      !form.nom_us.trim() ||
      !form.pass_us
    ) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      nom1_us: form.nom1_us.trim(),
      nom2_us: form.nom2_us?.trim() || null,
      ap_us: form.ap_us.trim(),
      am_us: form.am_us.trim(),
      email_us: form.email_us.trim(),
      nom_us: form.nom_us.trim(),
      pass_us: form.pass_us,
      tip_us: Number(form.tip_us) || 2,
    };

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.estatus === "exitoso") {
        setMensaje("Usuario registrado con éxito. Redirigiendo…");
        setTimeout(() => {
          // si tu ruta de login es '/', mantenlo así
          navigate("/");
        }, 1200);
      } else {
        setMensaje(data.mensaje || "Error al registrar.");
      }
    } catch (error) {
      setMensaje("Error de red: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <form onSubmit={handleRegister} className="login-form">
        <MdBackpack size={32} className="form-icon" />
        <h2>Crea tu cuenta</h2>

        <div className="toggle-buttons" style={{ marginBottom: "15px" }}>
          <button
            type="button"
            className={form.tip_us === 2 ? "active" : ""}
            onClick={() => handleTipoUsuario(2)}
          >
            Cliente
          </button>
          <button
            type="button"
            className={form.tip_us === 3 ? "active" : ""}
            onClick={() => handleTipoUsuario(3)}
          >
            Maestro
          </button>
        </div>

        <input
          type="text"
          name="nom1_us"
          placeholder="Primer nombre*"
          value={form.nom1_us}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nom2_us"
          placeholder="Segundo nombre (opcional)"
          value={form.nom2_us}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ap_us"
          placeholder="Apellido paterno*"
          value={form.ap_us}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="am_us"
          placeholder="Apellido materno*"
          value={form.am_us}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email_us"
          placeholder="Correo electrónico*"
          value={form.email_us}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nom_us"
          placeholder="Nombre de usuario*"
          value={form.nom_us}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <input
          type="password"
          name="pass_us"
          placeholder="Contraseña*"
          value={form.pass_us}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Creando…" : "Crear cuenta"}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="register-link">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/")}>Inicia sesión</span>
        </p>
      </form>

      <p className="login-footer">
        © 2025 EduMochila. Todos los derechos reservados.
      </p>
    </div>
  );
}
