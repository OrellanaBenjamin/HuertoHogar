import React from "react";
import ProductReviews from "./ProductReviews";

const ProductDetail = ({ producto, addToCart }) => {
  if (!producto) return <div>No hay producto seleccionado.</div>;

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 15,
        boxShadow: "0 2px 14px #eef",
        padding: "32px 20px",
        fontFamily: "Montserrat, sans-serif"
      }}
    >
      <img
        src={producto.img}
        alt={producto.name}
        style={{ width: 130, borderRadius: 12 }}
      />
      <h2 style={{ color: "#8B4513", marginTop: 10 }}>{producto.name}</h2>
      <p>{producto.desc}</p>
      <b>Precio:</b> ${producto.precio} &nbsp;
      <b>Stock:</b> {producto.stock}
      <div style={{ fontSize: 14, color: "#444", marginTop: 8 }}>
        <b>Origen:</b> {producto.origen}
      </div>

      {producto.recetas && producto.recetas.length > 0 && (
        <>
          <h4 style={{ marginTop: 17 }}>Recetas sugeridas:</h4>
          <ul>
            {producto.recetas.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}
      <ProductReviews productId={producto.id} />

      <button
        style={{
          background: "#2E8B57",
          color: "#fff",
          border: "none",
          borderRadius: 7,
          padding: "10px 32px",
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 18
        }}
        onClick={() => addToCart(producto.id, 1)}
        disabled={producto.stock === 0}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductDetail;

