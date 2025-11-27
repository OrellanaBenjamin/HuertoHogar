import React from "react";

const Condiciones = () => (
  <div style={{
    maxWidth: 900, margin: "40px auto", padding: 30,
    background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px #eef",
    fontFamily: "Montserrat, sans-serif"
  }}>
    <h1 style={{ color: "#2E8B57" }}>
      Condiciones Legales y Beneficios - HuertoHogar
    </h1>
    <p>
      Estas condiciones están respaldadas por la Ley 19.496 sobre protección de los derechos de los consumidores, el Código de Comercio, el Código Civil, la Ley de Protección de Datos Personales 19.628, normativas tributarias y otros reglamentos vigentes en Chile.
    </p>
    <h2 style={{ color: "#8B4513" }}>Garantías y derechos del consumidor</h2>
    <ul>
      <li>Retracto: Derecho a arrepentirse hasta 10 días luego de recibido el producto.</li>
      <li>Información transparente: Precios, condiciones y plazos claramente informados antes de pagar.</li>
      <li>Protección de datos personales según Ley 19.628.</li>
      <li>Comprobante y boleta electrónica.</li>
      <li>Resolución de conflictos ante comercio/SERNAC.</li>
    </ul>
    <h2 style={{ color: "#2E8B57" }}>Obligaciones y permisos de la empresa</h2>
    <ul>
      <li>Empresa formalizada con patente comercial.</li>
      <li>RUT y SII: impuestos declarados y pagados.</li>
      <li>Pagos seguros por Webpay, MercadoPago, etc.</li>
    </ul>
    <h2 style={{ color: "#FFD700" }}>Normativas aplicables</h2>
    <ul>
      <li>Ley N° 19.496 – Protección derechos consumidor</li>
      <li>Ley N° 19.628 – Protección de datos personales</li>
      <li>Código Civil y Comercio</li>
      <li>Reglamento de Comercio Electrónico</li>
      <li>Guía oficial SII para emprendedores</li>
    </ul>
    <div style={{ color: "#666", marginTop: 22, fontSize: 15 }}>
      Última actualización legal: octubre 2025
    </div>
  </div>
);

export default Condiciones;
