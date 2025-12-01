import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import AdminNavbar from "../AdminNavbar";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";


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


      <div style={{ marginBottom: 25, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
          onClick={() => setFilter("todos")}
          variant={filter === "todos" ? "primary" : "secondary"}
          style={{ borderRadius: 20, padding: "8px 16px" }}
        >
          Todos ({productos.length})
        </Button>
                {categorias.map(cat => (
          <Button
            key={cat}
            onClick={() => setFilter(cat)}
            variant={filter === cat ? "primary" : "secondary"}
            style={{ borderRadius: 20, padding: "8px 16px" }}
          >
            {cat} ({productos.filter(p => p.category === cat).length})
          </Button>
        ))}
      </div>


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
                                      <Badge variant={prod.disponible !== false ? "success" : "danger"}>
                    {prod.disponible !== false ? "✓ Disponible" : "✗ No disponible"}
                  </Badge>
                  )}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {editingId === prod.id ? (
                    <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                    <Button
                    onClick={() => handleSave(prod.id)}
                    variant="success"
                    style={{ padding: "6px 12px" }}
                  >
                    ✓ Guardar
                    </Button>
                    <Button
                    onClick={() => setEditingId(null)}
                    variant="danger"
                    style={{ padding: "6px 12px" }}
                  >
                    ✗ Cancelar
                    </Button>
                    </div>
                  ) : (
                    <Button
                    onClick={() => handleEdit(prod)}
                    variant="info"
                    style={{ padding: "6px 12px" }}
                  >
                    ✏️ Editar
                    </Button>
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
