import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage } from '@react-three/drei';
import * as THREE from 'three';

// This component loads and renders your .glb model and animates the wheels.
function BusModel({ modelUrl, scale }) {
  const { scene } = useGLTF(modelUrl);
  
  const wheelRefs = useRef({
    frontLeft: null,
    frontRight: null,
    backLeft: null,
    backRight: null,
  });

  useEffect(() => {
    if (scene) {
      // IMPORTANT: Replace the placeholder names below with the
      // four exact 'Object_' names you found in the console in Step 1.
      // For demonstration, I'm using generic names. You should replace these
      // with the actual names from your GLB model.
      wheelRefs.current.frontLeft = scene.getObjectByName('Object_XX'); // Replace Object_XX
      wheelRefs.current.frontRight = scene.getObjectByName('Object_YY'); // Replace Object_YY
      wheelRefs.current.backLeft = scene.getObjectByName('Object_ZZ');   // Replace Object_ZZ
      wheelRefs.current.backRight = scene.getObjectByName('Object_AA');  // Replace Object_AA
    }
  }, [scene]);

  // Animate the wheels on every frame.
  useFrame(() => {
    const rotationSpeed = 0.05;
    
    // Check if the wheels exist before trying to rotate them.
    if (wheelRefs.current.frontLeft && wheelRefs.current.frontRight && wheelRefs.current.backLeft && wheelRefs.current.backRight) {
      // The most common axis for wheel rotation is .x, but it could also be .y or .z.
      // If the wheels don't move, try changing all of these to .y or .z
      wheelRefs.current.frontLeft.rotation.x += rotationSpeed;
      wheelRefs.current.frontRight.rotation.x += rotationSpeed;
      wheelRefs.current.backLeft.rotation.x += rotationSpeed;
      wheelRefs.current.backRight.rotation.x += rotationSpeed;
    }
  });

  // Adjusted the first value (X-axis rotation) to slightly tilt the bus backward.
  // This will make the contact shadow appear "tilted to top little bit from the back side."
  // The rotation has been updated to [0.14, -0.85, -0.0] as requested.
  return <primitive object={scene} scale={scale} rotation={[0.14, -0.85, -0.0]} />;
}

// This component sets up the 3D canvas and environment.
export function BusModelCanvas({ modelUrl, scale }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 18], fov: 55 }} style={{ pointerEvents: 'none' }}>
      <Stage
        environment="city"
        intensity={0.7}
        shadows={{ type: 'contact', color: new THREE.Color(0x000000), opacity: 0.9 }}
      >
        <BusModel modelUrl={modelUrl} scale={scale} />
      </Stage>
    </Canvas>
  );
}

// Pre-loading the model is crucial for performance.
useGLTF.preload("/white-bus.glb");
