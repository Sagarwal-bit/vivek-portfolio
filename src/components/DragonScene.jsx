import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import DragonModel from './DragonModel';
import Particles from './Particles';

function CameraRig({ mouse }) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const targetX = Math.sin(t * 0.2) * 0.35 + mouse.current.x * 0.45;
    const targetY = 1.35 + Math.sin(t * 0.17) * 0.16 + mouse.current.y * 0.24;
    const targetZ = 10.2 - mouse.current.y * 0.18;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.045);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.045);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.045);
    camera.lookAt(0, 1.1, 0);
  });

  return null;
}

function SceneFallback() {
  return (
    <Html center>
      <div className="dragon-loading">Summoning Dragon...</div>
    </Html>
  );
}

export default function DragonScene({ mouse }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.3, 10.2], fov: 50, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#090d1a']} />
      <fog attach="fog" args={['#0b1222', 10, 42]} />

      <ambientLight intensity={0.58} color="#8fa8d9" />
      <hemisphereLight intensity={0.62} color="#7aa6ff" groundColor="#211307" />

      <directionalLight
        castShadow
        intensity={1.9}
        color="#ffd9a1"
        position={[6, 8, 7]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      <directionalLight intensity={1.15} color="#72b2ff" position={[-9, 5, -8]} />

      {/* Shadow receiver so dragon cast shadow is visible. */}
      <mesh rotation-x={-Math.PI * 0.5} position-y={-2.3} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <shadowMaterial opacity={0.28} />
      </mesh>

      <Particles />

      <Suspense fallback={<SceneFallback />}>
        <DragonModel mouse={mouse} />
      </Suspense>

      <CameraRig mouse={mouse} />
    </Canvas>
  );
}
