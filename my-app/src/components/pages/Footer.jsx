import React from "react";

const Footer = () => (
  <footer style={{
    background: "#2E8B57",
    color: "#fff",
    padding: "24px 0",
    textAlign: "center",
    width: "100%",
    borderTop: "1px solid #e9e9e9"
  }}>
    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16 }}>
      © 2025 HuertoHogar · Hecho en Chile · <a href="mailto:consultas@huertohogar.cl" style={{ color: "#FFD700" }}>Contacto</a>
    </div>
    <div style={{ marginTop: 6 }}>
      <a href="https://facebook.com/huertohogar" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", marginRight: 10 }}>Facebook</a>
      <a href="https://instagram.com/huertohogar" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", marginRight: 10 }}>Instagram</a>
      <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700" }}>WhatsApp</a>
    </div>
  </footer>
);

export default Footer;
