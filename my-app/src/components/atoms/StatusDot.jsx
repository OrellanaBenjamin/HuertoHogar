import React from "react";

const StatusDot = ({ color = "#4CAF50", size = 10, style = {} }) => {
  return (
    <span style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      marginRight: 6,
      ...style
    }} />
  );
};

export default StatusDot;
