import React, { useState } from "react";

const COUPONS = {
  VERDE10: 0.10,
  CAMPO15: 0.15
};


const Cart = ({ carrito, productos, onRemove, onChangeQty, handleCheckout, fechaEntrega, setFechaEntrega }) => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = carrito.reduce((acc, item) => {
    const prod = productos.find(p => p.id === item.id) || {};
    return acc + (prod.precio * item.qty || 0);
  }, 0);

  const applyCoupon = () => {
    const percent = COUPONS[coupon.toUpperCase()];
    setDiscount(percent ? subtotal * percent : 0);
  };

  const total = subtotal - discount;

  return (
    <div
      className="cart-container"
      style={{
        maxWidth: 670,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 15,
        boxShadow: "0 2px 14px #eef",
        padding: "30px 28px",
        fontFamily: "Montserrat, sans-serif"
      }}
    >
      <h2 style={{ color: "#2E8B57", marginBottom: 22 }}>Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div style={{ color: "#8B4513" }}>Tu carrito está vacío.</div>
      ) : (
        <table style={{ width: "100%", marginBottom: 17 }}>
          <thead>
            <tr style={{ background: "#F3F7F0", color: "#2E8B57" }}>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map(item => {
              const prod = productos.find(p => p.id === item.id) || {};
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td>{prod.name}</td>
                  <td>${prod.precio}</td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      min={1}
                      max={prod.stock}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (val > prod.stock) return;
                        onChangeQty(item.id, val);
                      }}
                      style={{ width: 48, textAlign: "center" }}
                    />
                  </td>
                  <td>${prod.precio * item.qty}</td>
                  <td>
                    <button
                      style={{
                        color: "#fff",
                        background: "#2E8B57",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer"
                      }}
                      onClick={() => onRemove(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Cupón */}
      <div style={{ marginTop: 30, marginBottom: 19 }}>
        <label>Cupón: </label>
        <input
          type="text"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
          placeholder="VERDE10, CAMPO15"
          style={{ borderRadius: 7, padding: "5px 10px", marginRight: 10 }}
        />
        <button
          onClick={applyCoupon}
          style={{
            background: "#FFD700",
            color: "#8B4513",
            border: "none",
            borderRadius: 7,
            padding: "7px 20px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          Aplicar
        </button>
      </div>

      {/* Fecha de entrega preferida (requerimiento DSY) */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 10 }}>Fecha de entrega preferida:</label>
        <input
          type="date"
          value={fechaEntrega}
          onChange={e => setFechaEntrega(e.target.value)}
          style={{ borderRadius: 7, padding: "5px 10px" }}
        />
      </div>

      <div style={{ fontSize: 17 }}>
        <b>Subtotal:</b> ${subtotal}
      </div>
      <div style={{ fontSize: 17 }}>
        <b>Descuento:</b> ${discount}
      </div>
      <div style={{ fontSize: 18, color: "#2E8B57" }}>
        <b>Total: ${total}</b>
      </div>

      <button
  style={{
    marginTop: 26,
    background: carrito.length === 0 ? "#ddd" : "#2E8B57",
    color: carrito.length === 0 ? "#999" : "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 0",
    fontWeight: "bold",
    fontSize: 18,
    width: "100%",
    cursor: carrito.length === 0 ? "not-allowed" : "pointer"
  }}
  disabled={carrito.length === 0}
  onClick={handleCheckout}
>
  Proceder a pedido
</button>
    </div>
  );
};

export default Cart;
