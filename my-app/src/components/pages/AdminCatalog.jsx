import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import AdminNavbar from "../AdminNavbar";

const AdminCatalog = ({ productos }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({});
  const [filter, setFilter] = useState("todos");

  const categorias = ["Frutas Frescas", "Verduras Orgánicas", "Productos Orgánicos", "Productos Lácteos"];

  const productosFiltrados = filter === "todos" 
    ? productos 
    : productos.filter(p => p.category === filter);

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setTempData({
      precio: producto.precio,
      stock: producto.stock || 0,
      disponible: producto.disponible !== false
    });
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, "productos", id), tempData);
      alert("✓ Producto actualizado");
      setEditingId(null);
      window.location.reload();
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 30, fontFamily: "Montserrat, sans-serif" }}>
      <AdminNavbar />
      <h2 style={{ color: "#2E8B57", marginBottom: 10 }}>🛒 Gestión de Catálogo</h2>
      <p style={{ color: "#666", marginBottom: 25 }}>Actualiza precios, stock y disponibilidad</p>

      {/* FILTROS */}
      <div style={{ marginBottom: 25, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("todos")}
          style={{
            background: filter === "todos" ? "#2E8B57" : "#f0f0f0",
            color: filter === "todos" ? "#fff" : "#333",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Todos ({productos.length})
        </button>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? "#2E8B57" : "#f0f0f0",
              color: filter === cat ? "#fff" : "#333",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {cat} ({productos.filter(p => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* TABLA */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#2E8B57", color: "#fff" }}>
              <th style={{ padding: 12, textAlign: "left" }}>Producto</th>
              <th style={{ padding: 12, textAlign: "left" }}>Categoría</th>
              <th style={{ padding: 12, textAlign: "center" }}>Precio</th>
              <th style={{ padding: 12, textAlign: "center" }}>Stock</th>
              <th style={{ padding: 12, textAlign: "center" }}>Estado</th>
              <th style={{ padding: 12, textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(prod => (
              <tr key={prod.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={prod.image} alt={prod.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }} />
                    <strong>{prod.name}</strong>
                  </div>
                </td>
                <td style={{ padding: 12, fontSize: 13 }}>{prod.category}</td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {editingId === prod.id ? (
                    <input
                      type="number"
                      value={tempData.precio}
                      onChange={(e) => setTempData({...tempData, precio: parseInt(e.target.value)})}
                      style={{ width: 80, padding: 5, borderRadius: 4, border: "1px solid #ddd" }}
                    />
                  ) : (
                    <span style={{ fontWeight: "bold", color: "#2E8B57" }}>${prod.precio?.toLocaleString()}</span>
                  )}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {editingId === prod.id ? (
                    <input
                      type="number"
                      value={tempData.stock}
                      onChange={(e) => setTempData({...tempData, stock: parseInt(e.target.value)})}
                      style={{ width: 60, padding: 5, borderRadius: 4, border: "1px solid #ddd" }}
                    />
                  ) : (
                    <span style={{ color: (prod.stock || 0) < 10 ? "red" : "#333" }}>
                      {prod.stock || 0} kg
                    </span>
                  )}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {editingId === prod.id ? (
                    <select
                      value={tempData.disponible}
                      onChange={(e) => setTempData({...tempData, disponible: e.target.value === "true"})}
                      style={{ padding: 5, borderRadius: 4, border: "1px solid #ddd" }}
                    >
                      <option value="true">Disponible</option>
                      <option value="false">No disponible</option>
                    </select>
                  ) : (
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: "bold",
                      background: prod.disponible !== false ? "#d4edda" : "#f8d7da",
                      color: prod.disponible !== false ? "#155724" : "#721c24"
                    }}>
                      {prod.disponible !== false ? "✓ Disponible" : "✗ No disponible"}
                    </span>
                  )}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {editingId === prod.id ? (
                    <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                      <button
                        onClick={() => handleSave(prod.id)}
                        style={{ background: "#4CAF50", color: "#fff", border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        ✓ Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ background: "#f44336", color: "#fff", border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        ✗ Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(prod)}
                      style={{ background: "#2196F3", color: "#fff", border: "none", borderRadius: 5, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      ✏️ Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCatalog;
