import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const STATUS = {
  Solicitado: "Solicitado",
  Pendiente: "Pendiente",
  Preparando: "Preparando",
  Enviado: "Enviado",
  Entregado: "Entregado"
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "pedidos"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(q, snaps => {
      const lista = snaps.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(lista);
    });
    return () => unsub();
  }, [user]);

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: 30,
        background: "#fff",
        borderRadius: 15,
        boxShadow: "0 2px 14px #eef",
        fontFamily: "Montserrat, sans-serif"
      }}
    >
      <h2 style={{ color: "#2E8B57", marginBottom: 22 }}>Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <div>No tienes pedidos registrados.</div>
      ) : (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Fecha entrega</th>
              <th>Ítems</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.fecha}</td>
                <td>{o.fechaEntregaPreferida || "No indicada"}</td>
                <td>{Array.isArray(o.items) ? o.items.length : 0}</td>
                <td>${o.total}</td>
                <td>{STATUS[o.estado] || o.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
