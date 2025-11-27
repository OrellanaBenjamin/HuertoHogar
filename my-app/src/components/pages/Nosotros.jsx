import React from "react";

const Nosotros = () => (
  <div style={{
    minHeight: "100vh", 
    padding: "38px 0"
  }}>
    <div style={{
      background: "#fff9eeeb", maxWidth: 950, margin: "auto",
      borderRadius: 16, boxShadow: "0 5px 28px #ccb", padding: 36
    }}>
      <h2 style={{
        color: "#8B4513", fontFamily: 'Playfair Display, serif', marginBottom: "7px"
      }}>
        Sobre Nosotros
      </h2>
      <div style={{
        color: "#333", maxWidth: 700, fontSize: 17, marginBottom: 26, lineHeight: "1.7"
      }}>
        <p>
          <strong>HuertoHogar</strong> es una tienda online dedicada a acercar productos frescos, saludables y sostenibles directamente desde el campo a tu mesa.
        </p>
        <ul>
          <li>Apoyamos a productores rurales y fomentamos la agricultura local responsable.</li>
          <li>Promovemos prácticas sustentables, con envases reciclables y transporte eficiente para reducir la huella de carbono.</li>
          <li>Creemos en un comercio justo y en el impacto social: parte de las compras apoya talleres, cursos y donaciones comunitarias.</li>
        </ul>
        <p>
          Nuestro equipo está comprometido con alimentarte mejor y conectar al país con una cadena más corta y humana.
        </p>
        <p>
          ¿Quieres formar parte de la comunidad? Escríbenos a <a href="mailto:juntos@huertohogar.cl">juntos@huertohogar.cl</a>
        </p>
      </div>
      <h3 style={{ marginTop: 30, color: "#2E8B57" }}>Nuestras tiendas</h3>
      <p>
        Estamos presentes en Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar,
        Valparaíso y Concepción.
      </p>
      <iframe
        title="Mapa HuertoHogar Santiago"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13330.857222!2d-70.64827!3d-33.45694!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59b3c0c0001%3A0x123456789abcdef!2sSantiago%20de%20Chile!5e0!3m2!1ses!2scl!4v1700000000000"
        width="100%"
        height="320"
        style={{ border: 0, borderRadius: 15 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <h4 style={{ color: "#8B4513", marginTop: 32 }}>Sucursales de atención</h4>
      <ul style={{
        fontSize: 15, color: "#6a5027",
        marginTop: 18, paddingLeft: 18
      }}>
        <li><b>Santiago:</b> Av. Providencia 1234, Providencia | Tel: +56 9 1234 5678</li>
        <li><b>Concepción:</b> Barros Arana 789 | Tel: +56 41 245 1111</li>
      </ul>
      <div style={{
        marginTop: 28,
        background: "#F3F7F0",
        padding: "16px 18px",
        borderRadius: 10,
        fontSize: 16,
        color: "#4c622a"
      }}>
        Sucursal virtual: Atención en todo Chile · Plataforma segura · Comunidad agrícola nacional   
      </div>
    </div>
  </div>
);

export default Nosotros;
