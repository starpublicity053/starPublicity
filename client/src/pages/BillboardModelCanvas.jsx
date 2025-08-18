import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// === Top-Level Preload ===
// Preload the GLB model (adjust path if needed)
useGLTF.preload("/FC-Billboards.glb");

// === Model Loader Component ===
const BillboardModel = ({ modelUrl, scale = 1 }) => {
  const { scene } = useGLTF(modelUrl);

  // Optional material setup
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.side = THREE.DoubleSide;
      }
    }
  });

  return <primitive object={scene} scale={scale} />;
};

// === Canvas Wrapper ===
export const BillboardModelCanvas = ({ modelUrl, scale }) => {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 45 }}
      shadows
      gl={{ antialias: true }}
    >
      {/* Lights */}
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Optional ground shadow plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Model */}
      <Suspense fallback={null}>
        <BillboardModel modelUrl={modelUrl} scale={scale} />
      </Suspense>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};
