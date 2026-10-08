'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export interface ShowcaseStep {
  word: string;
  ey?: string;
  title: string;
  body: React.ReactNode;
  img?: { src: string; alt?: string };
  cat?: string;
  alert?: boolean;
}

interface PinnedShowcaseProps {
  steps: ShowcaseStep[];
  mode?: 'default' | 'swap' | 'hero';
  heroImg?: string;
  crumb?: React.ReactNode;
  chips?: { slug: string; name: string; href: string }[];
  activeChip?: string;
}

const rest = (x: number) => {
  const b = Math.floor(x);
  const f = x - b;
  const t = Math.min(1, Math.max(0, (f - 0.3) / 0.4));
  return b + t * t * (3 - 2 * t);
};

const getWordSizeClass = (word: string) => {
  const len = word.length;
  if (len <= 8) {
    // Short words like Piles, Hernia, পাইলস, স্তন
    return 'text-[clamp(44px,8.5vw,130px)]';
  } else if (len <= 15) {
    // Medium words like Gallstones, Fistula, রোগ ও চিকিৎসা, কিডনির পাথর
    return 'text-[clamp(34px,6.2vw,98px)]';
  } else {
    // Long phrases like "Conditions & Treatments", "Gallbladder & Bile Duct"
    return 'text-[clamp(24px,4.5vw,72px)]';
  }
};

