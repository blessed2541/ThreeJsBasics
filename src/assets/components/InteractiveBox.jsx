import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

function InteractiveBox(props) {
  // State to manage whether the text is visible
  const [showText, setShowText] = useState(false);
  // State for hover effect (optional, but nice for button feel)
  const [isHovered, setIsHovered] = useState(false);

  // Toggle text visibility on click
  const handleClick = (event) => {
    // Optional: stopPropagation prevents click events from bubbling up
    // to OrbitControls if the box is clicked.
    event.stopPropagation();
    setShowText(!showText);
  };

  return (
    <group {...props}>
      <mesh
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          setIsHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[200, 200, 10]} /> {/* Using your large box size */}
        <meshStandardMaterial color={isHovered ? "hotpink" : "red"} />
      </mesh>

      {/* Conditionally render using Drei's Html component */}
      {showText && (
        <Html
          position={[0, 105, 6]} // Position relative to the box center. Adjust Y based on box height (100) + desired offset. Adjust Z slightly in front of the thin box (depth 10 -> Z=5 is surface).
          center // Centers the HTML content div on the attachment point
          className="my-html-label" // Optional class for external CSS
          style={{
            // Apply inline styles for appearance
            pointerEvents: "none", // Prevent HTML blocking mouse interaction with 3D scene
            color: "black",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "14px", // Adjust font size
            whiteSpace: "nowrap", // Prevent text wrapping
          }}
        >
          Hello from the box! {/* Standard HTML/text content */}
        </Html>
      )}
    </group>
  );
}

export default InteractiveBox;
