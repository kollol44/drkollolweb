'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SerialStep, SurgeonProfile } from '@/types/database';

interface SerialStepsSectionProps {
  steps: SerialStep[];
  profile: SurgeonProfile;
  onBookClick?: () => void;
}

const restH = (x: number) => {
  const b = Math.floor(x);
  const f = x - b;
  const t = Math.min(1, Math.max(0, (f - 0.3) / 0.4));
  return b + t * t * (3 - 2 * t);
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function SerialStepsSection({ steps, profile, onBookClick }: SerialStepsSectionProps) {
  const { lang, isBn } = useLanguage();
  const serialSectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      heading: 'How to get a serial',
    },
    bn: {
      heading: 'যেভাবে সিরিয়াল নেবেন',
    },
  }[lang];

  const ICONS = [
    // Step 1: Calendar / Schedule
    <svg key="1" viewBox="0 0 240 240" className="w-full h-full" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="siG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B6E73" />
          <stop offset="1" stopColor="#2BB3B1" />
        </linearGradient>
        <linearGradient id="siS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2BB3B1" />
          <stop offset="1" stopColor="#7fd6d3" />
        </linearGradient>
        <g id="siP">
          <ellipse fill="rgba(6,47,49,.10)" cx="0" cy="96" rx="46" ry="6" />
          <path fill="url(#siG)" d="M-44 92 L-39 42 Q-36 16 0 16 Q36 16 39 42 L44 92 Z" />
          <circle fill="url(#siG)" stroke="#fff" strokeWidth="5" cx="0" cy="-20" r="30" />
        </g>
      </defs>
      <g className="animate-pulse">
        <use href="#siP" x="70" y="118" />
      </g>
      <g transform="translate(132 86)">
        <rect width="100" height="96" rx="14" fill="url(#siG)" />
        <rect width="100" height="24" rx="12" fill="#0B6E73" />
        <rect x="18" y="-10" width="8" height="20" rx="4" fill="#fff" />
        <rect x="74" y="-10" width="8" height="20" rx="4" fill="#fff" />
        <rect x="8" y="30" width="84" height="58" rx="8" fill="#fff" />
        <rect x="14" y="36" width="20" height="14" rx="4" fill="#2BB3B1" />
        <rect x="40" y="36" width="20" height="14" rx="4" fill="#2BB3B1" />
        <rect x="66" y="36" width="20" height="14" rx="4" fill="#2BB3B1" />
        <rect x="14" y="56" width="20" height="14" rx="4" fill="#d9eeec" />
        <rect x="40" y="56" width="20" height="14" rx="4" fill="#2BB3B1" />
        <rect x="66" y="56" width="20" height="14" rx="4" fill="#d9eeec" />
      </g>
    </svg>,

    // Step 2: Book Button Touch
    <svg key="2" viewBox="0 0 240 240" className="w-full h-full" role="img" aria-hidden="true">
      <circle cx="150" cy="96" r="42" fill="url(#siG)" stroke="#fff" strokeWidth="5" />
      <text x="150" y="92" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontWeight="800" fontSize="12">
        BOOK A
      </text>
      <text x="150" y="108" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontWeight="800" fontSize="12">
        SERIAL
      </text>
      <circle cx="150" cy="96" r="54" fill="none" stroke="#2BB3B1" strokeWidth="2" opacity="0.6" className="animate-ping" />
      <g transform="translate(60 70)">
        <path d="M120 110 L120 90 Q120 84 126 84 Q132 84 132 90 L132 106 Q140 102 146 108 Q152 114 150 126 L144 144" fill="url(#siS)" stroke="#fff" strokeWidth="3" />
      </g>
    </svg>,

    // Step 3: Call & WhatsApp Phone
    <svg key="3" viewBox="0 0 240 240" className="w-full h-full" role="img" aria-hidden="true">
      <g transform="translate(130 90)">
        <rect x="0" y="0" width="56" height="96" rx="12" fill="url(#siG)" stroke="#fff" strokeWidth="4" />
        <rect x="6" y="12" width="44" height="66" rx="6" fill="#fff" />
        <circle cx="28" cy="86" r="4" fill="#fff" />
      </g>
      <g className="animate-bounce">
        <path d="M60 40 H130 Q142 40 142 52 V80 Q142 92 130 92 H90 L75 106 L78 92 H60 Q48 92 48 80 V52 Q48 40 60 40 Z" fill="#fff" stroke="#2BB3B1" strokeWidth="4" />
        <circle cx="75" cy="66" r="5" fill="#0B6E73" />
        <circle cx="95" cy="66" r="5" fill="#0B6E73" />
        <circle cx="115" cy="66" r="5" fill="#0B6E73" />
      </g>
    </svg>,
  ];

  useEffect(() => {
    const serialEl = serialSectionRef.current;
    const cardsEl = cardsRef.current;
    const barEl = barRef.current;
    if (!serialEl || !cardsEl) return;

    let animId: number;

    const onScroll = () => {
      const vh = window.innerHeight;
      const r = serialEl.getBoundingClientRect();
      const mob = window.innerWidth < 860;
      const cover = clamp(1 - r.top / vh, 0, 1);
      const cards = Array.from(cardsEl.children) as HTMLElement[];
      const n = cards.length;
      if (!n) return;

      const q = clamp(-r.top / (serialEl.offsetHeight - vh), 0, 1);
      const pos = restH(q * (n - 1)) - (1 - cover);

      cards.forEach((el, i) => {
        const o = i - pos;
        const a = Math.abs(o);

        if (mob) {
          el.style.transform = `translateY(${o * 72}vh) scale(${1 - Math.min(a, 1) * 0.08})`;
          el.style.opacity = String(clamp(1 - a * 1.6, 0, 1));
        } else {
          el.style.transform = `translateX(${o * 46}vw) scale(${1 - Math.min(a, 1.5) * 0.16})`;
          el.style.opacity = a > 1.7 ? '0' : String(clamp(1 - a * 0.55, 0, 1));
        }
        el.style.zIndex = String(10 - Math.round(a * 2));
        el.style.pointerEvents = a < 0.5 ? 'auto' : 'none';
      });

      if (barEl) {
        const dots = Array.from(barEl.children) as HTMLElement[];
        const cur = Math.round(clamp(pos, 0, n - 1));
        dots.forEach((dot, i) => {
          dot.style.background = i === cur ? 'var(--teal)' : 'rgba(11,110,115,0.2)';
          dot.style.width = i === cur ? '48px' : '28px';
        });
      }
    };

    const loop = () => {
      onScroll();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [steps]);

  return (
    <section
      ref={serialSectionRef}
      className="relative z-20 -mt-[100vh] h-[calc(3*95vh+100vh)] bg-white rounded-t-[34px] shadow-[0_-30px_60px_-30px_rgba(6,47,49,0.4)]"
      id="serial"
    >
      {/* Top glowing cyan edge */}
      <div className="absolute inset-x-[8%] top-0 h-[2px] z-30 rounded-full bg-gradient-to-r from-transparent via-[var(--aqua)] via-50%-[#7fe3df] to-transparent shadow-[0_0_18px_2px_rgba(43,179,177,0.55)]" />

      <div className="sticky top-0 h-[100vh] h-[100svh] overflow-hidden rounded-t-[34px] bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(43,179,177,0.16),transparent_70%)] bg-gradient-to-b from-white to-[var(--tint)]">
        {/* Infinite Numbers Ticker on Top Edge */}
        <div className="absolute inset-x-0 top-[max(84px,11vh)] py-3 px-0 border-y border-[rgba(43,179,177,0.22)] bg-white/60 tkr z-10">
          <div className="trk" style={{ '--dur': '40s' } as React.CSSProperties}>
            {profile.stats.map((st, idx) => (
              <span key={idx} className="inline-flex items-baseline gap-2 px-6 text-sm font-semibold text-[var(--muted)]">
                <b className="font-heading font-extrabold text-xl text-[var(--teal)]">
                  {isBn ? st.num_bn : st.num_en}
                </b>
                <span>{isBn ? st.label_bn : st.label_en}</span>
                <span className="text-[var(--aqua)] text-xs ml-4">✦</span>
              </span>
            ))}
            {/* Repeated for loop */}
            {profile.stats.map((st, idx) => (
              <span key={`dup-${idx}`} className="inline-flex items-baseline gap-2 px-6 text-sm font-semibold text-[var(--muted)]">
                <b className="font-heading font-extrabold text-xl text-[var(--teal)]">
                  {isBn ? st.num_bn : st.num_en}
                </b>
                <span>{isBn ? st.label_bn : st.label_en}</span>
                <span className="text-[var(--aqua)] text-xs ml-4">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Section Headline */}
        <h2 className="absolute inset-x-0 top-[calc(max(84px,11vh)+72px)] text-center font-heading font-extrabold text-[clamp(44px,7.5vw,110px)] leading-none tracking-tight bg-gradient-to-b from-[var(--teal)] via-[var(--teal)]/80 to-[rgba(43,179,177,0.45)] bg-clip-text text-transparent px-4">
          {t.heading}
        </h2>

        {/* Scroll-Driven Cards Deck */}
        <div ref={cardsRef} className="absolute inset-x-0 bottom-[9vh] h-[min(52vh,470px)] pointer-events-none">
          {steps.map((st, idx) => (
            <div
              key={st.step_number}
              className="absolute left-1/2 top-0 bottom-0 w-[min(620px,46vw)] -ml-[calc(min(620px,46vw)/2)] sm:grid sm:grid-cols-12 sm:items-center sm:gap-6 p-6 sm:p-8 rounded-[28px] bg-white/90 backdrop-blur-2xl border border-[rgba(43,179,177,0.3)] shadow-[0_26px_50px_-28px_rgba(6,47,49,0.45)] will-change-transform opacity-0 pointer-events-auto"
            >
              {/* Animated Pictogram Icon */}
              <div className="sm:col-span-5 w-28 sm:w-full aspect-square mx-auto mb-3 sm:mb-0 relative grid place-items-center">
                <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(43,179,177,0.22),transparent_70%)]" />
                {ICONS[idx]}
              </div>

              {/* Card Text & Actions */}
              <div className="sm:col-span-7 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--aqua)] to-[var(--teal)] text-white font-extrabold text-sm grid place-items-center shadow-sm">
                  {isBn ? String(st.step_number).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]) : st.step_number}
                </div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-[var(--ink)] leading-snug">
                  {isBn ? st.title_bn : st.title_en}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {isBn ? st.desc_bn : st.desc_en}
                </p>

                <div className="flex gap-2 flex-wrap mt-2">
                  {st.primary_btn_link.startsWith('/') ? (
                    <Link href={st.primary_btn_link} className="btn btn-p text-xs py-2 px-4 shadow-sm">
                      {isBn ? st.primary_btn_text_bn : st.primary_btn_text_en}
                    </Link>
                  ) : onBookClick && st.primary_btn_link.startsWith('tel:') ? (
                    <button type="button" onClick={onBookClick} className="btn btn-p text-xs py-2 px-4 shadow-sm">
                      {isBn ? st.primary_btn_text_bn : st.primary_btn_text_en}
                    </button>
                  ) : (
                    <a href={st.primary_btn_link} className="btn btn-p text-xs py-2 px-4 shadow-sm">
                      {isBn ? st.primary_btn_text_bn : st.primary_btn_text_en}
                    </a>
                  )}

                  {st.secondary_btn_text_en && (
                    <a
                      href={st.secondary_btn_link}
                      target={st.secondary_btn_link?.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="btn btn-g text-xs py-2 px-3.5 shadow-sm"
                    >
                      {isBn ? st.secondary_btn_text_bn : st.secondary_btn_text_en}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar Dots */}
        <div ref={barRef} className="absolute left-1/2 bottom-[3.5vh] -translate-x-1/2 flex items-center gap-2 z-20">
          {steps.map((_, i) => (
            <i
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === 0 ? '48px' : '28px', background: i === 0 ? 'var(--teal)' : 'rgba(11,110,115,0.2)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
