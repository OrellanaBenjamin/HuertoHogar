import React, { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [texto, setTexto] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const cargar = async () => {
      const q = query(
        collection(db, "reseñas"),
        where("productId", "==", productId)
      );
      const snaps = await getDocs(q);
      setReviews(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    if (productId) cargar();
  }, [productId]);

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Debes iniciar sesión para opinar");
    if (!texto.trim()) return;

    await addDoc(collection(db, "reseñas"), {
      productId,
      userId: user.uid,
      texto,
      rating,
      fecha: new Date().toLocaleString()
    });
    setTexto("");
    const q = query(
      collection(db, "reseñas"),
      where("productId", "==", productId)
    );
    const snaps = await getDocs(q);
    setReviews(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  return (
    <div style={{ marginTop: 25 }}>
      <h3 style={{ color: "#2E8B57" }}>Reseñas</h3>
      {reviews.length === 0 && <div>Sé el primero en opinar.</div>}
      {reviews.map(r => (
        <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
          <div>⭐ {r.rating}/5</div>
          <div>{r.texto}</div>
          <small>{r.fecha}</small>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <label>Calificación: </label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escribe tu reseña…"
        style={{ width: "100%", marginTop: 8, borderRadius: 8, padding: 8 }}
      />
      <button
        onClick={handleSend}
        style={{ marginTop: 8, background: "#2E8B57", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: "bold" }}
      >
        Enviar reseña
      </button>
    </div>
  );
};

export default ProductReviews;
