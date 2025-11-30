import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  "Solicitado": "#FFD700",
  "Preparando": "#FF9800",
  "Enviado": "#2196F3",
  "Entregado": "#4CAF50"
};

const STATUS_ICONS = {
  "Solicitado": "📋",
  "Preparando": "👨‍🍳",
  "Enviado": "🚚",
  "Entregado": "✅"
};

const OrderHistory = ({ productos }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "pedidos"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, snaps => {
      const lista = snaps.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setOrders(lista);
    });

    return () => unsub();
  }, [user]);

  const ordenesFiltradas = filtroEstado === "todos" 
    ? orders 
    : orders.filter(o => o.estado === filtroEstado);

  const handleViewReceipt = (orderId, orden) => {
    navigate(`/confirmacion/${orderId}`, {
      state: {
        orderId,
        items: orden.items,
        total: orden.total,
        descuento: orden.descuento,
        subtotal: orden.subtotal,
        fechaEntrega: orden.fechaEntregaPreferida,
        tipoEntrega: orden.tipoEntrega
      }
    });
  };

  const getDetallesItems = (items) => {
    return items.map(item => {
      const prod = productos.find(p => p.id === item.id);
      return prod ? { ...item, nombre: prod.name, precio: prod.precio } : null;
    }).filter(Boolean);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto", padding: 30, background: "#fff", borderRadius: 15, boxShadow: "0 2px 14px #eef", fontFamily: "Montserrat, sans-serif", textAlign: "center" }}>
        <h2 style={{ color: "#8B4513" }}>❌ Debes iniciar sesión</h2>
        <button
          onClick={() => navigate("/auth")}
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
          Ir a Login
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: 30,
      background: "#fff",
      borderRadius: 15,
      boxShadow: "0 2px 14px #eef",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <h2 style={{ color: "#2E8B57", marginBottom: 10 }}>📦 Historial de Pedidos</h2>
      <p style={{ color: "#666", marginBottom: 25 }}>Aquí puedes ver todos tus pedidos y su estado</p>

      <div style={{ marginBottom: 25, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setFiltroEstado("todos")}
          style={{
            background: filtroEstado === "todos" ? "#2E8B57" : "#f0f0f0",
            color: filtroEstado === "todos" ? "#fff" : "#333",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 13
          }}
        >
          Todos
        </button>
        {["Solicitado", "Preparando", "Enviado", "Entregado"].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            style={{
              background: filtroEstado === estado ? STATUS_COLORS[estado] : "#f0f0f0",
              color: filtroEstado === estado ? "#000" : "#333",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 13
            }}
          >
            {STATUS_ICONS[estado]} {estado}
          </button>
        ))}
      </div>

      {ordenesFiltradas.length === 0 ? (
        <div style={{
          background: "#f9f9f9",
          padding: 40,
          borderRadius: 8,
          textAlign: "center",
          color: "#666"
        }}>
          <p style={{ fontSize: 16 }}>No tienes pedidos {filtroEstado !== "todos" ? `en estado "${filtroEstado}"` : ""}.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {ordenesFiltradas.map(orden => (
            <div
              key={orden.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fafafa"
              }}
            >
              <div
                onClick={() => setExpandedOrder(expandedOrder === orden.id ? null : orden.id)}
                style={{
                  padding: 15,
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedOrder === orden.id ? "2px solid #2E8B57" : "none"
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, marginBottom: 5, fontWeight: "bold", color: "#333" }}>
                    Pedido #{orden.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                    📅 {new Date(orden.fecha).toLocaleDateString("es-CL")} - {new Date(orden.fecha).toLocaleTimeString("es-CL")}
                  </p>
                </div>

                <div style={{ textAlign: "right", marginRight: 20 }}>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: "bold", color: "#2E8B57" }}>
                    ${orden.total?.toLocaleString()}
                  </p>
                  <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#666" }}>
                    {orden.items?.length || 0} productos
                  </p>
                </div>

                <div style={{
                  background: STATUS_COLORS[orden.estado],
                  color: "#000",
                  padding: "8px 12px",
                  borderRadius: 5,
                  fontWeight: "bold",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                  {STATUS_ICONS[orden.estado]} {orden.estado}
                </div>

                <span style={{ marginLeft: 20, fontSize: 20, color: "#2E8B57" }}>
                  {expandedOrder === orden.id ? "▲" : "▼"}
                </span>
              </div>

              {expandedOrder === orden.id && (
                <div style={{ padding: 20, background: "#fff", borderTop: "1px solid #e0e0e0" }}>
                  <div style={{ marginBottom: 20, padding: 15, background: "#f0f8ff", borderRadius: 8, borderLeft: "4px solid #2196F3" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#2196F3" }}>
                      {orden.tipoEntrega === "retiro" ? "🏪 Retiro en Tienda" : "🚚 Envío a Domicilio"}
                    </h4>
                    <p style={{ margin: "5px 0", fontSize: 13 }}>
                      <strong>Tipo:</strong> {orden.tipoEntrega === "retiro" ? "Retiro" : "Envío"}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: 13 }}>
                      <strong>Fecha preferida:</strong> {new Date(orden.fechaEntregaPreferida).toLocaleDateString("es-CL")}
                    </p>
                  </div>

                  <h4 style={{ color: "#2E8B57", marginBottom: 10 }}>Productos:</h4>
                  <table style={{ width: "100%", marginBottom: 15, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f3f7f0" }}>
                        <th style={{ padding: 8, textAlign: "left", fontSize: 12 }}>Producto</th>
                        <th style={{ padding: 8, textAlign: "center", fontSize: 12 }}>Cantidad</th>
                        <th style={{ padding: 8, textAlign: "right", fontSize: 12 }}>P. Unit.</th>
                        <th style={{ padding: 8, textAlign: "right", fontSize: 12 }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getDetallesItems(orden.items || []).map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: 8, fontSize: 12 }}>{item.nombre}</td>
                          <td style={{ padding: 8, textAlign: "center", fontSize: 12 }}>{item.qty}</td>
                          <td style={{ padding: 8, textAlign: "right", fontSize: 12 }}>${item.precio?.toLocaleString()}</td>
                          <td style={{ padding: 8, textAlign: "right", fontSize: 12, fontWeight: "bold" }}>
                            ${(item.precio * item.qty)?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ background: "#f3f7f0", padding: 12, borderRadius: 5, marginBottom: 15 }}>
                    {orden.cuponyAplicado && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                        <span>Cupón aplicado:</span>
                        <span style={{ color: "#2E8B57", fontWeight: "bold" }}>{orden.cuponyAplicado} (-${orden.descuento?.toLocaleString()})</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: "bold", color: "#2E8B57" }}>
                      <span>Total:</span>
                      <span>${orden.total?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                    <button
                      onClick={() => handleViewReceipt(orden.id, orden)}
                      style={{
                        background: "#2E8B57",
                        color: "#fff",
                        border: "none",
                        borderRadius: 5,
                        padding: "10px 15px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: 13
                      }}
                    >
                      🖨️ Ver Boleta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
