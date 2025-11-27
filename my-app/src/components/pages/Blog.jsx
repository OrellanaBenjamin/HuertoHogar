import React, { useState, useEffect } from "react";
import { db, auth } from "../../config/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    getDocs(collection(db, "blog")).then(snaps => {
      const lista = snaps.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(lista.sort((a, b) => b.fecha - a.fecha));
    });
  }, []);

  const crearPost = async () => {
    if (!user) return;
    if (!titulo.trim() || !contenido.trim()) return;
    await addDoc(collection(db, "blog"), {
      usuario: user.email,
      titulo,
      contenido,
      fecha: Timestamp.now()
    });
    setTitulo(""); setContenido("");
  };

  return (
    <div style={{ maxWidth: 670, margin: "40px auto", background: "#fff", borderRadius: 14, boxShadow: "0 2px 14px #eef", padding: "32px 25px", fontFamily: "Montserrat, sans-serif" }}>
      <h2 style={{ color: "#8B4513", marginBottom: 18 }}>Entradas del Blog</h2>
      {user && (
        <div style={{ marginBottom: 30 }}>
          <input
            type="text"
            value={titulo}
            placeholder="Título"
            onChange={e => setTitulo(e.target.value)}
            style={{ marginRight: 8, padding: 6, borderRadius: 7 }}
          />
          <textarea
            value={contenido}
            placeholder="Contenido"
            onChange={e => setContenido(e.target.value)}
            style={{ width: "55%", verticalAlign: "top", borderRadius: 7, marginRight: 8, padding: 6 }}
          />
          <button
            style={{ background: "#2E8B57", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontWeight: "bold", fontSize: 15 }}
            onClick={crearPost}
          >
            Publicar
          </button>
        </div>
      )}
      <div>
        {posts.length === 0 ? (
          <div>No hay entradas aún.</div>
        ) : (
          posts.map(post => (
            <div key={post.id} style={{ borderBottom: "1px solid #ececec", marginBottom: 20, paddingBottom: 18 }}>
              <h4 style={{ color: "#2E8B57" }}>{post.titulo}</h4>
              <div style={{ color: "#6a5027", fontSize: 15 }}>{post.contenido}</div>
              <div style={{ color: "#aaa", fontSize: 14 }}>Por: {post.usuario}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Blog;
