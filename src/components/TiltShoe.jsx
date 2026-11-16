'use client';

import { useState } from 'react';

export default function TiltShoe({ src, alt, className = '' }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0, active: false });

  const updateTilt = (clientX, clientY, rect) => {
    if (!rect || !rect.width || !rect.height) return;
    const normX = (clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const normY = (clientY - rect.top) / rect.height - 0.5; // -0.5 .. 0.5
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
        <div className="anim-shoe-float w-full h-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={433}
            height={577}
            fetchPriority="high"
            draggable={false}
            className="w-full h-full max-h-[390px] object-contain mx-auto scale-[1.28] sm:scale-[1.35] translate-y-3 drop-shadow-[0_28px_32px_rgba(0,0,0,0.42)] select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
