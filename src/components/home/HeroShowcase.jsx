'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown } from 'lucide-react';

const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

// Hero showcase: sepatu 3D melayang, rail produk, wipe tema per slide.
// Arah gerak: .agents/design/DESIGN.md bagian 0 dan 4.
export default function HeroShowcase({ slides }) {
  const [active, setActive] = useState(0);
  const [wipe, setWipe] = useState(null); // { to, theme }
  const tiltRef = useRef(null);
  const frameRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const onChange = (e) => { reducedRef.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const go = useCallback((next) => {
    const target = (next + slides.length) % slides.length;
    if (target === active || wipe) return;
    if (reducedRef.current || slides[target].theme === slides[active].theme) {
      setActive(target);
      return;
    }
    setWipe({ to: target, theme: slides[target].theme });
  }, [active, wipe, slides]);

  const finishWipe = () => {
    if (!wipe) return;
    setActive(wipe.to);
    setWipe(null);
  };

  const handlePointerMove = (e) => {
    if (reducedRef.current || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (tiltRef.current) {
        tiltRef.current.style.transform =
          `perspective(1000px) rotateY(${dx * 16}deg) rotateX(${-dy * 10}deg) translate3d(${dx * 24}px, ${dy * 16}px, 0)`;
      }
    });
  };

  const resetTilt = () => {
    cancelAnimationFrame(frameRef.current);
    if (tiltRef.current) tiltRef.current.style.transform = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  const slide = slides[active];
  const href = slide.product ? `/produk/${slide.product.slug}` : '/katalog';

  return (
    <section
      data-theme={slide.theme}
      aria-roledescription="carousel"
      aria-label="Sneaker pilihan"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className="relative isolate overflow-hidden rounded-[28px] border border-line bg-canvas text-ink transition-colors duration-300"
    >
      {wipe && (
        <div
          data-theme={wipe.theme}
          aria-hidden="true"
          onAnimationEnd={finishWipe}
          className="anim-wipe-down absolute inset-0 z-30 bg-canvas"
        />
      )}

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 px-5 py-8 sm:px-8 lg:px-12 lg:py-12 lg:min-h-[620px]">
        {/* Teks kiri */}
        <div key={`text-${active}`} className="lg:col-span-4 flex flex-col justify-center gap-5 z-10">
          <h1 className="anim-rise-in font-display uppercase leading-[0.9] text-[clamp(3rem,7vw,6.25rem)]">
            {slide.headline[0]}
            <br />
            {slide.headline[1]}
          </h1>
          <p className="anim-rise-in text-ink-2 text-base max-w-xs [animation-delay:80ms]">
            {slide.tagline}
          </p>
          <div className="anim-rise-in flex flex-wrap items-center gap-4 [animation-delay:160ms]">
            <Link
              href={href}
              className="inline-flex items-center min-h-11 px-6 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85 active:opacity-70 transition-opacity"
            >
              {slide.product ? 'Lihat dan beli' : 'Buka katalog'}
            </Link>
            {slide.product && (
              <span className="text-lg font-semibold tabular-nums">{formatIDR(slide.product.price)}</span>
            )}
          </div>
        </div>

        {/* Panggung produk */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[300px] sm:min-h-[420px]">
          <span
            key={`wm-${active}`}
            aria-hidden="true"
            className="anim-watermark-in pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display uppercase leading-none text-[clamp(5rem,16vw,13rem)] text-[var(--watermark)]"
          >
            {slide.watermark}
          </span>

          <div
            key={`floor-${active}`}
            aria-hidden="true"
            className="anim-floor-in absolute bottom-[12%] left-1/2 -ml-[32%] w-[64%] h-6 rounded-[50%] blur-xl bg-[var(--floor-shadow)]"
          />

          <div ref={tiltRef} className="relative w-full max-w-[560px] transition-transform duration-300 ease-out will-change-transform">
            <div key={`shoe-${active}`} className="anim-shoe-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.product?.name || slide.fallbackName}
                width={1000}
                height={1000}
                fetchPriority={active === 0 ? 'high' : 'auto'}
                className={`w-full h-auto drop-shadow-2xl ${slide.flip ? '-scale-x-100' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Rail produk */}
        <div className="lg:col-span-2 flex lg:flex-col items-center justify-center gap-3 z-10" onKeyDown={handleKeyDown}>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Produk sebelumnya"
            className="hidden lg:flex w-11 h-11 items-center justify-center rounded-full border border-line hover:bg-surface-2 transition-colors"
          >
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          </button>

          <ul className="flex lg:flex-col gap-3 w-full">
            {slides.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.slug} className="flex-1">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-pressed={isActive}
                    aria-label={`Tampilkan ${s.product?.name || s.fallbackName}`}
                    className={`w-full rounded-xl border p-2 text-left transition-colors ${
                      isActive ? 'border-ink bg-surface' : 'border-transparent hover:border-line hover:bg-surface/60'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt=""
                      width={160}
                      height={160}
                      loading="lazy"
                      className={`w-full max-w-[96px] mx-auto h-auto ${s.flip ? '-scale-x-100' : ''}`}
                    />
                    <span className="mt-1 block text-xs font-medium leading-tight line-clamp-2">
                      {s.product?.name || s.fallbackName}
                    </span>
                    {s.product && (
                      <span className="block text-xs text-ink-2 tabular-nums">{formatIDR(s.product.price)}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Produk berikutnya"
            className="hidden lg:flex w-11 h-11 items-center justify-center rounded-full border border-line hover:bg-surface-2 transition-colors"
          >
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {active + 1} dari {slides.length}: {slide.product?.name || slide.fallbackName}
      </p>
    </section>
  );
}
