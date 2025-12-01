import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();
  
  const links = [
    { path: "/admin/orders", label: "📦 Pedidos", icon: "📦" },
    { path: "/admin/catalog", label: "🛒 Catálogo", icon: "🛒" },
    { path: "/admin/reviews", label: "⭐ Reseñas", icon: "⭐" },
    { path: "/admin/reports", label: "📊 Reportes", icon: "📊" }
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, #2E8B57 0%, #1a5f3a 100%)",
      padding: "15px 0",
      marginBottom: 30,
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              textDecoration: "none",
              background: location.pathname === link.path ? "#fff" : "rgba(255,255,255,0.2)",
              color: location.pathname === link.path ? "#2E8B57" : "#fff",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 14,
              transition: "all 0.3s ease",
              border: location.pathname === link.path ? "2px solid #2E8B57" : "2px solid transparent"
            }}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminNavbar;
