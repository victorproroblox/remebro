import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../env";

export default function OAuthGoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",               // ← trae la cookie de sesión
          headers: { Accept: "application/json" }
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
          navigate("/login?error=google", { replace: true });
        }
      } catch {
        navigate("/login?error=net", { replace: true });
      }
    })();
  }, [navigate]);

  return <p style={{ color:"#fff", textAlign:"center" }}>Iniciando sesión…</p>;
}
