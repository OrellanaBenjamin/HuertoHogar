import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => (
  <nav style={{ width: "100%", background: "#2E8B57", padding: "15px 0", marginBottom: 18 }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
      <div style={{ fontWeight: "bold", fontSize: 22, letterSpacing: 1 }}>
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/">HuertoHogar</Link>
      </div>
      <div style={{ display: "flex", gap: 32, fontSize: 18 }}>
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/">Inicio</Link>
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/catalogo">Catálogo</Link>
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/cart">Carrito</Link>

        {user ? (
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/perfil">
            Perfil
          </Link>
        ) : (
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/auth">
            Iniciar sesión
          </Link>
        )}

        <Link style={{ color: "#fff", textDecoration: "none" }} to="/blog">Blog</Link>
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/nosotros">Nosotros</Link>
        <Link style={{ color: "#fff", textDecoration: "none" }} to="/condiciones">Condiciones</Link>
      </div>
      <div>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", marginRight: 15 }}>Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", marginRight: 15 }}>Instagram</a>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700" }}>WhatsApp</a>
      </div>
    </div>
  </nav>
);

export default Navbar;

