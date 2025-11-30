export function generateReceiptHTML(orden, productos, usuario, tipoEntrega) {
  const items = orden.items || [];
  const detallesItems = items.map(item => {
    const prod = productos.find(p => p.id === item.id);
    if (!prod) return null;
    return {
      ...item,
      nombre: prod.name,
      precioUnitario: prod.precio
    };
  }).filter(Boolean);

  const subtotal = detallesItems.reduce((acc, item) => acc + (item.precioUnitario * item.qty), 0);
  const descuento = orden.descuento || 0;
  const total = orden.total || (subtotal - descuento);
  const fecha = new Date(orden.fecha).toLocaleDateString('es-CL');
  const hora = new Date(orden.fecha).toLocaleTimeString('es-CL');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Boleta - HuertoHogar #${orden.id.slice(0, 8)}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Montserrat', sans-serif;
          background: #f7f7f7;
          padding: 20px;
          line-height: 1.6;
        }
        .receipt {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2E8B57;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #2E8B57;
          font-size: 28px;
          font-family: 'Playfair Display', serif;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 12px;
        }
        .info-section {
          margin-bottom: 20px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 5px;
        }
        .info-section h3 {
          color: #2E8B57;
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 4px;
          color: #333;
        }
        .info-row strong {
          color: #2E8B57;
        }
        table {
          width: 100%;
          margin: 20px 0;
          border-collapse: collapse;
          font-size: 13px;
        }
        table thead {
          background: #2E8B57;
          color: white;
        }
        table th {
          padding: 10px;
          text-align: left;
          font-weight: bold;
        }
        table td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        table tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        .totals {
          margin: 20px 0;
          padding: 15px;
          background: #f3f7f0;
          border-left: 4px solid #2E8B57;
          border-radius: 5px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .total-row.final {
          font-size: 18px;
          font-weight: bold;
          color: #2E8B57;
          border-top: 1px solid #ddd;
          padding-top: 8px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          font-size: 11px;
          color: #999;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        .delivery-info {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
          font-size: 13px;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: center;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-print {
          background: #2E8B57;
          color: white;
        }
        .btn-close {
          background: #ccc;
          color: #333;
        }
        @media print {
          body { background: white; }
          .receipt { box-shadow: none; }
          .button-group { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>🌾 HuertoHogar</h1>
          <p>Tienda Online de Productos Frescos</p>
          <p>RUT: 76.123.456-7</p>
          <p>Teléfono: +56 2 1234 5678</p>
        </div>

        <div class="info-section">
          <h3>Datos de la Boleta</h3>
          <div class="info-row">
            <strong>Número:</strong>
            <span>#${orden.id.slice(0, 8)}</span>
          </div>
          <div class="info-row">
            <strong>Fecha:</strong>
            <span>${fecha} ${hora}</span>
          </div>
          <div class="info-row">
            <strong>Estado:</strong>
            <span>${orden.estado || 'Solicitado'}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Cliente</h3>
          <div class="info-row">
            <strong>Nombre:</strong>
            <span>${usuario?.name || 'No registrado'}</span>
          </div>
          <div class="info-row">
            <strong>RUN:</strong>
            <span>${usuario?.run || 'N/A'}</span>
          </div>
          <div class="info-row">
            <strong>Email:</strong>
            <span>${usuario?.email || 'N/A'}</span>
          </div>
          <div class="info-row">
            <strong>Teléfono:</strong>
            <span>${usuario?.telefono || 'No proporcionado'}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Dirección de Entrega</h3>
          <div class="info-row">
            <strong>Dirección:</strong>
            <span>${usuario?.direccion || 'No registrada'}</span>
          </div>
          <div class="info-row">
            <strong>Tipo de Entrega:</strong>
            <span style="background: ${tipoEntrega === 'retiro' ? '#ffe5e5' : '#e5f5ff'}; padding: 2px 6px; border-radius: 3px;">
              ${tipoEntrega === 'retiro' ? '🏪 Retiro en Tienda' : '🚚 Envío a Domicilio'}
            </span>
          </div>
          ${orden.fechaEntregaPreferida ? `
          <div class="info-row">
            <strong>Fecha de Entrega Preferida:</strong>
            <span>${new Date(orden.fechaEntregaPreferida).toLocaleDateString('es-CL')}</span>
          </div>
          ` : ''}
        </div>

        ${tipoEntrega === 'retiro' ? `
        <div class="delivery-info">
          <strong>⏰ Retiro Disponible:</strong> Lunes a Viernes 09:00 - 18:00 hrs | Sábado 10:00 - 14:00 hrs
        </div>
        ` : ''}

        <h3 style="color: #2E8B57; margin-top: 20px; margin-bottom: 10px;">Detalle de Productos</h3>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th style="text-align: center;">Cantidad</th>
              <th style="text-align: right;">P. Unitario</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${detallesItems.map(item => `
            <tr>
              <td>${item.nombre}</td>
              <td style="text-align: center;">${item.qty}</td>
              <td style="text-align: right;">$${item.precioUnitario.toLocaleString('es-CL')}</td>
              <td style="text-align: right;">$${(item.precioUnitario * item.qty).toLocaleString('es-CL')}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toLocaleString('es-CL')}</span>
          </div>
          ${descuento > 0 ? `
          <div class="total-row">
            <span>Descuento:</span>
            <span style="color: #2E8B57; font-weight: bold;">-$${descuento.toLocaleString('es-CL')}</span>
          </div>
          ` : ''}
          <div class="total-row final">
            <span>Total a Pagar:</span>
            <span>$${total.toLocaleString('es-CL')}</span>
          </div>
        </div>

        <div class="footer">
          <p>✓ Gracias por su compra en HuertoHogar</p>
          <p>Conserve esta boleta como comprobante de su transacción</p>
          <p style="margin-top: 10px; font-size: 10px;">Generada: ${new Date().toLocaleString('es-CL')}</p>
        </div>

        <div class="button-group">
          <button class="btn btn-print" onclick="window.print()">🖨️ Imprimir</button>
          <button class="btn btn-close" onclick="window.close()">Cerrar</button>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export function openReceiptWindow(html) {
  const w = window.open('', '', 'width=800,height=600');
  w.document.write(html);
  w.document.close();
  return w;
}
