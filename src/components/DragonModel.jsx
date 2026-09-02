import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import FireEffect from './FireEffect';

// For production, keep this model local at /public/models/dragon.glb and optimize with gltf-transform.
const DRAGON_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb';

export default function DragonModel({ mouse }) {
  const groupRef = useRef(null);

  // Replace with `/models/dragon.glb` when you add your optimized local model.
  const gltf = useGLTF(DRAGON_MODEL_URL);
  const { scene, animations } = gltf;
  const { actions, mixer, names } = useAnimations(animations, groupRef);

  const headBoneRef = useRef(null);
  const wingLeft = useRef([]);
  const wingRight = useRef([]);
  const hasWingAnimRef = useRef(false);

  const hoverRef = useRef(false);
  const burstTimerRef = useRef(0);
  const breathingRef = useRef(false);

  const fireOriginRef = useRef(new THREE.Vector3());
  const fireDirectionRef = useRef(new THREE.Vector3(0, 0, 1));

  const tmpVecA = useMemo(() => new THREE.Vector3(), []);
  const tmpVecB = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpVecC = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.metalness = Math.min(1, (obj.material.metalness || 0) + 0.12);
          obj.material.roughness = Math.max(0.16, (obj.material.roughness || 0.55) - 0.12);
          if (obj.material.color) obj.material.color.offsetHSL(0.04, 0.08, 0.05);
        }
      }

      if (!obj.name) return;
      const n = obj.name.toLowerCase();

      if (!headBoneRef.current && (n.includes('head') || n.includes('neck') || n.includes('jaw'))) {
        headBoneRef.current = obj;
      }

      if (n.includes('wing') || n.includes('arm')) {
        if (n.includes('left') || n.includes('.l') || n.endsWith('_l')) wingLeft.current.push(obj);
        if (n.includes('right') || n.includes('.r') || n.endsWith('_r')) wingRight.current.push(obj);
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!actions || !names?.length) return;

    const preferred = names.find((n) => /fly|flap|idle|anim/i.test(n)) || names[0];
    const action = actions[preferred];
    if (action) {
      action.reset().fadeIn(0.4).play();
      hasWingAnimRef.current = /wing|flap|fly/i.test(preferred);
    }

    return () => {
      if (action) action.fadeOut(0.3);
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (mixer) mixer.update(delta);

    // Game-style sequence timeline:
    // 0-4s: fly in from distance
    // 4-12s: orbit around hero title center
    // 12-15s: glide pass
    // 15-17s: short landing hover
    // 17s+: continue loop with orbit and pass
    let x = 0;
    let y = 1;
    let z = 0;
    let yaw = 0;
    const titleCenter = tmpVecA.set(0, 1.15, 0);

    if (t < 4) {
      const p = t / 4;
      x = THREE.MathUtils.lerp(-14, 4.2, p);
      y = THREE.MathUtils.lerp(7.5, 2.1, p) + Math.sin(t * 3.5) * 0.2;
      z = THREE.MathUtils.lerp(-18, 4.1, p);
      yaw = THREE.MathUtils.lerp(-0.65, -0.1, p);
    } else {
      const loop = (t - 4) % 13;

      if (loop < 8) {
        const p = loop / 8;
        const angle = p * Math.PI * 2;
        const rx = 5.6;
        const rz = 3.6;

        x = titleCenter.x + Math.cos(angle) * rx;
        y = titleCenter.y + Math.sin(t * 2.2) * 0.45 + Math.sin(angle * 1.2) * 0.18;
        z = titleCenter.z + Math.sin(angle) * rz;
        yaw = -angle + Math.PI * 0.5;
      } else if (loop < 11) {
        const p = (loop - 8) / 3;
        x = THREE.MathUtils.lerp(-12, 11, p);
        y = 1.05 + Math.sin(p * Math.PI) * 1.4 + Math.sin(t * 3.1) * 0.12;
        z = THREE.MathUtils.lerp(2.8, -3.8, p);
        yaw = -Math.PI * 0.5 + Math.sin(p * Math.PI) * 0.35;
      } else {
        const p = (loop - 11) / 2;
        x = THREE.MathUtils.lerp(2.1, 0.8, p);
        y = THREE.MathUtils.lerp(0.8, 0.35, p) + Math.sin(t * 5.5) * 0.04;
        z = THREE.MathUtils.lerp(1.6, 0.6, p);
        yaw = THREE.MathUtils.lerp(Math.PI * 0.08, 0, p);
      }
    }

    // Mouse influence: dragon tracks cursor subtly.
    x += mouse.current.x * 0.95;
    y += mouse.current.y * 0.55;

    groupRef.current.position.lerp(tmpVecB.set(x, y, z), 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, yaw, 0.09);
    groupRef.current.rotation.z = Math.sin(t * 2.5) * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 3.1) * 0.05;

    if (!hasWingAnimRef.current) {
      const flap = Math.sin(t * 9.6) * 0.34;
      wingLeft.current.forEach((bone) => {
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, flap, 0.2);
      });
      wingRight.current.forEach((bone) => {
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, -flap, 0.2);
      });
    }

    // Head tracking toward cursor for extra interaction.
    if (headBoneRef.current) {
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, mouse.current.x * 0.24, 0.1);
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, -mouse.current.y * 0.18, 0.1);
    }

    // Fire origin and direction are derived from head transform.
    burstTimerRef.current = Math.max(0, burstTimerRef.current - delta);
    breathingRef.current = hoverRef.current || burstTimerRef.current > 0;

    if (headBoneRef.current) {
      headBoneRef.current.getWorldPosition(fireOriginRef.current);
      headBoneRef.current.getWorldQuaternion(tmpQuat);
      fireDirectionRef.current.set(0, 0.12, 1).applyQuaternion(tmpQuat).normalize();
      fireOriginRef.current.add(tmpVecC.copy(fireDirectionRef.current).multiplyScalar(0.55));
    } else {
      groupRef.current.getWorldPosition(fireOriginRef.current);
      fireOriginRef.current.y += 0.4;
      fireDirectionRef.current.set(0, 0.08, 1).normalize();
    }
  });

  return (
    <group ref={groupRef} scale={2.1}>
      <primitive
        object={scene}
        onPointerOver={() => {
          hoverRef.current = true;
        }}
        onPointerOut={() => {
          hoverRef.current = false;
        }}
        onClick={() => {
          burstTimerRef.current = 1.2;
        }}
      />

      <FireEffect activeRef={breathingRef} originRef={fireOriginRef} directionRef={fireDirectionRef} />
    </group>
  );
}

useGLTF.preload(DRAGON_MODEL_URL);
