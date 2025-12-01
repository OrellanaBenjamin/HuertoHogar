import React from "react";

const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false, 
  type = "button", 
  style = {} 
}) => {
  const variants = {
    primary: { background: "#2E8B57", color: "#fff" },
    secondary: { background: "#f0f0f0", color: "#333" },
    danger: { background: "#f44336", color: "#fff" },
    success: { background: "#4CAF50", color: "#fff" },
    warning: { background: "#FF9800", color: "#fff" },
    info: { background: "#2196F3", color: "#fff" }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        border: "none",
        borderRadius: 8,
        padding: "10px 20px",
        fontWeight: "bold",
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontFamily: "Montserrat, sans-serif",
        transition: "all 0.3s ease",
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default Button;
