import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductList = ({ productos = [], addToCart }) => {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [mensaje, setMensaje] = useState("");

  const filteredProducts = productos
    .filter(p => (filter ? p.category === filter : true))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (id, name) => {
    addToCart(id, 1);
    setMensaje(`${name} agregado al carrito`);
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div style={{ padding: "0 15px" }}>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ margin: "10px 0", borderRadius: 7, padding: "8px 12px", marginRight: 10 }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ borderRadius: 7, padding: "8px 12px" }}
        >
          <option value="">Todas</option>
          <option value="Frutas Frescas">Frutas Frescas</option>
          <option value="Verduras Orgánicas">Verduras Orgánicas</option>
          <option value="Productos Orgánicos">Productos Orgánicos</option>
          <option value="Productos Lácteos">Productos Lácteos</option>
        </select>
      </div>

      {/* mensaje pequeño debajo de filtros */}
      {mensaje && (
        <div
          style={{
            marginBottom: 16,
            color: "#2E8B57",
            fontWeight: "bold",
            fontSize: 14
          }}
        >
          {mensaje}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
          marginTop: 16
        }}
      >
        {filteredProducts.map(p => (
          <div
            key={p.id}
            style={{
              background: "#faf9ee",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 7px #ddd",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 4px 14px #ddd";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 7px #ddd";
            }}
          >
            <Link
              to={`/producto/${p.id}`}
              style={{ textDecoration: "none", color: "inherit", width: "100%" }}
            >
              {/* Contenedor de imagen con proporción fija */}
              <div
                style={{
                  width: "100%",
                  height: 120,
                  overflow: "hidden",
                  borderRadius: 10,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5"
                }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>

              <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
                {p.name}
              </div>
              <div style={{ color: "#8B4513", fontSize: 13, marginBottom: 6 }}>
                {p.origen || "Sin especificar"}
              </div>
              <div style={{ fontWeight: "bold", color: "#2E8B57", fontSize: 16, marginBottom: 6 }}>
                ${p.precio}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
                Stock: {p.stock}
              </div>
            </Link>

            <button
              style={{
                background: p.stock === 0 ? "#ccc" : "#2E8B57",
                color: p.stock === 0 ? "#999" : "#fff",
                border: "none",
                borderRadius: 7,
                padding: "8px 16px",
                fontWeight: "bold",
                fontSize: 14,
                cursor: p.stock === 0 ? "not-allowed" : "pointer",
                width: "100%",
                transition: "background 0.2s"
              }}
              onClick={() => handleAdd(p.id, p.name)}
              disabled={p.stock === 0}
              onMouseEnter={e => {
                if (p.stock > 0) e.currentTarget.style.background = "#1e6e47";
              }}
              onMouseLeave={e => {
                if (p.stock > 0) e.currentTarget.style.background = "#2E8B57";
              }}
            >
              {p.stock === 0 ? "Sin stock" : "Agregar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
