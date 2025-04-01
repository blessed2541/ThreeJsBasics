// src/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <h2>Controls</h2>
      <button>Action 1</button>
      <button>Action 2</button>
      <button>Toggle Something</button>
      <button>Reset View</button>
      {/* Add more buttons or controls as needed */}
    </div>
  );
};

export default Sidebar;
