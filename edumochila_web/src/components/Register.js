import React, { useEffect, useState } from "react";
import "./Login.css";
import { MdBackpack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../env";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // cuenta
    nom1_us: "",
    nom2_us: "",
    ap_us: "",
    am_us: "",
    email_us: "",
    nom_us: "",
    pass_us: "",
    tip_us: 2, // 2=Cliente (default), 3=Maestro
    cedula_us: "",
    // domicilio
    cp_us: "",
    mun_us: "",
    id_estado: "",
    colonia_us: "",
    calle_us: "",
    ni_us: "",
    ne_us: "", // opcional
  });

  const [estados, setEstados] = useState([]);
  const [estadosError, setEstadosError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar estados desde la API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/estados`, {
          headers: { Accept: "application/json" },
        });
        if (!r.ok) throw new Error("No se pudieron cargar los estados.");
        const data = await r.json();
        if (alive) setEstados(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setEstadosError(e.message);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleTipoUsuario = (tipo) => {
    setForm((p) => ({ ...p, tip_us: tipo }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validaciones mínimas
    const required = ["nom1_us", "ap_us", "am_us", "email_us", "nom_us", "pass_us"];
    for (const k of required) {
      if (!String(form[k] ?? "").trim()) {
        setMensaje("Completa todos los campos obligatorios de la cuenta.");
        return;
      }
    }

    // Domicilio (ajusta si quieres volver alguno opcional)
    const requiredDom = ["cp_us", "mun_us", "id_estado", "colonia_us", "calle_us", "ni_us"];
    for (const k of requiredDom) {
      if (!String(form[k] ?? "").trim()) {
        setMensaje("Completa todos los campos del domicilio (NE es opcional).");
        return;
      }
    }

    // CP 5 dígitos
    if (!/^\d{5}$/.test(String(form.cp_us))) {
      setMensaje("El código postal debe tener 5 dígitos.");
      return;
    }

    // Maestro -> cédula obligatoria
    if (Number(form.tip_us) === 3 && !String(form.cedula_us).trim()) {
      setMensaje("La cédula es obligatoria para tipo Maestro.");
      return;
    }

    // Construir payload limpio
    const payload = {
      nom1_us: form.nom1_us.trim(),
      nom2_us: form.nom2_us?.trim() || null,
      ap_us: form.ap_us.trim(),
      am_us: form.am_us.trim(),
      email_us: form.email_us.trim(),
      nom_us: form.nom_us.trim(),
      pass_us: form.pass_us,
      tip_us: Number(form.tip_us) || 2,
      // domicilio
      cp_us: form.cp_us.trim(),
      mun_us: form.mun_us.trim(),
      id_estado: Number(form.id_estado),
      colonia_us: form.colonia_us.trim(),
      calle_us: form.calle_us.trim(),
      ni_us: form.ni_us.trim(),
      ne_us: form.ne_us?.trim() || null, // opcional
      // maestro
      cedula_us: Number(form.tip_us) === 3 ? form.cedula_us.trim() : null,
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
        setTimeout(() => navigate("/"), 1200);
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

      <form onSubmit={handleRegister} className="login-form register-two-cols">
        <MdBackpack size={32} className="form-icon" />
        <h2>Crea tu cuenta</h2>

        <div className="toggle-buttons" style={{ marginBottom: "12px" }}>
          <button
            type="button"
            className={Number(form.tip_us) === 2 ? "active" : ""}
            onClick={() => handleTipoUsuario(2)}
          >
            Cliente
          </button>
          <button
            type="button"
            className={Number(form.tip_us) === 3 ? "active" : ""}
            onClick={() => handleTipoUsuario(3)}
          >
            Maestro
          </button>
        </div>

        {/* Grid de dos columnas */}
        <div className="reg-grid">
          {/* Columna 1: Cuenta */}
          <section className="reg-card">
            <h3 className="reg-card-title">Datos de cuenta</h3>
            <div className="reg-fields">
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

              {Number(form.tip_us) === 3 && (
                <input
                  type="text"
                  name="cedula_us"
                  placeholder="Cédula profesional*"
                  value={form.cedula_us}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          </section>

          {/* Columna 2: Domicilio */}
          <section className="reg-card">
            <h3 className="reg-card-title">Domicilio</h3>
            <div className="reg-fields">
              <input
                type="text"
                name="cp_us"
                placeholder="Código postal (5 dígitos)*"
                value={form.cp_us}
                onChange={handleChange}
                maxLength={5}
                required
              />
              <input
                type="text"
                name="mun_us"
                placeholder="Municipio / Alcaldía*"
                value={form.mun_us}
                onChange={handleChange}
                required
              />

              <select
                name="id_estado"
                value={form.id_estado}
                onChange={handleChange}
                required
                className="select-order"
              >
                <option value="">Selecciona un estado*</option>
                {estados.map((e) => (
                  <option key={e.id_estado} value={e.id_estado}>
                    {e.nom_estado}
                  </option>
                ))}
              </select>
              {estadosError && (
                <small className="form-hint">{estadosError}</small>
              )}

              <input
                type="text"
                name="colonia_us"
                placeholder="Colonia*"
                value={form.colonia_us}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="calle_us"
                placeholder="Calle*"
                value={form.calle_us}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="ni_us"
                placeholder="Número interior*"
                value={form.ni_us}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="ne_us"
                placeholder="Número exterior (opcional)"
                value={form.ne_us}
                onChange={handleChange}
              />
            </div>
          </section>
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Creando…" : "Crear cuenta"}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="register-link">
          ¿Ya tienes cuenta? <span onClick={() => navigate("/")}>Inicia sesión</span>
        </p>
      </form>

      <p className="login-footer">© 2025 EduMochila. Todos los derechos reservados.</p>
    </div>
  );
}
