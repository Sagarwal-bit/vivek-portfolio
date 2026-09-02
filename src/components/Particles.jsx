import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const AMBIENT_PARTICLE_COUNT = 1200;

export default function Particles() {
  const pointsRef = useRef(null);

  const { positions } = useMemo(() => {
    const array = new Float32Array(AMBIENT_PARTICLE_COUNT * 3);
    for (let i = 0; i < AMBIENT_PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      array[i3] = (Math.random() - 0.5) * 95;
      array[i3 + 1] = Math.random() * 34 - 8;
      array[i3 + 2] = (Math.random() - 0.5) * 95;
    }
    return { positions: array };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.015;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={AMBIENT_PARTICLE_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#8fb8ff" size={0.07} transparent opacity={0.68} depthWrite={false} />
    </points>
  );
}
