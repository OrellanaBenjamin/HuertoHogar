import React from "react";

const Badge = ({ children, variant = "default", style = {} }) => {
  const variants = {
    default: { background: "#e0e0e0", color: "#333" },
    success: { background: "#d4edda", color: "#155724" },
    warning: { background: "#fff3cd", color: "#856404" },
    danger: { background: "#f8d7da", color: "#721c24" },
    info: { background: "#d1ecf1", color: "#0c5460" },
    primary: { background: "#cfe2ff", color: "#084298" }
  };

  return (
    <span style={{
      ...variants[variant],
      padding: "4px 10px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: "bold",
      display: "inline-block",
      ...style
    }}>
      {children}
    </span>
  );
};

export default Badge;
