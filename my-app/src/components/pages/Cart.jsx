import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const COUPONS = {
  VERDE10: 0.10,
  CAMPO15: 0.15
};

const SHIPPING_OPTIONS = {
  normal: { name: "Envío Normal", cost: 2000, days: "3-5 días" },
  express: { name: "Envío Express", cost: 4000, days: "Mañana" }
};

const Cart = ({ carrito, productos, onRemove, onChangeQty, user }) =>{
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tipoEntrega, setTipoEntrega] = useState("envio");
  const [tipoEnvio, setTipoEnvio] = useState("normal"); 
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeliveryWarning, setShowDeliveryWarning] = useState(false);
  const navigate = useNavigate();

  const subtotal = carrito.reduce((acc, item) => {
    const prod = productos.find(p => p.id === item.id) || {};
    return acc + (prod.precio * item.qty || 0);
  }, 0);

  const applyCoupon = () => {
    const percent = COUPONS[coupon.toUpperCase()];
    if (percent) {
      setDiscount(subtotal * percent);
      setSuccessMsg(`✅ Cupón "${coupon.toUpperCase()}" aplicado (${Math.round(percent * 100)}% descuento)`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg("❌ Cupón no válido. Intenta con VERDE10 o CAMPO15");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const shippingCost = tipoEntrega === "envio" ? SHIPPING_OPTIONS[tipoEnvio].cost : 0;
  const total = subtotal - discount + shippingCost;

  const calcularFechaEntrega = () => {
    const hoy = new Date();
    if (tipoEntrega === "retiro") {
      return "Retiro en tienda";
    }
    if (tipoEnvio === "express") {
      const maniana = new Date(hoy);
      maniana.setDate(maniana.getDate() + 1);
      return `Mañana, ${maniana.toLocaleDateString("es-CL")}`;
    } else {
      const fechaMin = new Date(hoy);
      const fechaMax = new Date(hoy);
      fechaMin.setDate(fechaMin.getDate() + 3);
      fechaMax.setDate(fechaMax.getDate() + 5);
      return `Entre ${fechaMin.toLocaleDateString("es-CL")} y ${fechaMax.toLocaleDateString("es-CL")}`;
    }
  };

  const handleCheckoutWithDelivery = async () => {
    
    if (!auth.currentUser) {
      setErrorMsg("Debes iniciar sesión para comprar");
      return;
    }

    if (carrito.length === 0) {
      setErrorMsg("Tu carrito está vacío");
      return;
    }

    if (tipoEntrega === "retiro" && !confirm("Confirmas que vas a retirar el pedido en tienda durante horario de atención")) {
      return;
    }

    try {
      const fecha = new Date().toLocaleString("es-CL");
      const items = carrito.map(i => ({ id: i.id, qty: i.qty }));

      const docRef = await addDoc(collection(db, "pedidos"), {
        userId: auth.currentUser.uid,
        fecha,
        items,
        total,
        descuento: discount,
        estado: "Solicitado",
        tipoEntrega: tipoEntrega,
        tipoEnvio: tipoEntrega === "envio" ? tipoEnvio : null,
        costoEnvio: shippingCost,
        cuponyAplicado: coupon.toUpperCase() || null,
        subtotal: subtotal,
        fechaEstimadaEntrega: calcularFechaEntrega()
      });

      navigate(`/pago/${docRef.id}`, {
        state: {
          orderId: docRef.id,
          items,
          total,
          descuento: discount,
          subtotal,
          tipoEntrega,
          tipoEnvio,
          shippingCost,
          couponAplicado: coupon.toUpperCase(),
          fechaEstimada: calcularFechaEntrega()
        }
      });

      carrito.forEach(item => onRemove(item.id));
      setCoupon("");
      setDiscount(0);
      setTipoEntrega("envio");
      setTipoEnvio("normal");

    } catch (err) {
      setErrorMsg("Error al procesar pedido: " + err.message);
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: 750,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 15,
        boxShadow: "0 2px 14px #eef",
        padding: "30px 28px",
        fontFamily: "Montserrat, sans-serif"
      }}
    >
      <h2 style={{ color: "#2E8B57", marginBottom: 22 }}>🛒 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div style={{ color: "#8B4513", padding: 20, textAlign: "center" }}>
          <p style={{ fontSize: 16 }}>Tu carrito está vacío</p>
          <button
            onClick={() => navigate("/catalogo")}
            style={{
              marginTop: 15,
              background: "#2E8B57",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Continuar comprando
          </button>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", marginBottom: 17 }}>
            <thead>
              <tr style={{ background: "#F3F7F0", color: "#2E8B57" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Producto</th>
                <th style={{ padding: 10, textAlign: "center" }}>Precio</th>
                <th style={{ padding: 10, textAlign: "center" }}>Cantidad</th>
                <th style={{ padding: 10, textAlign: "right" }}>Subtotal</th>
                <th style={{ padding: 10 }}></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map(item => {
                const prod = productos.find(p => p.id === item.id) || {};
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <td style={{ padding: 10 }}>{prod.name}</td>
                    <td style={{ padding: 10, textAlign: "center" }}>${prod.precio?.toLocaleString()}</td>
                    <td style={{ padding: 10, textAlign: "center" }}>
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
                        style={{ width: 48, textAlign: "center", padding: 5, borderRadius: 4, border: "1px solid #ddd" }}
                      />
                    </td>
                    <td style={{ padding: 10, textAlign: "right" }}>${(prod.precio * item.qty)?.toLocaleString()}</td>
                    <td style={{ padding: 10 }}>
                      <button
                        style={{
                          color: "#fff",
                          background: "#e74c3c",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontSize: 12
                        }}
                        onClick={() => onRemove(item.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: 30, marginBottom: 20, padding: 15, background: "#f9f9f9", borderRadius: 8 }}>
            <label style={{ fontWeight: "bold", marginRight: 10 }}>Cupón de Descuento:</label>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="VERDE10, CAMPO15"
                style={{ borderRadius: 7, padding: "8px 10px", flex: 1, border: "1px solid #ddd" }}
              />
              <button
                onClick={applyCoupon}
                style={{
                  background: "#FFD700",
                  color: "#8B4513",
                  border: "none",
                  borderRadius: 7,
                  padding: "8px 20px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Aplicar
              </button>
            </div>
            {successMsg && <small style={{ color: "green", display: "block", marginTop: 8 }}>{successMsg}</small>}
            {errorMsg && <small style={{ color: "red", display: "block", marginTop: 8 }}>{errorMsg}</small>}
          </div>

          <div style={{ marginBottom: 20, padding: 15, background: "#f0f8ff", borderRadius: 8, border: "1px solid #2E8B57" }}>
            <label style={{ fontWeight: "bold", marginRight: 10, display: "block", marginBottom: 10 }}>
              📦 Tipo de Entrega:
            </label>
            <div style={{ display: "flex", gap: 20, marginBottom: 15 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="envio"
                  checked={tipoEntrega === "envio"}
                  onChange={e => setTipoEntrega(e.target.value)}
                />
                🚚 Envío a Domicilio
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="retiro"
                  checked={tipoEntrega === "retiro"}
                  onChange={e => setTipoEntrega(e.target.value)}
                />
                🏪 Retiro en Tienda
              </label>
            </div>

            {tipoEntrega === "envio" && (
              <div style={{ background: "#fff", padding: 12, borderRadius: 6, borderLeft: "4px solid #2196F3" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#2196F3" }}>Elige tipo de envío:</p>
                <div style={{ display: "flex", gap: 15, flexDirection: "column" }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: 10, background: tipoEnvio === "normal" ? "#e8f5e9" : "#fafafa", borderRadius: 6, border: tipoEnvio === "normal" ? "2px solid #4CAF50" : "1px solid #ddd" }}>
                    <input
                      type="radio"
                      name="tipoEnvio"
                      value="normal"
                      checked={tipoEnvio === "normal"}
                      onChange={e => setTipoEnvio(e.target.value)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold", color: "#333" }}>Envío Normal - $2.000</div>
                      <small style={{ color: "#666" }}>Llegará en 3-5 días hábiles</small>
                    </div>
                  </label>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: 10, background: tipoEnvio === "express" ? "#fff3e0" : "#fafafa", borderRadius: 6, border: tipoEnvio === "express" ? "2px solid #FF9800" : "1px solid #ddd" }}>
                    <input
                      type="radio"
                      name="tipoEnvio"
                      value="express"
                      checked={tipoEnvio === "express"}
                      onChange={e => setTipoEnvio(e.target.value)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold", color: "#333" }}>🚀 Envío Express - $4.000</div>
                      <small style={{ color: "#666" }}>¡Llega MAÑANA!</small>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {tipoEntrega === ("retiro")}

            <small style={{ display: "block", marginTop: 10, color: "#666" }}>
              {tipoEntrega === "envio" 
                ? `Fecha estimada: ${calcularFechaEntrega()}`
                : "Retira tu pedido en nuestras tiendas de lunes a viernes 09:00-18:00, sábado 10:00-14:00"}
            </small>
          </div>

          <div style={{ background: "#f3f7f0", padding: 15, borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 15, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal Productos:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div style={{ fontSize: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", color: "#2E8B57" }}>
                <span><b>Descuento {coupon ? `(${coupon.toUpperCase()})` : ""}:</b></span>
                <span><b>-${discount.toLocaleString()}</b></span>
              </div>
            )}

            {shippingCost > 0 && (
              <div style={{ fontSize: 15, marginBottom: 10, display: "flex", justifyContent: "space-between", color: "#2196F3" }}>
                <span><b>Costo de Envío ({tipoEnvio === "express" ? "Express" : "Normal"}):</b></span>
                <span><b>${shippingCost.toLocaleString()}</b></span>
              </div>
            )}

            <div style={{ fontSize: 18, color: "#2E8B57", fontWeight: "bold", display: "flex", justifyContent: "space-between", borderTop: "2px solid #2E8B57", paddingTop: 12, marginTop: 10 }}>
              <span>Total a Pagar:</span>
              <span>${total.toLocaleString()}</span>
            </div>

            {tipoEntrega === "envio" && (
              <small style={{ display: "block", marginTop: 10, color: "#666", fontStyle: "italic" }}>
                📦 Fecha estimada de entrega: <b>{calcularFechaEntrega()}</b>
              </small>
            )}
          </div>

          <div style={{
            background: "#fffbea",
            border: "1px solid #ffc107",
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            fontSize: 12,
            color: "#666"
          }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>ℹ️ Información importante:</p>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              {tipoEntrega === "envio" && (
                <>
                  <li>El envío normal llega en 3-5 días hábiles desde la confirmación</li>
                  <li>El envío express llega al día siguiente (solo para pedidos antes de las 15:00)</li>
                  <li>No incluye entregas los domingos ni festivos</li>
                </>
              )}
              {tipoEntrega === "retiro" && (
                <>
                  <li>Estará listo para retirar en 2-3 días hábiles</li>
                  <li>Abierto: Lunes a Viernes 09:00-18:00 | Sábado 10:00-14:00</li>
                  <li>Te enviaremos un email cuando esté listo para retirar</li>
                </>
              )}
            </ul>
          </div>


          <button
            style={{
              marginTop: 20,
              background: carrito.length === 0 ? "#ddd" : "#2E8B57",
              color: carrito.length === 0 ? "#999" : "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 0",
              fontWeight: "bold",
              fontSize: 18,
              width: "100%",
              cursor: carrito.length === 0 ? "not-allowed" : "pointer"
            }}
            disabled={carrito.length === 0 || !user?.dirección?.trim() || !user?.teléfono?.trim()}
            onClick={() => {
            if (!user?.dirección || !user?.teléfono) {
              setShowDeliveryWarning(true);
            } else {
                handleCheckoutWithDelivery();
            }
          }}
          >
            ✅ Confirmar Pedido - ${total.toLocaleString()}
          </button>
        </>
      )}

      {showDeliveryWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              fontSize: '48px'
            }}>
              ⚠️
            </div>
            
            <h2 style={{
              color: '#2E8B57',
              textAlign: 'center',
              marginTop: 0,
              marginBottom: '15px'
            }}>
              Información de Envío Incompleta
            </h2>

            <p style={{
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              Para poder procesar tu pedido, necesitamos saber:
            </p>

            <div style={{
              background: '#f7f7f7',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {!user?.dirección && (
                <div style={{ color: '#c62828', marginBottom: '10px', fontWeight: 'bold' }}>
                  ❌ Dirección de entrega
                </div>
              )}
              {!user?.teléfono && (
                <div style={{ color: '#c62828', fontWeight: 'bold' }}>
                  ❌ Teléfono de contacto
                </div>
              )}
            </div>

            <p style={{
              color: '#666',
              textAlign: 'center',
              fontSize: '14px',
              marginBottom: '25px'
            }}>
              Dirígete a tu perfil para completar estos datos antes de continuar.
            </p>

            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowDeliveryWarning(false)}
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  color: '#2E8B57',
                  border: '2px solid #2E8B57',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f0f8f5';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#fff';
                }}
              >
                Cerrar
              </button>

              <button
                onClick={() => {
                  setShowDeliveryWarning(false);
                  navigate('/perfil');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#2E8B57',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#1e6a41';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#2E8B57';
                }}
              >
                Ir a Perfil →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