export function PinnedShowcase({
  steps,
  mode = 'default',
  heroImg,
  crumb,
  chips,
  activeChip,
}: PinnedShowcaseProps) {
  const { isBn } = useLanguage();
  const showRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const docImgRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const galRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const n = steps.length;

  useEffect(() => {
    const el = showRef.current;
    const wordsEl = wordsRef.current;
    const panelEl = panelRef.current;
    const dotsEl = dotsRef.current;
    const docEl = docImgRef.current;
    const heroEl = heroImgRef.current;
    const galEl = galRef.current;
    const hintEl = hintRef.current;

    if (!el || !wordsEl || !panelEl) return;

    let animId: number;
    let pS = 0;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const q = Math.min(1, Math.max(0, -r.top / (el.offsetHeight - window.innerHeight)));
      pS += (q - pS) * 0.16;
      if (Math.abs(q - pS) < 0.0003) pS = q;

      const pos = rest(pS * (n - 1));
      const mob = window.innerWidth < 860;
      const step = window.innerHeight * (mob ? 0.36 : 0.6);
      const cur = Math.round(pos);

      // Words motion - centered horizontally across viewport
      const words = Array.from(wordsEl.children) as HTMLElement[];
      words.forEach((w, i) => {
        const o = i - pos;
        const a = Math.abs(o);
        w.style.transform = `translateY(calc(-50% + ${o * step}px)) scale(${1 - Math.min(a, 1) * 0.1})`;
        w.style.opacity = String(Math.max(0, 1 - a * (mode === 'hero' || mode === 'swap' ? 1.5 : 0.75)));
      });

      // Panel Cards motion
      const panes = Array.from(panelEl.children) as HTMLElement[];
      panes.forEach((p, i) => {
        const o = i - pos;
        const a = Math.abs(o);
        const op = Math.max(0, 1 - a * 1.6);
        p.style.transform = `translateY(${o * 50}px)`;
        p.style.opacity = String(op);
        p.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
      });

      // Dots
      if (dotsEl) {
        const dots = Array.from(dotsEl.children) as HTMLElement[];
        dots.forEach((d, i) => {
          d.style.height = i === cur ? '28px' : '16px';
          d.style.background = i === cur ? 'var(--teal)' : 'rgba(11,110,115,0.2)';
        });
      }

      // Swap Mode
      if (mode === 'swap' && docEl && galEl) {
        const h = Math.min(1, Math.max(0, pos));
        const e = h * h * (3 - 2 * h);
        docEl.style.opacity = String(1 - e);
        docEl.style.transform = mob ? `translateX(calc(-50% - ${e * 70}vw))` : `translateX(${-e * 45}vw)`;

        const galItems = Array.from(galEl.children) as HTMLElement[];
        galItems.forEach((g, i) => {
          if (!i) return;
          let op = 0;
          let sc = 0.9;
          if (i === 1 && pos < 1) {
            op = e;
            sc = 0.45 + 0.55 * e;
          } else {
            op = Math.max(0, 1 - Math.abs(pos - i) * 2);
            sc = 0.9 + 0.1 * op;
          }
          g.style.opacity = String(op);
          g.style.transform = `scale(${sc})`;
        });
      }

      // Hero Mode
      if (mode === 'hero' && heroEl) {
        const h = Math.min(1, Math.max(0, pos));
        const e = h * h * (3 - 2 * h);
        const k = 1 - e;
        heroEl.style.opacity = String(e);

        if (mob) {
          heroEl.style.transform = `translate(-50%, ${k * 30}vh) scale(${0.45 + 0.55 * e})`;
        } else {
          heroEl.style.transform = `translateX(${-k * 45}vw) scale(${0.8 + 0.2 * e})`;
        }

        if (hintEl) {
          hintEl.style.opacity = String(Math.max(0, 1 - pos * 4));
        }
      }
    };

    const loop = () => {
      onScroll();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [n, mode]);

  return (
    <section
      ref={showRef}
      className={`relative ${
        mode === 'hero' ? 'show-hero-mode' : mode === 'swap' ? 'show-swap-mode' : ''
      }`}
      style={{ height: `calc(${n} * 88vh + 100vh)` }}
    >
      <div className="sticky top-0 h-[100vh] h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_45%_55%_at_22%_64%,rgba(43,179,177,0.24),transparent_70%)] bg-gradient-to-b from-white to-[var(--tint)]">
        {/* Giant Drift Words */}
        <div ref={wordsRef} className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {steps.map((st, i) => (
            <div
              key={i}
              className={`absolute inset-x-0 top-[26%] sm:top-[28%] text-center whitespace-nowrap will-change-transform font-heading font-extrabold ${getWordSizeClass(
                st.word
              )} leading-[0.92] tracking-tight bg-gradient-to-b from-[var(--teal)]/38 via-[var(--teal)]/22 to-[rgba(43,179,177,0.06)] bg-clip-text text-transparent opacity-0 select-none px-4 max-w-full`}
            >
              {st.word}
            </div>
          ))}
        </div>

        {/* Doctor Gloves Cutout (for Default and Swap modes) */}
        {mode !== 'hero' && (
          <div
            ref={docImgRef}
            className="absolute left-1/2 sm:left-[3vw] -translate-x-1/2 sm:translate-x-0 bottom-0 h-[min(60vh,540px)] sm:h-[min(88vh,820px)] aspect-[655/1069] z-[2] pointer-events-none will-change-transform"
          >
            <Image
              src="/img/doctor-gloves.webp"
              alt="Dr. Fahim Foysal Kollol"
              width={655}
              height={1069}
              priority
              className="w-full h-full object-contain filter drop-shadow-[0_30px_40px_rgba(6,47,49,0.22)] anim-float"
            />
          </div>
        )}

        {/* Hero Mode Condition Cutout */}
        {mode === 'hero' && heroImg && (
          <div
            ref={heroImgRef}
            className="absolute z-[2] left-1/2 sm:left-[4vw] -translate-x-1/2 sm:translate-x-0 top-[28vh] sm:top-[22vh] bottom-[8vh] w-[88vw] sm:w-[42vw] pointer-events-none opacity-0 will-change-transform"
          >
            <Image
              src={heroImg}
              alt=""
              fill
              className="object-contain filter drop-shadow-[0_28px_36px_rgba(6,47,49,0.28)] anim-float"
            />
          </div>
        )}

        {/* Swap Mode Condition Images Gallery */}
        {mode === 'swap' && (
          <div ref={galRef} className="absolute z-[2] left-1/2 sm:left-[4vw] -translate-x-1/2 sm:translate-x-0 top-[28vh] sm:top-[22vh] bottom-[8vh] w-[88vw] sm:w-[42vw] pointer-events-none">
            {steps.map((st, i) => (
              <div key={i} className="absolute inset-0 opacity-0 will-change-transform">
                {st.img?.src && (
                  <Image
                    src={st.img.src}
                    alt={st.img.alt || ''}
                    fill
                    className="object-contain filter drop-shadow-[0_28px_36px_rgba(6,47,49,0.28)] anim-float"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Top Header: Breadcrumb & Chips */}
        <div className="absolute inset-x-0 top-[max(9vh,78px)] z-[4] text-center px-3 sm:px-4 pointer-events-auto">
          {crumb && <div className="text-xs font-bold uppercase tracking-wider text-[var(--teal)] mb-2">{crumb}</div>}
          {chips && (
            <div className="flex justify-start sm:justify-center gap-1.5 flex-nowrap sm:flex-wrap max-w-4xl mx-auto overflow-x-auto pb-1 scrollbar-none px-1">
              {chips.map((c) => (
                <Link
                  key={c.slug}
                  href={c.href}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all backdrop-blur-md ${
                    activeChip === c.slug
                      ? 'bg-[var(--teal)] text-white shadow-sm ring-2 ring-[var(--teal)]/20'
                      : 'bg-white/80 text-[var(--teal)] border border-[rgba(43,179,177,0.3)] hover:bg-white'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Panel Cards Container - anchored to right on desktop */}
        <div
          ref={panelRef}
          className={`absolute z-[3] bottom-[82px] sm:bottom-12 ${
            mode === 'hero'
              ? 'left-3 right-3 sm:left-auto sm:right-[5vw] lg:right-[6vw] sm:w-[min(540px,46vw)]'
              : mode === 'swap'
              ? 'left-3 right-3 sm:left-auto sm:right-[5vw] lg:right-[6vw] sm:w-[min(540px,46vw)]'
              : 'left-3 right-3 sm:left-auto sm:right-[5vw] lg:right-[6vw] sm:w-[min(540px,46vw)]'
          } h-[min(54vh,500px)] pointer-events-none`}
        >
          {steps.map((st, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-end justify-end pointer-events-auto will-change-transform opacity-0"
            >
              <div
                className={`w-full p-4 sm:p-6 lg:p-7 rounded-3xl bg-white/92 backdrop-blur-2xl border shadow-[0_20px_45px_-20px_rgba(6,47,49,0.35)] max-h-full overflow-y-auto ${
                  st.alert
                    ? 'border-red-300 ring-1 ring-red-200'
                    : 'border-[rgba(43,179,177,0.3)]'
                }`}
              >
                {/* 3D Medical Organ Illustration in Default Mode */}
                {mode === 'default' && st.img?.src && (
                  <div className="h-20 sm:h-36 relative flex items-center justify-center p-1 mb-2 sm:mb-3">
                    <Image
                      src={st.img.src}
                      alt={st.img.alt || st.title}
                      fill
                      className="object-contain filter drop-shadow-[0_16px_22px_rgba(6,47,49,0.25)]"
                    />
                  </div>
                )}
                {st.ey && (
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                      st.alert ? 'text-red-700' : 'text-[var(--aqua)]'
                    }`}
                  >
                    {st.ey}
                  </span>
                )}
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--ink)] leading-snug">
                  {st.title}
                </h3>
                <div className="mt-3 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {st.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint on Condition pages */}
        {mode === 'hero' && (
          <div
            ref={hintRef}
            className="hidden sm:flex absolute left-1/2 bottom-5 -translate-x-1/2 z-[5] items-center gap-3 px-5 py-2.5 rounded-full bg-[var(--teal)] text-white text-xs font-bold shadow-lg pointer-events-none animate-pulse"
          >
            <span>{isBn ? 'নিচে স্ক্রল করে বিস্তারিত জানুন' : 'Scroll down to learn more'}</span>
            <span className="w-5 h-5 rounded-full bg-white text-[var(--teal)] grid place-items-center text-xs">
              ↓
            </span>
          </div>
        )}

        {/* Progress indicator dots */}
        <div
          ref={dotsRef}
          className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 z-[4] flex-col gap-1.5"
        >
          {steps.map((_, i) => (
            <i
              key={i}
              className="w-1 rounded-full transition-all duration-300"
              style={{ height: i === 0 ? '28px' : '16px', background: i === 0 ? 'var(--teal)' : 'rgba(11,110,115,0.2)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
