'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const TINTS = {
  red: new THREE.Color('#FF2A36'),
  dark: new THREE.Color('#353944'),
  light: new THREE.Color('#FFFFFF'),
};

export default function Sneaker3DCanvas({
  theme = 'light',
  slideIndex = 0,
  pointerOffset = { x: 0, y: 0 },
  interactiveDrag = true,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    theme,
    slideIndex,
    interactiveDrag,
    pointer: { x: 0, y: 0 },
    dragging: false,
    dragStart: { x: 0, y: 0 },
    dragVel: { x: 0, y: 0 },
    lastInteractTime: -10,
    userRot: { x: 0, y: 0 },
    targetSpinY: 0,
    currentSpinY: 0,
    slideShiftX: 0,
    meshes: [],
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const st = stateRef.current;
    if (st.slideIndex !== slideIndex) {
      st.targetSpinY += Math.PI * 2;
      st.slideShiftX = 1.25;
      st.slideIndex = slideIndex;
      st.userRot = { x: 0, y: 0 };
      st.dragVel = { x: 0, y: 0 };
    }
    st.theme = theme;
  }, [theme, slideIndex]);

  useEffect(() => {
    const st = stateRef.current;
    st.interactiveDrag = interactiveDrag;
    if (!interactiveDrag) {
      st.dragging = false;
      st.dragVel = { x: 0, y: 0 };
    }
  }, [interactiveDrag]);

  useEffect(() => {
    stateRef.current.pointer = pointerOffset;
  }, [pointerOffset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.12, 4.15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio IBL reflections for realistic white leather, rubber sole & chrome accents
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.56;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x4b5160, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.48);
    keyLight.position.set(3.2, 4.8, 3.8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xeef4ff, 1.15);
    rimLight.position.set(-4.0, 2.4, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xdbe2ee, 0.6);
    fillLight.position.set(-2.4, -2.8, 2.6);
    scene.add(fillLight);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    let disposed = false;

    // Load user 3D sneaker model from /models/shoe.glb (with EXT_meshopt_compression + WebP PBR)
    loader.load(
      '/models/shoe.glb?v=user1',
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.26 / maxDim;

        model.position.sub(center);

        const meshes = [];
        const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material = child.material.clone();
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
              child.material.map.anisotropy = maxAniso;
            }
            if (child.material.normalMap) {
              child.material.normalMap.anisotropy = maxAniso;
            }
            child.material.color.copy(TINTS[stateRef.current.theme] || TINTS.light);
            child.material.envMapIntensity = 0.85;
            child.material.needsUpdate = true;
            meshes.push(child);
          }
        });
        stateRef.current.meshes = meshes;

        const wrapper = new THREE.Group();
        wrapper.scale.setScalar(scale);
        wrapper.rotation.set(0.14, -Math.PI * 0.34, 0.04);
        wrapper.add(model);
        pivot.add(wrapper);
        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Failed to load /models/shoe.glb:', err);
      }
    );

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const nowSec = performance.now() / 1000;
      const st = stateRef.current;

      if (reducedMotion) {
        st.currentSpinY = st.targetSpinY;
        st.slideShiftX = 0;
      } else {
        st.currentSpinY += (st.targetSpinY - st.currentSpinY) * 0.1;
        st.slideShiftX += (0 - st.slideShiftX) * 0.11;
        if (!st.dragging) {
          if (st.interactiveDrag) {
            st.userRot.y += st.dragVel.y;
            st.userRot.x = Math.max(-1.35, Math.min(1.35, st.userRot.x + st.dragVel.x));
            st.dragVel.x *= 0.90;
            st.dragVel.y *= 0.90;
            if (nowSec - st.lastInteractTime > 4.0) {
              st.userRot.x *= 0.975;
              st.userRot.y *= 0.975;
            }
          } else {
            st.userRot.x *= 0.90;
            st.userRot.y *= 0.90;
          }
        }
      }

      const px = reducedMotion ? 0 : st.pointer.x;
      const py = reducedMotion ? 0 : st.pointer.y;
      const recentlyDragged = st.interactiveDrag && nowSec - st.lastInteractTime < 4.0;
      const floatY = reducedMotion ? 0 : Math.sin(t * 2.0) * 0.05;
      const idleOrbitY = reducedMotion || st.dragging || recentlyDragged ? 0 : Math.sin(t * 1.1) * 0.28;
      const idleOrbitX = reducedMotion || st.dragging || recentlyDragged ? 0 : Math.cos(t * 1.1) * 0.07;

      // Stronger cursor tilt in hover-tilt mode (up to ~30 deg Y, ~20 deg X), gentler in drag mode
      const tiltMultY = st.interactiveDrag ? 0.34 : 0.95;
      const tiltMultX = st.interactiveDrag ? 0.22 : 0.65;

      pivot.position.x = st.slideShiftX + px * 0.12;
      pivot.position.y = floatY - py * 0.10;
      pivot.rotation.x = idleOrbitX - py * tiltMultX + st.userRot.x;
      pivot.rotation.y = st.currentSpinY + idleOrbitY + px * tiltMultY + st.userRot.y;
      pivot.rotation.z = -st.slideShiftX * 0.14;

      const targetTint = TINTS[st.theme] || TINTS.light;
      for (const m of st.meshes) {
        m.material.color.lerp(targetTint, 0.12);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      envRT.dispose();
      renderer.dispose();
    };
  }, []);

  const handlePointerDown = (e) => {
    const st = stateRef.current;
    if (!st.interactiveDrag) return;
    st.dragging = true;
    st.dragStart = { x: e.clientX, y: e.clientY };
    st.dragVel = { x: 0, y: 0 };
    st.lastInteractTime = performance.now() / 1000;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const st = stateRef.current;
    if (!st.dragging || !st.interactiveDrag) return;
    const dx = e.clientX - st.dragStart.x;
    const dy = e.clientY - st.dragStart.y;
    st.dragStart = { x: e.clientX, y: e.clientY };
    const vy = dx * 0.011;
    const vx = dy * 0.009;
    st.userRot.y += vy;
    st.userRot.x = Math.max(-1.35, Math.min(1.35, st.userRot.x + vx));
    st.dragVel = { x: vx * 0.65, y: vy * 0.65 };
    st.lastInteractTime = performance.now() / 1000;
  };

  const handlePointerUp = () => {
    stateRef.current.dragging = false;
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="img"
      aria-label={
        interactiveDrag
          ? 'Model 3D interaktif sepatu STRIDE, geser untuk memutar 360 derajat'
          : 'Model 3D sepatu STRIDE melayang mengikuti arah kursor'
      }
      className={`w-full h-full select-none transition-opacity duration-300 ${
        interactiveDrag ? 'cursor-grab active:cursor-grabbing touch-none' : 'cursor-pointer'
      } ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
