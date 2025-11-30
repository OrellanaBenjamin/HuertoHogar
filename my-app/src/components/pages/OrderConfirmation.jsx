import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { generateReceiptHTML, openReceiptWindow } from "../../utils/generateReceipt";

const OrderConfirmation = ({ productos }) => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId || !auth.currentUser) {
        setError("No hay orden para mostrar");
        setLoading(false);
        return;
      }

      try {
        const ordenRef = doc(db, "pedidos", orderId);
        const ordenSnap = await getDoc(ordenRef);

        if (!ordenSnap.exists()) {
          setError("Orden no encontrada");
          setLoading(false);
          return;
        }

        const ordenData = { id: ordenSnap.id, ...ordenSnap.data() };
        setOrden(ordenData);

        const usuarioRef = doc(db, "usuarios", auth.currentUser.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          setUsuario(usuarioSnap.data());
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error cargando la orden: " + err.message);
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  const handlePrintReceipt = () => {
    if (!orden || !usuario) return;
    const html = generateReceiptHTML(orden, productos, usuario, orden.tipoEntrega || "envio");
    openReceiptWindow(html);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>
        <h2 style={{ color: "#2E8B57" }}>⏳ Cargando...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 30, background: "#fff", borderRadius: 15, boxShadow: "0 2px 14px #eef", fontFamily: "Montserrat, sans-serif" }}>
        <h2 style={{ color: "darkred" }}>❌ Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate("/catalogo")}
          style={{
            marginTop: 20,
            background: "#2E8B57",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  if (!orden) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>
        <h2 style={{ color: "#8B4513" }}>No hay orden</h2>
      </div>
    );
  }

  const items = orden.items || [];
  const detallesItems = items.map(item => {
    const prod = productos.find(p => p.id === item.id);
    return prod ? { ...item, nombre: prod.name, precioUnitario: prod.precio } : null;
  }).filter(Boolean);

  const subtotal = detallesItems.reduce((acc, item) => acc + (item.precioUnitario * item.qty), 0);
  const descuento = orden.descuento || 0;
  const total = orden.total || (subtotal - descuento);
  const tipoEntrega = orden.tipoEntrega || "envio";

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 15,
      boxShadow: "0 2px 14px #eef",
      padding: "40px 30px",
      fontFamily: "Montserrat, sans-serif"
    }}>

      <div style={{ textAlign: "center", marginBottom: 30, paddingBottom: 20, borderBottom: "2px solid #2E8B57" }}>
        <h1 style={{ color: "#2E8B57", fontSize: 32, marginBottom: 10 }}>✅ ¡Pedido Confirmado!</h1>
        <p style={{ color: "#666", fontSize: 16 }}>Gracias por tu compra en HuertoHogar</p>
      </div>


      <div style={{
        background: "#f0fff0",
        border: "2px solid #2E8B57",
        borderRadius: 8,
        padding: 15,
        marginBottom: 30,
        textAlign: "center"
      }}>
        <p style={{ color: "#666", margin: 0 }}>Número de Orden:</p>
        <p style={{ color: "#2E8B57", fontSize: 24, fontWeight: "bold", margin: "5px 0 0 0" }}>#{orden.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div style={{
        background: tipoEntrega === "retiro" ? "#fff3cd" : "#e3f2fd",
        border: `2px solid ${tipoEntrega === "retiro" ? "#ffc107" : "#2196F3"}`,
        borderRadius: 8,
        padding: 15,
        marginBottom: 30
      }}>
        <h3 style={{ color: "#333", margin: "0 0 10px 0" }}>
          {tipoEntrega === "retiro" ? "🏪 Retiro en Tienda" : "🚚 Envío a Domicilio"}
        </h3>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
          <p><strong>Tipo de entrega:</strong> {tipoEntrega === "retiro" ? "Retiro en Tienda" : "Envío a Domicilio"}</p>
          <p><strong>Fecha preferida:</strong> {new Date(orden.fechaEntregaPreferida).toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          {tipoEntrega === "retiro" && (
            <>
              <p><strong>Horario de atención:</strong></p>
              <ul style={{ marginTop: 5, paddingLeft: 20 }}>
                <li>Lunes a Viernes: 09:00 - 18:00 hrs</li>
                <li>Sábado: 10:00 - 14:00 hrs</li>
              </ul>
            </>
          )}
          {tipoEntrega === "envio" && (
            <p style={{ marginTop: 10, padding: 10, background: "rgba(255,255,255,0.7)", borderRadius: 5 }}>
              📦 Tu pedido será entregado en la dirección registrada: <strong>{usuario?.direccion || "No registrada"}</strong>
            </p>
          )}
        </div>
      </div>


      <h3 style={{ color: "#2E8B57", marginBottom: 15 }}>📋 Detalle de tu Pedido</h3>
      <table style={{ width: "100%", marginBottom: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f7f0", borderBottom: "2px solid #2E8B57" }}>
            <th style={{ padding: 10, textAlign: "left" }}>Producto</th>
            <th style={{ padding: 10, textAlign: "center" }}>Cantidad</th>
            <th style={{ padding: 10, textAlign: "right" }}>P. Unitario</th>
            <th style={{ padding: 10, textAlign: "right" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detallesItems.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>{item.nombre}</td>
              <td style={{ padding: 10, textAlign: "center" }}>{item.qty}</td>
              <td style={{ padding: 10, textAlign: "right" }}>${item.precioUnitario.toLocaleString()}</td>
              <td style={{ padding: 10, textAlign: "right" }}>${(item.precioUnitario * item.qty).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <div style={{
        background: "#f3f7f0",
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
        borderLeft: "4px solid #2E8B57"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 15 }}>
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        {descuento > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 15, color: "#2E8B57" }}>
            <span><strong>Descuento {orden.cuponyAplicado ? `(${orden.cuponyAplicado})` : ""}:</strong></span>
            <span><strong>-${descuento.toLocaleString()}</strong></span>
          </div>
        )}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: "bold",
          color: "#2E8B57",
          borderTop: "2px solid #2E8B57",
          paddingTop: 10
        }}>
          <span>Total a Pagar:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ background: "#f9f9f9", padding: 15, borderRadius: 8, marginBottom: 30 }}>
        <h4 style={{ color: "#2E8B57", marginTop: 0 }}>👤 Datos de Contacto</h4>
        <p style={{ margin: 5 }}><strong>Nombre:</strong> {usuario?.name || "No registrado"}</p>
        <p style={{ margin: 5 }}><strong>Email:</strong> {usuario?.email || "No registrado"}</p>
        <p style={{ margin: 5 }}><strong>Teléfono:</strong> {usuario?.telefono || "No proporcionado"}</p>
        <p style={{ margin: "5px 0" }}><strong>Dirección:</strong> {usuario?.direccion || "No registrada"}</p>
      </div>

      <div style={{
        background: "#fffbea",
        border: "1px solid #ffc107",
        borderRadius: 8,
        padding: 15,
        marginBottom: 30,
        fontSize: 13,
        lineHeight: 1.6
      }}>
        <p style={{ margin: 0, marginBottom: 10 }}>
          <strong>ℹ️ Información importante:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Recibirás una confirmación por email en breve</li>
          <li>Puedes rastrear tu pedido en tu historial de órdenes</li>
          <li>El estado de tu pedido cambiará a medida que se procese</li>
          <li>Conserva esta información para tu referencia</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: 15, flexDirection: "column" }}>
        <button
          onClick={handlePrintReceipt}
          style={{
            background: "#2E8B57",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 0",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          🖨️ Imprimir / Descargar Boleta
        </button>

        <button
          onClick={() => navigate("/historial")}
          style={{
            background: "#FFD700",
            color: "#8B4513",
            border: "none",
            borderRadius: 8,
            padding: "14px 0",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          📦 Ver Historial de Pedidos
        </button>

        <button
          onClick={() => navigate("/catalogo")}
          style={{
            background: "#fff",
            color: "#2E8B57",
            border: "2px solid #2E8B57",
            borderRadius: 8,
            padding: "14px 0",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          🛒 Continuar Comprando
        </button>
      </div>

      <div style={{
        textAlign: "center",
        marginTop: 30,
        paddingTop: 20,
        borderTop: "1px solid #eee",
        color: "#999",
        fontSize: 12
      }}>
        <p>✓ Gracias por confiar en HuertoHogar</p>
        <p>Conectando familias chilenas con el campo</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
