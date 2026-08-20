import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 220;

export default function FireEffect({ activeRef, originRef, directionRef }) {
  const pointsRef = useRef(null);

  const { positions, colors, velocities, life } = useMemo(() => {
    const positionsArray = new Float32Array(PARTICLE_COUNT * 3);
    const colorsArray = new Float32Array(PARTICLE_COUNT * 3);
    const velocitiesArray = new Float32Array(PARTICLE_COUNT * 3);
    const lifeArray = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      positionsArray[i * 3] = 999;
      positionsArray[i * 3 + 1] = 999;
      positionsArray[i * 3 + 2] = 999;
      colorsArray[i * 3] = 1;
      colorsArray[i * 3 + 1] = 0.5;
      colorsArray[i * 3 + 2] = 0.1;
      lifeArray[i] = 0;
    }

    return {
      positions: positionsArray,
      colors: colorsArray,
      velocities: velocitiesArray,
      life: lifeArray,
    };
  }, []);

  const tempDir = useMemo(() => new THREE.Vector3(), []);
  const tempSpread = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const origin = originRef.current;
    const direction = directionRef.current;
    const shouldEmit = activeRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      life[i] -= delta;

      if (life[i] <= 0) {
        if (!shouldEmit) continue;

        const spread = 0.22;
        tempDir
          .copy(direction)
          .add(
            tempSpread.set(
              (Math.random() - 0.5) * spread,
              (Math.random() - 0.5) * spread * 0.6,
              (Math.random() - 0.5) * spread
            )
          )
          .normalize();

        positions[i3] = origin.x;
        positions[i3 + 1] = origin.y;
        positions[i3 + 2] = origin.z;

        const speed = 6.8 + Math.random() * 2.8;
        velocities[i3] = tempDir.x * speed;
        velocities[i3 + 1] = tempDir.y * speed + 0.35;
        velocities[i3 + 2] = tempDir.z * speed;

        colors[i3] = 1.0;
        colors[i3 + 1] = 0.55 + Math.random() * 0.2;
        colors[i3 + 2] = 0.08;

        life[i] = 0.55 + Math.random() * 0.45;
        continue;
      }

      positions[i3] += velocities[i3] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;

      // Fire slows and rises while fading from orange to dim ember.
      velocities[i3] *= 0.97;
      velocities[i3 + 1] += 0.22 * delta;
      velocities[i3 + 2] *= 0.97;

      const fade = Math.max(0, life[i] / 1.0);
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.2 + 0.7 * fade;
      colors[i3 + 2] = 0.04 + 0.2 * (1 - fade);
    }

    const geometry = pointsRef.current.geometry;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={PARTICLE_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={PARTICLE_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.88}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
