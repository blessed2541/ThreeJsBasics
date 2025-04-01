// src/ThreeScene.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
// Import the GLTFLoader addon
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ThreeSceneImport = () => {
  const mountRef = useRef(null);

  // useEffect runs after the component mounts and handles setup/cleanup
  useEffect(() => {
    // Get the mount point (the div returned by the component)
    const currentMount = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentMount;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc); // Gray background

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      50, // Field of View
      width / height, // Aspect Ratio
      0.1, // Near clipping plane
      10000 // Far clipping plane (increased for larger model)
    );
    // Initial camera position - Adjust these values to get a good starting view!
    camera.position.set(-1000, 1500, 1500);
    camera.lookAt(scene.position); // Look at the center of the scene (0,0,0)

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialiasing on
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    currentMount.appendChild(renderer.domElement); // Add canvas to the mount div

    // 4. OrbitControls Setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable smooth damping effect
    controls.dampingFactor = 0.05; // Damping inertia
    // Optional: Configure limits if needed
    // controls.minDistance = 5;
    // controls.maxDistance = 150; // Example max zoom out

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Stronger directional light
    directionalLight.position.set(30, 50, 20); // Position light source
    directionalLight.castShadow = true; // Enable shadow casting
    // Configure shadow properties (adjust based on scene size)
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100; // Adjust far plane for shadow camera
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    // Optional helpers for debugging light/shadow:
    // const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dirLightHelper);
    // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(shadowHelper);

    // 6. Model Loading Setup
    const loader = new GLTFLoader();
    loader.load(
      // Corrected path relative to the 'public' folder
      "/models/small_city/small_city.gltf",
      // onLoad callback: Executed when model loads successfully
      (gltf) => {
        console.log("Model loaded successfully:", gltf);
        const model = gltf.scene;

        // Adjust model scale/position if needed
        model.scale.set(1.0, 1.0, 1.0);
        model.position.set(0, 0, 0); // Place model at the origin

        // Enable shadows for all meshes within the loaded model
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        scene.add(model); // Add the model to the main scene
        console.log("Model added to scene.");

        // Optional: Set OrbitControls target after model loads
        // const box = new THREE.Box3().setFromObject(model);
        // const center = box.getCenter(new THREE.Vector3());
        // controls.target.copy(center); // Make controls orbit around model center
        // controls.update(); // IMPORTANT: Update controls after changing target
      },
      // onProgress callback: Executed during loading
      (xhr) => {
        const percentLoaded = (xhr.loaded / xhr.total) * 100;
        console.log(`Model loading: ${percentLoaded.toFixed(2)}%`);
      },
      // onError callback: Executed if loading fails
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // 7. Resize Handling Setup
    const handleResize = () => {
      const { clientWidth: newWidth, clientHeight: newHeight } = currentMount;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop Setup
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // Queue next frame
      controls.update(); // IMPORTANT: Update controls each frame (needed for damping)
      renderer.render(scene, camera); // Render the scene
    };
    animate(); // Start the animation loop

    // 9. Cleanup Function (runs when component unmounts)
    return () => {
      cancelAnimationFrame(animationFrameId); // Stop animation loop
      window.removeEventListener("resize", handleResize); // Remove resize listener
      controls.dispose(); // Dispose orbit controls (removes listeners)

      // Remove renderer canvas from DOM
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      renderer.dispose(); // Dispose renderer resources

      // You might need more complex cleanup for the loaded model's
      // geometries, materials, and textures if you frequently load/unload models
      // to prevent memory leaks, but start without it for simplicity.

      console.log("ThreeScene cleanup complete.");
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount/unmount

  // The mount point div remains the same
  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default ThreeSceneImport;
