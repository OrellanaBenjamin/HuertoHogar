import React, { useState } from "react";
import ProductList from "./ProductList";

const ProductFilter = ({ productos, addToCart }) => {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [origin, setOrigin] = useState("");

  const filtrar = () => {
    return productos.filter(p => {
      if (category && p.category !== category) return false;
      if (price && p.precio > Number(price)) return false;
      if (origin && !p.origen?.toLowerCase().includes(origin.toLowerCase()))
        return false;
      return true;
    });
  };

  const filtrados = filtrar();

  return (
    <div style={{ margin: "24px 0" }}>
      <div
        style={{
          background: "#f9f9f7",
          padding: 16,
          borderRadius: 9
        }}
      >
        <label>Categoría:</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="Frutas Frescas">Frutas Frescas</option>
          <option value="Verduras Orgánicas">Verduras Orgánicas</option>
          <option value="Productos Orgánicos">Productos Orgánicos</option>
          <option value="Productos Lácteos">Productos Lácteos</option>
        </select>

        <label style={{ marginLeft: 12 }}>Precio máx:</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <label style={{ marginLeft: 12 }}>Origen:</label>
        <input
          type="text"
          value={origin}
          onChange={e => setOrigin(e.target.value)}
        />
      </div>

      {}
      <ProductList productos={filtrados} addToCart={addToCart} />
    </div>
  );
};

export default ProductFilter;
