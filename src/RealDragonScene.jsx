import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const DRAGON_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb';

export default function RealDragonScene({ className = 'real-dragon-layer' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1120, 0.04);

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(0, 1.4, 10.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x8fa7d9, 0.58);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffd9a1, 1.9);
    key.position.set(6, 8, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -14;
    key.shadow.camera.right = 14;
    key.shadow.camera.top = 14;
    key.shadow.camera.bottom = -14;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x72b2ff, 1.2);
    rim.position.set(-9, 5, -8);
    scene.add(rim);

    const fill = new THREE.HemisphereLight(0x7da7ff, 0x1e1207, 0.72);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.ShadowMaterial({ opacity: 0.26 })
    );
    ground.rotation.x = -Math.PI * 0.5;
    ground.position.y = -2.3;
    ground.receiveShadow = true;
    scene.add(ground);

    const particleCount = 1800;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 85;
      particlePositions[i3 + 1] = Math.random() * 30 - 7;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 85;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x9cc8ff,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    scene.add(particles);

    const group = new THREE.Group();
    scene.add(group);

    let dragon = null;
    let fallback = null;
    let mixer = null;
    const wingBones = { left: [], right: [] };

    const loader = new GLTFLoader();

    const collectWingBones = root => {
      root.traverse(obj => {
        if (!obj.name) return;
        const name = obj.name.toLowerCase();
        if (!name.includes('wing') && !name.includes('arm')) return;
        if (name.includes('left') || name.includes('.l') || name.endsWith('_l')) wingBones.left.push(obj);
        if (name.includes('right') || name.includes('.r') || name.endsWith('_r')) wingBones.right.push(obj);
      });
    };

    loader.load(
      DRAGON_MODEL_URL,
      gltf => {
        dragon = gltf.scene;
        dragon.scale.setScalar(2.2);
        dragon.rotation.y = Math.PI;
        dragon.traverse(obj => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            const material = obj.material;
            if (material && material.color) {
              material.color.offsetHSL(0.07, 0.1, 0.06);
              material.metalness = Math.min(1, (material.metalness || 0) + 0.2);
              material.roughness = Math.max(0.15, (material.roughness || 0.45) - 0.2);
            }
          }
        });
        collectWingBones(dragon);
        group.add(dragon);

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(dragon);
          gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
          });
        }
      },
      undefined,
      () => {
        const geometry = new THREE.TorusKnotGeometry(1.1, 0.25, 220, 28);
        const material = new THREE.MeshStandardMaterial({
          color: 0xd5a235,
          emissive: 0x3c2104,
          metalness: 0.78,
          roughness: 0.24,
        });
        fallback = new THREE.Mesh(geometry, material);
        fallback.rotation.x = 0.45;
        fallback.castShadow = true;
        fallback.receiveShadow = true;
        group.add(fallback);
      }
    );

    let raf = 0;
    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onPointerMove = event => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const titleCenter = new THREE.Vector3(0, 1.1, 0);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      const cycle = 14.0;
      const phase = (t % cycle) / cycle;

      let x;
      let y;
      let z;
      let yaw;

      if (phase < 0.68) {
        const orbitT = phase / 0.68;
        const angle = orbitT * Math.PI * 2;
        const rx = 5.8;
        const rz = 3.7;

        x = titleCenter.x + Math.cos(angle) * rx;
        y = titleCenter.y + Math.sin(t * 2.1) * 0.45 + Math.sin(angle * 1.2) * 0.2;
        z = titleCenter.z + Math.sin(angle) * rz;
        yaw = -angle + Math.PI * 0.5;
      } else {
        const passT = (phase - 0.68) / 0.32;
        x = THREE.MathUtils.lerp(-12.5, 12.5, passT);
        y = 1.0 + Math.sin(passT * Math.PI) * 1.5 + Math.sin(t * 2.3) * 0.15;
        z = THREE.MathUtils.lerp(2.8, -3.6, passT);
        yaw = -Math.PI * 0.5 + Math.sin(passT * Math.PI) * 0.35;
      }

      mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.05);

      x += mouse.x * 0.95;
      y += mouse.y * 0.55;

      group.position.set(x, y, z);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, yaw, 0.08);
      group.rotation.z = Math.sin(t * 2.6) * 0.08;
      group.rotation.x = Math.sin(t * 3.1) * 0.05;

      if (dragon) {
        dragon.rotation.z += (Math.sin(t * 2.2) * 0.09 - dragon.rotation.z) * 0.16;
        dragon.rotation.x += (Math.sin(t * 2.8) * 0.05 - dragon.rotation.x) * 0.16;
      }

      const flap = Math.sin(t * 9.0) * 0.32;
      wingBones.left.forEach(bone => {
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, flap, 0.2);
      });
      wingBones.right.forEach(bone => {
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, -flap, 0.2);
      });

      if (fallback) {
        fallback.rotation.y += 0.016;
        fallback.rotation.z = Math.sin(t * 2.1) * 0.3;
      }

      const camBaseX = Math.sin(t * 0.22) * 0.45;
      const camBaseY = 1.35 + Math.sin(t * 0.17) * 0.16;
      camera.position.x = camBaseX + mouse.x * 0.45;
      camera.position.y = camBaseY + mouse.y * 0.28;
      camera.position.z = 10.5 - mouse.y * 0.2;
      camera.lookAt(0, 1.0, 0);

      particles.rotation.y += 0.00045;
      particles.rotation.x = Math.sin(t * 0.08) * 0.04;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const nextWidth = mount.clientWidth || window.innerWidth;
      const nextHeight = mount.clientHeight || window.innerHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particleGeometry.dispose();
      scene.clear();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
