import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Checkout.css";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL } from "../env"; // o la ruta correcta

export default function Checkout() {
  const { id_pr } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token") || "";

  const formatPrice = (val) => {
    const n = Number(val ?? 0);
    try {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return `$${n.toFixed(2)}`;
    }
  };

  const amount = useMemo(
    () => Number(producto?.precio_pr ?? 0).toFixed(2),
    [producto]
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      // 1) Intento snapshot del catálogo
      try {
        const snap = sessionStorage.getItem("checkout_producto");
        if (snap) {
          const parsed = JSON.parse(snap);
          if (parsed && String(parsed.id_pr) === String(id_pr)) {
            if (mounted) setProducto(parsed);
          }
        }
      } catch {}

      // 2) GET /api/productos/:id
      if (mounted) {
        try {
          const r = await fetch(`${API_URL}/api/productos/${id_pr}`, {
            headers: { Accept: "application/json" },
          });
          if (r.ok) {
            const data = await r.json();
            if (mounted && data) setProducto(data);
          }
        } catch {}

        // 3) Fallback: GET /api/catalogo
        if (mounted && !producto) {
          try {
            const r2 = await fetch(`${API_URL}/api/catalogo`, {
              headers: { Accept: "application/json" },
            });
            if (r2.ok) {
              const list = await r2.json();
              const found = Array.isArray(list)
                ? list.find((p) => String(p.id_pr) === String(id_pr))
                : null;
              if (mounted && found) setProducto(found);
            } else if (mounted) {
              setError("No se pudo cargar el producto.");
            }
          } catch (e) {
            if (mounted) setError("No se pudo cargar el producto.");
          }
        }
      }

      if (mounted) setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_pr]);

  return (
    <>
      <Navbar />
      <main className="checkout">
        <section className="checkout-left">
          <h1>Resumen de compra</h1>

          {loading && <p className="loading">Cargando…</p>}
          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="product-card">
              <img
                src={
                  producto?.img_pr ||
                  "https://via.placeholder.com/300x300?text=EduMochila"
                }
                alt={producto?.nom_pr || "Producto"}
              />
              <div className="product-info">
                {producto?.categoria_nom && (
                  <span className="chip chip-info">
                    {producto.categoria_nom}
                  </span>
                )}
                <h2>{producto?.nom_pr || "—"}</h2>
                {producto?.desc_pr && (
                  <p className="desc">{producto.desc_pr}</p>
                )}
                <p className="price">{formatPrice(producto?.precio_pr)}</p>
                {!producto?.disponible && (
                  <p className="nota-agotado">
                    Este producto está actualmente agotado.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="checkout-right">
          <div className="payment-box">
            <h2>Método de pago</h2>
            <p>Elige PayPal para completar tu compra de forma segura.</p>

            {/* Botón de PayPal */}
            {!loading && producto && (
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                disabled={paying || !producto.disponible}
                forceReRender={[amount, paying, producto?.disponible]}
                createOrder={(data, actions) => {
                  // monto desde el producto
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: producto?.nom_pr || "EduMochila",
                        custom_id: String(producto?.id_pr || ""),
                        amount: { currency_code: "MXN", value: amount },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  setPaying(true);
                  try {
                    // Captura en PayPal (client-side)
                    const details = await actions.order.capture();

                    // Registrar venta en backend
                    const token = getToken();
                    if (!token) {
                      alert("Inicia sesión para continuar.");
                      navigate("/login");
                      return;
                    }

                    const resp = await fetch(`${API_URL}/api/ventas/paypal`, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        order_id: details.id,
                        id_pr: producto?.id_pr,
                        total: Number(producto?.precio_pr ?? 0),
                      }),
                    });

                    if (!resp.ok) {
                      const t = await resp.text();
                      throw new Error(
                        "No se pudo registrar la venta: " + t.slice(0, 200)
                      );
                    }

                    sessionStorage.removeItem("checkout_producto");
                    alert("Pago completado ✨ ¡Gracias por tu compra!");
                    navigate("/"); // o /gracias
                  } catch (e) {
                    console.error(e);
                    alert("Hubo un problema registrando tu pago.");
                  } finally {
                    setPaying(false);
                  }
                }}
                onError={(err) => {
                  console.error("Error PayPal:", err);
                  alert("Hubo un problema con el pago.");
                }}
              />
            )}

            {loading && (
              <div className="paypal-btn-placeholder">Preparando pago…</div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
