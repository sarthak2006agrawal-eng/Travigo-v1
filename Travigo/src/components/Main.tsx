import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import LowPolyEarth from './LowPolyEarth'; // Make sure this path is correct

function Main() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div>
        <p className='text-[68px] text-center z-index-2 ' >ON THE GO</p>
      </div>
      {/* Three.js Background with Low Poly Earth Model */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          {/* Lights */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 3, 5]} intensity={1} />
          <directionalLight position={[-5, -3, -5]} intensity={0.4} />

          {/* Suspense ensures model loads without crashing */}
          <Suspense fallback={null}>
            <LowPolyEarth />
          </Suspense>
        </Canvas>
      </div>

      {/* Other content goes here */}
    </div>
  );
}

export default Main;
