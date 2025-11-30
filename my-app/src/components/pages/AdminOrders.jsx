import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ESTADOS = ["Solicitado", "Preparando", "Enviado", "Entregado"];

const STATUS_COLORS = {
  "Solicitado": "#FFD700",
  "Preparando": "#FF9800",
  "Enviado": "#2196F3",
  "Entregado": "#4CAF50"
};

const AdminOrders = ({ productos }) => {
  const [orders, setOrders] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const snaps = await getDocs(collection(db, "pedidos"));
        const ordersList = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        ordersList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setOrders(ordersList);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const cambiarEstado = async (orderId, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "pedidos", orderId), { estado: nuevoEstado });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, estado: nuevoEstado } : o))
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("Error al actualizar estado");
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto", padding: 30, background: "#fff", borderRadius: 15, boxShadow: "0 2px 14px #eef", fontFamily: "Montserrat, sans-serif", textAlign: "center" }}>
        <h2 style={{ color: "#8B4513" }}>❌ Acceso Denegado</h2>
        <p>Solo administradores pueden acceder a este panel</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: "40px auto", textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>
        <h2 style={{ color: "#2E8B57" }}>⏳ Cargando órdenes...</h2>
      </div>
    );
  }

  const ordenesFiltradas = filtroEstado === "todos"
    ? orders
    : orders.filter(o => o.estado === filtroEstado);

  const getDetallesItems = (items) => {
    return items.map(item => {
      const prod = productos.find(p => p.id === item.id);
      return prod ? { ...item, nombre: prod.name, precio: prod.precio } : null;
    }).filter(Boolean);
  };

  return (
    <div style={{
      maxWidth: 1100,
      margin: "40px auto",
      padding: 30,
      background: "#fff",
      borderRadius: 15,
      boxShadow: "0 2px 14px #eef",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <h2 style={{ color: "#2E8B57", marginBottom: 10 }}>⚙️ Panel de Administración</h2>
      <p style={{ color: "#666", marginBottom: 25 }}>Gestiona todas las órdenes del sistema</p>

      {/* ESTADÍSTICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 15, marginBottom: 25 }}>
        <div style={{ background: "#fff9e6", border: "2px solid #FFD700", padding: 15, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold", color: "#FFA500" }}>{orders.length}</p>
          <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#666" }}>Total de Órdenes</p>
        </div>
        <div style={{ background: "#fff3e0", border: "2px solid #FF9800", padding: 15, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold", color: "#FF9800" }}>{orders.filter(o => o.estado === "Preparando").length}</p>
          <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#666" }}>En Preparación</p>
        </div>
        <div style={{ background: "#e3f2fd", border: "2px solid #2196F3", padding: 15, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold", color: "#2196F3" }}>{orders.filter(o => o.estado === "Enviado").length}</p>
          <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#666" }}>En Envío</p>
        </div>
        <div style={{ background: "#f1f8e9", border: "2px solid #4CAF50", padding: 15, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold", color: "#4CAF50" }}>{orders.filter(o => o.estado === "Entregado").length}</p>
          <p style={{ margin: "5px 0 0 0", fontSize: 12, color: "#666" }}>Entregadas</p>
        </div>
      </div>

      {/* FILTROS */}
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
          Todas ({orders.length})
        </button>
        {ESTADOS.map(estado => (
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
            {estado} ({orders.filter(o => o.estado === estado).length})
          </button>
        ))}
      </div>

      {/* LISTA DE ÓRDENES */}
      {ordenesFiltradas.length === 0 ? (
        <div style={{ background: "#f9f9f9", padding: 40, borderRadius: 8, textAlign: "center", color: "#666" }}>
          <p style={{ fontSize: 16 }}>No hay órdenes en estado "{filtroEstado}"</p>
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
              {/* ENCABEZADO */}
              <div
                onClick={() => setExpandedOrder(expandedOrder === orden.id ? null : orden.id)}
                style={{
                  padding: 15,
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: expandedOrder === orden.id ? "2px solid #2E8B57" : "none",
                  gap: 15,
                  flexWrap: "wrap"
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ margin: 0, marginBottom: 5, fontWeight: "bold", color: "#333" }}>
                    #{orden.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                    📅 {new Date(orden.fecha).toLocaleDateString("es-CL")} - {new Date(orden.fecha).toLocaleTimeString("es-CL")}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: "bold", color: "#2E8B57" }}>
                    ${orden.total?.toLocaleString()}
                  </p>
                </div>

                <select
                  value={orden.estado}
                  onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: STATUS_COLORS[orden.estado],
                    color: "#000",
                    border: "none",
                    borderRadius: 5,
                    padding: "8px 12px",
                    fontWeight: "bold",
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  {ESTADOS.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>

                <span style={{ fontSize: 20, color: "#2E8B57" }}>
                  {expandedOrder === orden.id ? "▲" : "▼"}
                </span>
              </div>

              {/* DETALLES EXPANDIDOS */}
              {expandedOrder === orden.id && (
                <div style={{ padding: 20, background: "#fff", borderTop: "1px solid #e0e0e0" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    {/* CLIENTE */}
                    <div style={{ padding: 15, background: "#f9f9f9", borderRadius: 8 }}>
                      <h4 style={{ color: "#2E8B57", margin: "0 0 10px 0" }}>👤 Cliente</h4>
                      <p style={{ margin: "5px 0", fontSize: 13 }}>
                        <strong>Email:</strong> {orden.userId}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: 13 }}>
                        <strong>Tipo de Entrega:</strong> {orden.tipoEntrega === "retiro" ? "🏪 Retiro" : "🚚 Envío"}
                      </p>
                      <p style={{ margin: "5px 0", fontSize: 13 }}>
                        <strong>Fecha preferida:</strong> {new Date(orden.fechaEntregaPreferida).toLocaleDateString("es-CL")}
                      </p>
                    </div>

                    {/* RESUMEN */}
                    <div style={{ padding: 15, background: "#f0f8ff", borderRadius: 8 }}>
                      <h4 style={{ color: "#2196F3", margin: "0 0 10px 0" }}>📊 Resumen</h4>
                      <p style={{ margin: "5px 0", fontSize: 13 }}>
                        <strong>Productos:</strong> {orden.items?.length || 0}
                      </p>
                      {orden.descuento > 0 && (
                        <p style={{ margin: "5px 0", fontSize: 13, color: "#4CAF50" }}>
                          <strong>Descuento:</strong> ${orden.descuento?.toLocaleString()}
                        </p>
                      )}
                      <p style={{ margin: "10px 0 0 0", fontSize: 14, fontWeight: "bold", color: "#2E8B57" }}>
                        Total: ${orden.total?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* TABLA DE PRODUCTOS */}
                  <h4 style={{ color: "#2E8B57", marginBottom: 10 }}>Productos:</h4>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 15 }}>
                    <thead>
                      <tr style={{ background: "#f3f7f0" }}>
                        <th style={{ padding: 8, textAlign: "left", fontSize: 12 }}>Producto</th>
                        <th style={{ padding: 8, textAlign: "center", fontSize: 12 }}>Cant</th>
                        <th style={{ padding: 8, textAlign: "right", fontSize: 12 }}>P. Unit</th>
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
