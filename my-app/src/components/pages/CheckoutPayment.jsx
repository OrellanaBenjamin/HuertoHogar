import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const CheckoutPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pago_vivienda');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'pedidos', orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (orderDoc.exists()) {
          setOrder(orderDoc.data());
        } else {
          setError('Pedido no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el pedido: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,19}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

   const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'pago_vivienda') {
      if (!order || order.total > 50000) {
        setError('Pago en vivienda solo disponible para pedidos menores a $50.000');
        return;
      }
    } else if (paymentMethod === 'debito' || paymentMethod === 'credito') {
      if (!validateCardNumber(cardNumber)) {
        setError('Número de tarjeta inválido');
        return;
      }
      if (!cardHolder.trim()) {
        setError('Nombre del titular es requerido');
        return;
      }
      if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
        setError('Fecha de vencimiento inválida (formato: MM/YY)');
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('CVV inválido');
        return;
      }
    } else if (paymentMethod === 'transferencia') {
      if (!transferConfirmed) {
        setError('⚠️ Debes confirmar que realizaste la transferencia');
        return;
      }
    }

    try {
      setLoading(true);
      
      const orderRef = doc(db, 'pedidos', orderId);
      const updateData = {
        metodoPago: paymentMethod,
        ...(paymentMethod === 'transferencia' && {
          estadoPago: 'Transferencia pendiente de validación',
          estado: 'En proceso'
        }),
        ...(paymentMethod !== 'pago_vivienda' && paymentMethod !== 'transferencia' && {
          ultimos4Digitos: cardNumber.slice(-4),
          titular: cardHolder
        })
      };
      
      await updateDoc(orderRef, updateData);
      
      setSuccess('✓ Método de pago guardado exitosamente');
      setTimeout(() => {
        navigate(`/confirmacion/${orderId}`);
      }, 1500);
    } catch (err) {
      setError('Error al procesar el pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

    try {
      setLoading(true);
      

      const orderRef = doc(db, 'pedidos', orderId);
      await updateDoc(orderRef, {
        metodoPago: paymentMethod,
        ...(paymentMethod !== 'pago_vivienda' && {
          ultimos4Digitos: cardNumber.slice(-4),
          titular: cardHolder
        })
      });

      setSuccess('Método de pago guardado exitosamente');
      setTimeout(() => {
        navigate(`/confirmacion/${orderId}`);
      }, 1500);
    } catch (err) {
      setError('Error al procesar el pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      <h2 style={{ color: '#2E8B57', marginBottom: '30px' }}>Seleccionar Método de Pago</h2>

      {/* Resumen del Pedido */}
      <div style={{
        background: '#f7f7f7',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Resumen del Pedido</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Subtotal:</span>
          <span>${(order.subtotal || order.total).toLocaleString('es-CL')}</span>
        </div>
        {order.descuento > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'green' }}>
            <span>Descuento:</span>
            <span>-${order.descuento.toLocaleString('es-CL')}</span>
          </div>
        )}
        {order.costoEnvio > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Costo de Envío:</span>
            <span>${order.costoEnvio.toLocaleString('es-CL')}</span>
          </div>
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '18px',
          fontWeight: 'bold',
          borderTop: '1px solid #ddd',
          paddingTop: '10px',
          color: '#2E8B57'
        }}>
          <span>Total:</span>
          <span>${order.total.toLocaleString('es-CL')}</span>
        </div>
      </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            border: paymentMethod === 'transferencia' ? '2px solid #2E8B57' : '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            background: paymentMethod === 'transferencia' ? '#f0f8f5' : 'white',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="radio"
              name="paymentMethod"
              value="transferencia"
              checked={paymentMethod === 'transferencia'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            <div>
              <strong>🏦 Transferencia Bancaria</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Transfiere a nuestra cuenta y confirma
              </div>
            </div>
          </label>
        </div>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#e8f5e9',
          color: '#2e7d32',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #66bb6a'
        }}>
          ✓ {success}
        </div>
      )}

      {/* Formulario de Pago */}
      <form onSubmit={handlePaymentSubmit}>
        {/* Opción: Pago en Vivienda */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            border: paymentMethod === 'pago_vivienda' ? '2px solid #2E8B57' : '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            background: paymentMethod === 'pago_vivienda' ? '#f0f8f5' : 'white',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="radio"
              name="paymentMethod"
              value="pago_vivienda"
              checked={paymentMethod === 'pago_vivienda'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            <div>
              <strong>💰 Pago en la Vivienda</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Paga contra entrega en tu domicilio
              </div>
              {order.total > 50000 && (
                <div style={{ fontSize: '12px', color: '#c62828' }}>
                  No disponible para pedidos mayores a $50.000
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Opción: Débito */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            border: paymentMethod === 'debito' ? '2px solid #2E8B57' : '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            background: paymentMethod === 'debito' ? '#f0f8f5' : 'white',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="radio"
              name="paymentMethod"
              value="debito"
              checked={paymentMethod === 'debito'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            <div>
              <strong>🏧 Tarjeta de Débito</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Débito inmediato desde tu cuenta
              </div>
            </div>
          </label>
        </div>

        {/* Opción: Crédito */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            border: paymentMethod === 'credito' ? '2px solid #2E8B57' : '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            background: paymentMethod === 'credito' ? '#f0f8f5' : 'white',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="radio"
              name="paymentMethod"
              value="credito"
              checked={paymentMethod === 'credito'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            <div>
              <strong>💳 Tarjeta de Crédito</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Pago diferido con tu tarjeta
              </div>
            </div>
          </label>
        </div>

        {/* Detalles de Tarjeta (si está seleccionado débito o crédito) */}
        {(paymentMethod === 'debito' || paymentMethod === 'credito') && (
          <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ marginTop: 0, color: '#2E8B57' }}>Datos de la Tarjeta</h4>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Número de Tarjeta
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength="23"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nombre del Titular
              </label>
              <input
                type="text"
                placeholder="JUAN PÉREZ"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Fecha (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="12/25"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength="5"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
                            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: '#fff',
              color: '#2E8B57',
              border: '2px solid #2E8B57',
              borderRadius: '8px',
              fontSize: '16px',
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
            ← Volver al Carrito
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: loading ? '#ccc' : '#2E8B57',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.background = '#1e6a41';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.background = '#2E8B57';
            }}
          >
            {loading ? 'Procesando...' : '✓ Confirmar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPayment;