// src/ThreeSceneR3F.jsx (or replace content of ThreeSceneImport.jsx)
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Text,
} from "@react-three/drei";
import * as THREE from "three"; // Still needed for things like THREE.Color if used explicitly

// Import your interactive box component
import InteractiveBox from "./InteractiveBox";

// Helper component to handle GLTF model loading and setup
function Model(props) {
  // useGLTF loads the model. It uses React Suspense, so we need <Suspense> around it.
  // Make sure the path matches exactly where your model file is served from.
  // Use the path that worked previously in loader.load().
  const { scene } = useGLTF("/models/small_city/small_city.gltf"); // <-- ADJUST PATH IF NEEDED

  // useEffect to traverse the model and enable shadows once it's loaded
  useEffect(() => {
    if (scene) {
      scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
    }
  }, [scene]); // Re-run if the scene object changes

  // <primitive> renders the loaded Three.js Object3D (the scene)
  // Pass position, scale etc. as props if needed
  return <primitive object={scene} {...props} />;
}

// Helper component to update OrbitControls if damping is enabled
function ControlsUpdater() {
  const { controls } = useThree();
  useFrame(() => {
    // controls?.update() is important for damping to work smoothly
    if (controls?.enabled) {
      controls.update();
    }
  });
  return null; // This component doesn't render anything itself
}

// Main component using R3F
function ThreeSceneR3F() {
  // Define initial camera position (adjust as needed)
  const initialCameraPosition = [-1000, 1500, 1500];
  // Define position for the interactive box (adjust as needed)
  const boxPosition = [100, 500, 100]; // Example position

  return (
    // The div container remains the same
    <div style={{ width: "100%", height: "100%", display: "block" }}>
      {/* Canvas sets up the R3F scene */}
      <Canvas
        shadows // Enable shadows globally for the renderer
        // Optional: Set camera properties directly here if not using PerspectiveCamera component below
        // camera={{ position: initialCameraPosition, fov: 50, near: 0.1, far: 10000 }}
      >
        {/* Set background color */}
        <color attach="background" args={["#cccccc"]} />

        {/* Use Drei's PerspectiveCamera component */}
        {/* 'makeDefault' makes it the primary camera R3F uses */}
        <PerspectiveCamera
          makeDefault
          fov={50}
          near={0.1}
          far={10000} // Use the increased far plane
          position={initialCameraPosition}
        />

        {/* Use Drei's OrbitControls component */}
        <OrbitControls
          enableDamping // Enable smooth damping
          dampingFactor={0.05}
          // Optional limits:
          // minDistance={5}
          // maxDistance={3000} // Adjust max zoom based on camera distance
        />

        {/* Lights */}
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[30, 50, 20]} // Same position as before
          intensity={2.0}
          castShadow
          // Shadow properties translated to dash-case attributes
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={100} // Adjust if needed
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />

        {/* Suspense is needed for useGLTF while the model is loading */}
        <Suspense fallback={null}>
          {/* Render the Model component */}
          <Model scale={1.0} position={[0, 0, 0]} />
        </Suspense>

        {/* Render your Interactive Box! */}
        <InteractiveBox position={boxPosition} />

        {/* Add the helper to update controls for damping */}
        <ControlsUpdater />
      </Canvas>
    </div>
  );
}

// Export the R3F version
export default ThreeSceneR3F;
