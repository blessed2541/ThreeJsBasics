import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeScene = () => {
  // useRef will provide a reference to the DOM element where we'll mount the Three.js scene
  const mountRef = useRef(null);

  // useEffect runs after the component mounts. This is where we set up the Three.js scene.
  // The empty dependency array [] means this effect runs once on mount and the cleanup runs on unmount.
  useEffect(() => {
    // Get the current mount point dimensions
    const currentMount = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentMount;

    // --- THREE.JS CODE START ---
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentMount.appendChild(renderer.domElement); // Mount renderer to the ref element

    // Geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Material
    const material = new THREE.MeshStandardMaterial({ color: 0x4287f5 });

    // Mesh
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // Request next frame
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera); // Render the scene
    };
    animate(); // Start animation

    // Resize handler
    const handleResize = () => {
      // Update dimensions based on the mount point's client size
      const { clientWidth: newWidth, clientHeight: newHeight } = currentMount;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- THREE.JS CODE END ---

    // Cleanup function: This runs when the component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId); // Stop animation loop
      window.removeEventListener("resize", handleResize); // Remove resize listener
      currentMount.removeChild(renderer.domElement); // Remove canvas from DOM
      geometry.dispose(); // Dispose geometry
      material.dispose(); // Dispose material
      // Note: No need to explicitly dispose scene, camera, lights in basic cases
      // but necessary for textures or complex resources. Renderer disposal is good practice.
      renderer.dispose(); // Dispose renderer
      console.log("ThreeScene cleanup complete."); // For debugging
    };
  }, []); // Empty dependency array ensures this runs only once on mount/unmount

  // Return a div element that will serve as the mount point for the Three.js renderer
  // Style it to take up space, otherwise width/height might be 0
  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", display: "block" }} // Ensure div has dimensions
    />
  );
};

export default ThreeScene;
