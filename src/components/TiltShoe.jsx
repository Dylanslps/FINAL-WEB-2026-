'use client';

import { useState } from 'react';

// 18 lapisan kedalaman Z (volumetric 3D extrusion dalam ruang preserve-3d)
const DEPTH_LAYERS = [
  { z: -30, scale: 0.965, b: 0.62 },
  { z: -26, scale: 0.974, b: 0.66 },
  { z: -22, scale: 0.982, b: 0.70 },
  { z: -18, scale: 0.988, b: 0.74 },
  { z: -14, scale: 0.993, b: 0.78 },
  { z: -11, scale: 0.996, b: 0.81 },
  { z: -8,  scale: 0.998, b: 0.84 },
  { z: -5,  scale: 0.999, b: 0.88 },
  { z: -2.5, scale: 1.0,  b: 0.92 },
  { z: 2.5, scale: 1.0,   b: 0.95 },
  { z: 5,   scale: 0.999, b: 0.97 },
  { z: 8,   scale: 0.997, b: 0.99 },
  { z: 11,  scale: 0.993, b: 1.01 },
  { z: 14,  scale: 0.987, b: 1.03 },
];

export default function TiltShoe({ src, alt, className = '' }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0, active: false });

  const updateTilt = (clientX, clientY, rect) => {
    if (!rect || !rect.width || !rect.height) return;
    const normX = (clientX - rect.left) / rect.width - 0.5;
    const normY = (clientY - rect.top) / rect.height - 0.5;
    const rotateY = Math.max(-30, Math.min(30, normX * 60));
    const rotateX = Math.max(-20, Math.min(20, -normY * 40));
    setRotation({ x: rotateX, y: rotateY, active: true });
  };

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateTilt(e.clientX, e.clientY, rect);
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    updateTilt(touch.clientX, touch.clientY, rect);
  };

  const resetTilt = () => {
    setRotation({ x: 0, y: 0, active: false });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetTilt}
      style={{ perspective: '1000px' }}
      className={`relative z-10 w-full max-w-[540px] h-[300px] sm:h-[390px] flex items-center justify-center touch-pan-y ${className}`}
    >
      <div
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x.toFixed(2)}deg) rotateY(${rotation.y.toFixed(2)}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className={`w-full h-full flex items-center justify-center will-change-transform ${
          rotation.active
            ? 'transition-transform duration-100 ease-out'
            : 'transition-transform duration-500 ease-out'
        }`}
      >
        <div
          style={{ transformStyle: 'preserve-3d' }}
          className="anim-shoe-float relative w-full h-full flex items-center justify-center"
        >
          {/* Lapisan-lapisan ekstrusi volume 3D sepanjang sumbu Z */}
          {DEPTH_LAYERS.map((layer) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={layer.z}
              src={src}
              alt=""
              aria-hidden="true"
              width={433}
              height={577}
              draggable={false}
              style={{
                transform: `translateZ(${layer.z}px) scale(${layer.scale})`,
                filter: `brightness(${layer.b}) contrast(1.08)`,
              }}
              className="absolute inset-0 w-full h-full max-h-[390px] object-contain m-auto scale-[1.28] sm:scale-[1.35] translate-y-3 select-none pointer-events-none"
            />
          ))}

          {/* Lapisan utama beresolusi penuh dengan bayangan 3D & kilau spekular */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={433}
            height={577}
            fetchPriority="high"
            draggable={false}
            style={{
              transform: 'translateZ(16px)',
              filter: `drop-shadow(${(-rotation.y * 0.6).toFixed(1)}px ${(22 + rotation.x * 0.5).toFixed(1)}px 26px rgba(0,0,0,0.38))`,
            }}
            className="relative w-full h-full max-h-[390px] object-contain mx-auto scale-[1.28] sm:scale-[1.35] translate-y-3 select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
