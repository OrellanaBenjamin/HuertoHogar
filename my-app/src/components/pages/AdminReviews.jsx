import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import AdminNavbar from "../AdminNavbar";

const AdminReviews = ({ productos }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReviews();
  }, []);

  const cargarReviews = async () => {
    try {
      const snap = await getDocs(collection(db, "reseñas"));
      const reviewsList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      reviewsList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setReviews(reviewsList);
    } catch (err) {
      console.error("Error cargando reseñas:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAprobacion = async (id, aprobado) => {
    try {
      await updateDoc(doc(db, "reseñas", id), { aprobado: !aprobado });
      setReviews(prev => prev.map(r => r.id === id ? {...r, aprobado: !aprobado} : r));
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    }
  };

  const eliminarReview = async (id) => {
    if (!window.confirm("¿Eliminar esta reseña?")) return;
    try {
      await deleteDoc(doc(db, "reseñas", id));
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const getProductoNombre = (prodId) => {
    const prod = productos.find(p => p.id === prodId);
    return prod ? prod.name : "Producto desconocido";
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60 }}>⏳ Cargando reseñas...</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 30, fontFamily: "Montserrat, sans-serif" }}>
      <AdminNavbar />
      <h2 style={{ color: "#2E8B57", marginBottom: 10 }}>⭐ Moderación de Reseñas</h2>
      <p style={{ color: "#666", marginBottom: 25 }}>Aprueba o elimina comentarios de clientes</p>

      {reviews.length === 0 ? (
        <div style={{ background: "#f9f9f9", padding: 40, borderRadius: 8, textAlign: "center" }}>
          <p>No hay reseñas registradas</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {reviews.map(review => (
            <div
              key={review.id}
              style={{
                background: "#fff",
                border: `2px solid ${review.aprobado ? "#4CAF50" : "#FF9800"}`,
                borderRadius: 8,
                padding: 20
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0", color: "#2E8B57" }}>{getProductoNombre(review.productoId)}</h4>
                  <p style={{ margin: "5px 0", fontSize: 13, color: "#666" }}>
                    👤 {review.userId} • 📅 {new Date(review.fecha).toLocaleDateString("es-CL")}
                  </p>
                  <div style={{ margin: "10px 0" }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < review.calificacion ? "#FFD700" : "#ddd", fontSize: 18 }}>★</span>
                    ))}
                    <span style={{ marginLeft: 8, fontWeight: "bold" }}>{review.calificacion}/5</span>
                  </div>
                  <p style={{ margin: "10px 0 0 0", fontSize: 14, lineHeight: 1.6 }}>{review.comentario}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
                  <button
                    onClick={() => toggleAprobacion(review.id, review.aprobado)}
                    style={{
                      background: review.aprobado ? "#4CAF50" : "#FF9800",
                      color: "#fff",
                      border: "none",
                      borderRadius: 5,
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: 12
                    }}
                  >
                    {review.aprobado ? "✓ Aprobada" : "⏳ Pendiente"}
                  </button>
                  <button
                    onClick={() => eliminarReview(review.id)}
                    style={{
                      background: "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: 5,
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: 12
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
