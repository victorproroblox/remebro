import React from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function CompraExitosa() {
  const navigate = useNavigate();
  const productoId = sessionStorage.getItem("codigo_producto") || "123456"; // respaldo

  return (
    <div className="checkout-success-page">
      <div className="success-box">
        <h1>✅ ¡Compra realizada con éxito!</h1>
        <p>Gracias por tu compra en <strong>EduMochila</strong>.</p>
        <p>
          Tu código de producto es: <strong>{productoId}</strong>
        </p>

        <button className="btn-login" onClick={() => navigate("/home")}>
          Regresar al inicio
        </button>
      </div>
    </div>
  );
}
