import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LowPolyEarth() {
  const earthRef = useRef<THREE.Group>(null);

  // Load the model from public folder
  const gltf = useGLTF('/assets/3dModels/scene.gltf') as { scene: THREE.Group };

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <primitive
      ref={earthRef}
      object={gltf.scene}
      position={[0, -1.2, 0]}
      scale={[1, 1, 1]}
    />
  );
}

export default LowPolyEarth;
