import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import AdminNavbar from "../AdminNavbar";

const AdminReports = ({ productos }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      const snap = await getDocs(collection(db, "pedidos"));
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalVentas = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const promedioVenta = orders.length > 0 ? totalVentas / orders.length : 0;

  const ventasPorCategoria = {};
  orders.forEach(orden => {
    orden.items?.forEach(item => {
      const prod = productos.find(p => p.id === item.id);
      if (prod) {
        const cat = prod.category;
        if (!ventasPorCategoria[cat]) {
          ventasPorCategoria[cat] = { cantidad: 0, monto: 0 };
        }
        ventasPorCategoria[cat].cantidad += item.qty;
        ventasPorCategoria[cat].monto += prod.precio * item.qty;
      }
    });
  });

  const categorias = Object.keys(ventasPorCategoria);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60 }}>⏳ Cargando reportes...</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 30, fontFamily: "Montserrat, sans-serif" }}>
      <AdminNavbar />
      <h2 style={{ color: "#2E8B57", marginBottom: 10 }}>📊 Reportes de Ventas</h2>
      <p style={{ color: "#666", marginBottom: 25 }}>Análisis de ventas por categoría y productos</p>

      {/* MÉTRICAS GENERALES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 30 }}>
        <div style={{ background: "#e8f5e9", border: "2px solid #4CAF50", padding: 20, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: "#2E8B57" }}>${totalVentas.toLocaleString()}</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#666" }}>Total Ventas</p>
        </div>
        <div style={{ background: "#fff3e0", border: "2px solid #FF9800", padding: 20, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: "#FF9800" }}>{orders.length}</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#666" }}>Total Órdenes</p>
        </div>
        <div style={{ background: "#e3f2fd", border: "2px solid #2196F3", padding: 20, borderRadius: 8, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: "#2196F3" }}>${Math.round(promedioVenta).toLocaleString()}</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#666" }}>Ticket Promedio</p>
        </div>
      </div>

      {/* VENTAS POR CATEGORÍA */}
      <h3 style={{ color: "#2E8B57", marginBottom: 15 }}>Ventas por Categoría</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#2E8B57", color: "#fff" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Categoría</th>
            <th style={{ padding: 12, textAlign: "center" }}>Unidades Vendidas</th>
                        <th style={{ padding: 12, textAlign: "center" }}>Unidades Vendidas</th>
            <th style={{ padding: 12, textAlign: "right" }}>Monto Total</th>
            <th style={{ padding: 12, textAlign: "center" }}>% del Total</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => {
            const porcentaje = ((ventasPorCategoria[cat].monto / totalVentas) * 100).toFixed(1);
            return (
              <tr key={cat} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>
                  <strong>{cat}</strong>
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {ventasPorCategoria[cat].cantidad} unidades
                </td>
                <td style={{ padding: 12, textAlign: "right", fontWeight: "bold", color: "#2E8B57" }}>
                  ${ventasPorCategoria[cat].monto.toLocaleString()}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      flex: 1,
                      background: "#e0e0e0",
                      borderRadius: 10,
                      height: 20,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${porcentaje}%`,
                        background: "linear-gradient(90deg, #2E8B57, #4CAF50)",
                        height: "100%",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                    <span style={{ fontWeight: "bold", minWidth: 45 }}>{porcentaje}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PRODUCTOS MÁS VENDIDOS */}
      <h3 style={{ color: "#2E8B57", marginTop: 40, marginBottom: 15 }}>🔥 Top 10 Productos Más Vendidos</h3>
      <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f3f7f0" }}>
              <th style={{ padding: 12, textAlign: "left" }}>Posición</th>
              <th style={{ padding: 12, textAlign: "left" }}>Producto</th>
              <th style={{ padding: 12, textAlign: "center" }}>Unidades</th>
              <th style={{ padding: 12, textAlign: "right" }}>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const ventasPorProducto = {};
              orders.forEach(orden => {
                orden.items?.forEach(item => {
                  const prod = productos.find(p => p.id === item.id);
                  if (prod) {
                    if (!ventasPorProducto[item.id]) {
                      ventasPorProducto[item.id] = {
                        nombre: prod.name,
                        cantidad: 0,
                        monto: 0
                      };
                    }
                    ventasPorProducto[item.id].cantidad += item.qty;
                    ventasPorProducto[item.id].monto += prod.precio * item.qty;
                  }
                });
              });

              const topProductos = Object.entries(ventasPorProducto)
                .sort((a, b) => b[1].cantidad - a[1].cantidad)
                .slice(0, 10);

              return topProductos.map(([id, data], index) => (
                <tr key={id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    <span style={{
                      display: "inline-block",
                      width: 30,
                      height: 30,
                      lineHeight: "30px",
                      borderRadius: "50%",
                      background: index < 3 ? "#FFD700" : "#e0e0e0",
                      fontWeight: "bold",
                      fontSize: 14
                    }}>
                      {index + 1}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <strong>{data.nombre}</strong>
                  </td>
                  <td style={{ padding: 12, textAlign: "center", fontSize: 14 }}>
                    {data.cantidad} unidades
                  </td>
                  <td style={{ padding: 12, textAlign: "right", fontWeight: "bold", color: "#2E8B57", fontSize: 15 }}>
                    ${data.monto.toLocaleString()}
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;

