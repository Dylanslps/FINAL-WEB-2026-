'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight, Box } from 'lucide-react';

const Sneaker3DCanvas = dynamic(() => import('./Sneaker3DCanvas'), {
  ssr: false,
});

const formatIDR = (num) => {
  const n = Number(num);
  const hasCents = n % 1 !== 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(n);
};

// Lapisan panggung (dipakai pada layer dasar dan layer tirai wipe agar teks terbelah dua warna saat wipe melintas)
function StageLayer({ slide, phase, tilt, mode3D, slideIndex }) {
  const href = slide.product ? `/produk/${slide.product.slug}` : '/katalog';
  const wmClass = phase === 'in' ? 'anim-wm-in' : phase === 'out' ? 'anim-wm-out' : '';
  const shoeClass = phase === 'in' ? 'anim-shoe-in' : phase === 'out' ? 'anim-shoe-out' : '';

  return (
    <div
      data-hero-theme={slide.theme}
      style={{ background: 'var(--hero-bg)', color: 'var(--hero-ink)' }}
      className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-10 lg:px-14 pt-10 pb-36 lg:pb-32 min-h-[560px] lg:min-h-[650px] relative overflow-hidden"
    >
      {/* Kiri: Headline Italic Condensed + Subjudul + Tombol CTA sesuai video */}
      <div className="lg:col-span-4 z-10 space-y-4">
        <div
          className={`font-display italic uppercase leading-[0.9] tracking-tight ${
            slide.headline.length > 2
              ? 'text-[clamp(2.5rem,5.2vw,4.5rem)]'
              : 'text-[clamp(3.1rem,6.5vw,5.6rem)]'
          }`}
        >
          {slide.headline.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </div>

        <p style={{ color: 'var(--hero-ink-2)' }} className="text-sm sm:text-base leading-snug font-medium">
          {slide.tagline[0]}
          <br />
          {slide.tagline[1]}
        </p>

        <div className="pt-2">
          <Link
            href={href}
            style={{ backgroundColor: 'var(--hero-btn-bg)', color: 'var(--hero-btn-ink)' }}
            className="inline-flex items-center gap-3 min-h-11 px-6 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>Shop Now</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Tengah: Watermark AIR MAX + Model 3D Sepatu + Bayangan Lantai */}
      <div className="lg:col-span-8 relative flex items-center justify-center min-h-[300px] sm:min-h-[390px]">
        <span
          aria-hidden="true"
          style={{ color: 'var(--hero-wm)' }}
          className={`pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display italic uppercase leading-none tracking-tight whitespace-nowrap ${
            slide.watermark.length > 7
              ? 'text-[clamp(4.4rem,13.5vw,11.8rem)]'
              : 'text-[clamp(5.5rem,17vw,14.5rem)]'
          } ${wmClass}`}
        >
          {slide.watermark}
        </span>

        {/* Bayangan elips di bawah sepatu */}
        <div
          aria-hidden="true"
          style={{ backgroundColor: 'var(--hero-shadow)' }}
          className="anim-floor-in absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[56%] max-w-[420px] h-6 rounded-[50%] blur-xl"
        />

        {mode3D ? (
          <div className="relative z-10 w-full max-w-[580px] h-[310px] sm:h-[400px]">
            {phase !== 'out' && (
              <Sneaker3DCanvas
                theme={slide.theme}
                modelUrl={slide.modelUrl}
                tintColor={slide.tintColor}
                slideIndex={slideIndex}
                pointerOffset={tilt}
                interactiveDrag={true}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              transform: `perspective(1100px) rotateY(${tilt.x * 16}deg) rotateX(${-tilt.y * 12}deg) translate3d(${tilt.x * 20}px, ${tilt.y * 14}px, 0)`,
            }}
            className="relative z-10 w-full max-w-[540px] transition-transform duration-200 ease-out will-change-transform"
          >
            <div className={shoeClass}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.product?.name || slide.fallbackName}
                width={900}
                height={900}
                fetchPriority="high"
                className={`w-full h-auto max-h-[390px] object-contain mx-auto select-none ${
                  slide.theme === 'light'
                    ? 'drop-shadow-[0_24px_26px_rgba(0,0,0,0.22)]'
                    : 'drop-shadow-[0_28px_32px_rgba(0,0,0,0.45)]'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeroShowcase({ slides }) {
  const [active, setActive] = useState(0);
  const [transition, setTransition] = useState(null); // { from, to }
  const [mode3D, setMode3D] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const onChange = (e) => { reducedRef.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const go = useCallback((nextIdx) => {
    const target = (nextIdx + slides.length) % slides.length;
    if (target === active || transition) return;
    if (reducedRef.current) {
      setActive(target);
      return;
    }
    setTransition({ from: active, to: target });
  }, [active, transition, slides.length]);

  const finishTransition = () => {
    if (!transition) return;
    setActive(transition.to);
    setTransition(null);
  };

  const handlePointerMove = (e) => {
    if (reducedRef.current || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: dx, y: dy });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(active - 1); }
  };

  const visualIndex = transition ? transition.to : active;
  const baseSlide = slides[transition ? transition.from : active];
  const incomingSlide = transition ? slides[transition.to] : null;
  const activeSlide = slides[visualIndex];
  const activeTheme = activeSlide.theme;

  return (
    <section
      data-hero-theme={activeTheme}
      aria-roledescription="carousel"
      aria-label="Showcase Sneaker 3D STRIDE"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onKeyDown={handleKeyDown}
      className="relative isolate overflow-hidden rounded-[28px] border border-line shadow-2xl select-none"
    >
      {/* Tombol Mode 3D Interaktif (360° GLB vs Preview Samping Studio) */}
      <div className="absolute top-4 right-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode3D((v) => !v)}
          aria-pressed={mode3D}
          style={{
            backgroundColor: 'var(--hero-card-active)',
            borderColor: 'var(--hero-line-active)',
            color: 'var(--hero-ink)',
          }}
          className="min-h-10 px-3.5 rounded-full border backdrop-blur-md text-xs font-semibold inline-flex items-center gap-2 transition-all hover:scale-105"
        >
          <Box className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{mode3D ? 'Mode 3D 360° (Geser Sepatu)' : 'Aktifkan 3D Model 360°'}</span>
        </button>
      </div>

      {/* Layer Dasar */}
      <div className="relative z-10">
        <StageLayer
          slide={baseSlide}
          phase={transition ? 'out' : 'idle'}
          tilt={tilt}
          mode3D={mode3D}
          slideIndex={transition ? transition.from : active}
        />
      </div>

      {/* Layer Tirai Wipe Kanan-ke-Kiri (membelah background, watermark, judul, dan sepatu seperti di video) */}
      {incomingSlide && (
        <div
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) finishTransition();
          }}
          className="anim-curtain-left absolute inset-0 z-20"
        >
          <StageLayer
            slide={incomingSlide}
            phase="in"
            tilt={tilt}
            mode3D={mode3D}
            slideIndex={transition.to}
          />
        </div>
      )}

      {/* Navigasi Bawah: 3 Dots + Tombol < + 3 Kartu Horizontal + Tombol > (Sesuai Video) */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 pb-5 pt-2 flex flex-col items-center gap-3">
        {/* 3 Titik Indikator Slide */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Pilih slide sepatu">
          {slides.map((s, i) => {
            const isCurrent = i === visualIndex;
            return (
              <button
                key={`dot-${s.slug}`}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Slide ${i + 1}: ${s.cardTitle}`}
                onClick={() => go(i)}
                style={{
                  backgroundColor: 'var(--hero-ink)',
                  opacity: isCurrent ? 1 : 0.3,
                }}
                className="w-2 h-2 rounded-full transition-opacity"
              />
            );
          })}
        </div>

        {/* Bar Horizontal: < | 3 Kartu Sepatu | > */}
        <div className="w-full max-w-5xl flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => go(visualIndex - 1)}
            aria-label="Sepatu sebelumnya"
            style={{
              backgroundColor: 'var(--hero-card)',
              borderColor: 'var(--hero-line)',
              color: 'var(--hero-ink)',
            }}
            className="w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {slides.map((s, i) => {
              const isSelected = i === visualIndex;
              const price = s.product?.price || s.fallbackPrice;
              return (
                <li key={s.slug}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-pressed={isSelected}
                    aria-label={`Tampilkan ${s.cardTitle}`}
                    style={{
                      backgroundColor: isSelected ? 'var(--hero-card-active)' : 'var(--hero-card)',
                      borderColor: isSelected ? 'var(--hero-line-active)' : 'var(--hero-line)',
                      color: 'var(--hero-ink)',
                    }}
                    className="w-full h-24 px-3 sm:px-4 rounded-xl border backdrop-blur-md flex items-center gap-3 text-left transition-all duration-300"
                  >
                    <div className="relative w-20 h-16 flex-shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.thumbnail || s.image}
                        alt=""
                        width={140}
                        height={140}
                        className="w-16 h-16 object-contain drop-shadow-md"
                      />
                    </div>

                    <div
                      aria-hidden="true"
                      style={{ backgroundColor: 'var(--hero-line)' }}
                      className="w-px h-11 flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <span className="block text-xs sm:text-sm font-semibold truncate">
                        {s.cardTitle}
                      </span>
                      <span className="block text-xs sm:text-sm font-bold tabular-nums mt-1">
                        {formatIDR(price)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => go(visualIndex + 1)}
            aria-label="Sepatu berikutnya"
            style={{
              backgroundColor: 'var(--hero-card)',
              borderColor: 'var(--hero-line)',
              color: 'var(--hero-ink)',
            }}
            className="w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {visualIndex + 1} dari {slides.length}: {slides[visualIndex].cardTitle}
      </p>
    </section>
  );
}
