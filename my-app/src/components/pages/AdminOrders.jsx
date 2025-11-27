import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const ESTADOS = ["Solicitado", "Preparando", "Enviado", "Entregado"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const snaps = await getDocs(collection(db, "pedidos"));
      setOrders(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    cargar();
  }, []);

  const cambiarEstado = async (id, nuevo) => {
    await updateDoc(doc(db, "pedidos", id), { estado: nuevo });
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, estado: nuevo } : o))
    );
  };

  // (opcional) proteger por rol admin si manejas roles en "usuarios"
  const user = auth.currentUser;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 30, background: "#fff", borderRadius: 15, boxShadow: "0 2px 14px #eef" }}>
      <h2 style={{ color: "#2E8B57", marginBottom: 22 }}>Administrar pedidos</h2>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>{o.fecha}</td>
              <td>${o.total}</td>
              <td>
                <select
                  value={o.estado}
                  onChange={e => cambiarEstado(o.id, e.target.value)}
                >
                  {ESTADOS.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
