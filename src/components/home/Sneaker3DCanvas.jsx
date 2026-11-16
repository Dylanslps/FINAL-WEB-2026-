'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const VARIant_TEX_INDEX = {
  red: 1,
  dark: 3,
  light: 4,
};

const TINTS = {
  red: new THREE.Color('#FF2A36'),
  dark: new THREE.Color('#E8E8EC'),
  light: new THREE.Color('#FFFFFF'),
};

export default function Sneaker3DCanvas({ theme = 'red', slideIndex = 0, pointerOffset = { x: 0, y: 0 } }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    theme,
    slideIndex,
    pointer: { x: 0, y: 0 },
    dragging: false,
    dragStart: { x: 0, y: 0 },
    userRot: { x: 0, y: 0 },
    targetSpinY: 0,
    currentSpinY: 0,
    slideShiftX: 0,
    meshes: [],
    textures: {},
    khronosGroup: null,
    airforceGroup: null,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const st = stateRef.current;
    if (st.slideIndex !== slideIndex) {
      st.targetSpinY += Math.PI * 2;
      st.slideShiftX = 1.25;
      st.slideIndex = slideIndex;
    }
    st.theme = theme;

    // Toggle between AirForceWhite 3D GLB (for light/slide 3) and Khronos Shoe GLB (for red/dark)
    if (st.airforceGroup && st.khronosGroup) {
      const useAirForce = theme === 'light';
      st.airforceGroup.visible = useAirForce;
      st.khronosGroup.visible = !useAirForce;
    }

    const tex = st.textures[theme];
    if (tex && st.meshes.length) {
      for (const m of st.meshes) {
        if (m.material.map !== tex) {
          m.material.map = tex;
          m.material.needsUpdate = true;
        }
      }
    }
  }, [theme, slideIndex]);

  useEffect(() => {
    stateRef.current.pointer = pointerOffset;
  }, [pointerOffset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.08, 4.15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333340, 1.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3.5, 5.0, 4.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.9);
    rimLight.position.set(-4.0, 2.5, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.15);
    fillLight.position.set(0, -3.5, 2.5);
    scene.add(fillLight);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const khronosGroup = new THREE.Group();
    const airforceGroup = new THREE.Group();
    pivot.add(khronosGroup);
    pivot.add(airforceGroup);
    stateRef.current.khronosGroup = khronosGroup;
    stateRef.current.airforceGroup = airforceGroup;

    const loader = new GLTFLoader();
    let disposed = false;

    // 1. Load Khronos 3D sneaker model (/models/shoe.glb)
    loader.load(
      '/models/shoe.glb',
      async (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.55 / maxDim;

        model.position.sub(center);
        const wrapper = new THREE.Group();
        wrapper.scale.setScalar(scale);
        wrapper.rotation.set(0.16, -Math.PI * 0.5, -0.44);
        wrapper.add(model);
        khronosGroup.add(wrapper);

        const texMap = {};
        for (const [k, idx] of Object.entries(VARIant_TEX_INDEX)) {
          try {
            const t = await gltf.parser.getDependency('texture', idx);
            if (t) {
              t.colorSpace = THREE.SRGBColorSpace;
              texMap[k] = t;
            }
          } catch {}
        }
        stateRef.current.textures = texMap;

        const meshes = [];
        const activeTex = texMap[stateRef.current.theme];
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material = child.material.clone();
            if (activeTex) child.material.map = activeTex;
            child.material.color.copy(TINTS[stateRef.current.theme] || TINTS.red);
            child.material.roughness = 0.42;
            child.material.metalness = 0.15;
            child.material.needsUpdate = true;
            meshes.push(child);
          }
        });
        stateRef.current.meshes = meshes;
        khronosGroup.visible = stateRef.current.theme !== 'light';
        setLoaded(true);
      },
      undefined,
      () => {}
    );

    // 2. Load 3D Air Force White model generated from airforcewhite.png (/models/airforcewhite.glb)
    loader.load(
      '/models/airforcewhite.glb',
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.35 / maxDim;

        model.position.sub(center);
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
            child.material.roughness = 0.38;
            child.material.metalness = 0.05;
          }
        });

        const wrapper = new THREE.Group();
        wrapper.scale.setScalar(scale);
        wrapper.add(model);
        airforceGroup.add(wrapper);
        airforceGroup.visible = stateRef.current.theme === 'light';
        setLoaded(true);
      },
      undefined,
      () => {}
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
      const st = stateRef.current;

      if (reducedMotion) {
        st.currentSpinY = st.targetSpinY;
        st.slideShiftX = 0;
      } else {
        st.currentSpinY += (st.targetSpinY - st.currentSpinY) * 0.1;
        st.slideShiftX += (0 - st.slideShiftX) * 0.11;
        if (!st.dragging) {
          st.userRot.x *= 0.95;
          st.userRot.y *= 0.95;
        }
      }

      const px = reducedMotion ? 0 : st.pointer.x;
      const py = reducedMotion ? 0 : st.pointer.y;
      const floatY = reducedMotion ? 0 : Math.sin(t * 2.1) * 0.045;

      pivot.position.x = st.slideShiftX + px * 0.16;
      pivot.position.y = floatY - py * 0.12;
      pivot.rotation.x = -py * 0.28 + st.userRot.x;
      pivot.rotation.y = st.currentSpinY + px * 0.42 + st.userRot.y;
      pivot.rotation.z = -st.slideShiftX * 0.14;

      const targetTint = TINTS[st.theme] || TINTS.red;
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
      renderer.dispose();
    };
  }, []);

  const handlePointerDown = (e) => {
    stateRef.current.dragging = true;
    stateRef.current.dragStart = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!stateRef.current.dragging) return;
    const dx = e.clientX - stateRef.current.dragStart.x;
    const dy = e.clientY - stateRef.current.dragStart.y;
    stateRef.current.dragStart = { x: e.clientX, y: e.clientY };
    stateRef.current.userRot.y += dx * 0.012;
    stateRef.current.userRot.x = Math.max(-0.7, Math.min(0.7, stateRef.current.userRot.x + dy * 0.009));
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
      aria-label="Model 3D interaktif sepatu STRIDE, geser untuk memutar 360 derajat"
      className={`w-full h-full cursor-grab active:cursor-grabbing select-none transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
