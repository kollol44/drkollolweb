'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Condition, SurgeonProfile } from '@/types/database';

interface DoctorConditionsStageProps {
  profile: SurgeonProfile;
  categories: Category[];
  conditions: Condition[];
  onBookClick?: () => void;
}

const DOC = { hold: 0.05, curtain: [0.05, 0.2], svc: [0.2, 1] };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
const restH = (x: number) => {
  const b = Math.floor(x);
  const f = x - b;
  const t = clamp((f - 0.3) / 0.4, 0, 1);
  return b + t * t * (3 - 2 * t);
};

export function DoctorConditionsStage({
  profile,
  categories,
  conditions,
  onBookClick,
}: DoctorConditionsStageProps) {
  const { lang, isBn } = useLanguage();
  const stageRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLHeadingElement>(null);
  const sideLRef = useRef<HTMLDivElement>(null);
  const sideRRef = useRef<HTMLDivElement>(null);
  const ctaMRef = useRef<HTMLDivElement>(null);
  const tkrDegRef = useRef<HTMLDivElement>(null);
  const docImgRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const [activeChip, setActiveChip] = useState<string>('');
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [counts, setCounts] = useState<string[]>(profile.stats.map((s) => (isBn ? s.num_bn : s.num_en)));

  // Filter home featured conditions & rest
  const featured = conditions.filter((c) => c.home_order && !c.is_hidden).sort((a, b) => (a.home_order || 0) - (b.home_order || 0));
  const rest = conditions.filter((c) => !c.home_order && !c.is_hidden);

  const svcItems = [
    ...featured.map((c) => ({
      word: isBn ? (c.home_word_bn || c.name_bn) : (c.home_word_en || c.name_en),
      cat: c.category_slug,
      c,
      isMore: false,
    })),
    {
      word: isBn ? 'আরও অনেক' : 'And more',
      cat: '',
      c: null,
      isMore: true,
    },
  ];

  const sideOf = (i: number) => {
    if (svcItems[i]?.isMore) return 0;
    return Math.floor(i / 3) % 2 ? -1 : 1; // +1 = doctor right, card left; -1 = doctor left, card right
  };

  // Count-up animation
  const animateStats = () => {
    const BN = '০১২৩৪৫৬৭৮৯';
    const toL = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));
    const toB = (s: string) => s.replace(/\d/g, (d) => BN[parseInt(d, 10)]);

    profile.stats.forEach((st, idx) => {
      const txt = isBn ? st.num_bn : st.num_en;
      const bnMatch = /[০-৯]/.test(txt);
      const match = toL(txt).match(/[\d,]+/);
      if (!match) return;

      const numVal = parseInt(match[0].replace(/,/g, ''), 10);
      const pre = toL(txt).slice(0, match.index);
      const suf = toL(txt).slice((match.index || 0) + match[0].length);
      const t0 = performance.now();
      const dur = 900;

      const step = (t: number) => {
        const k = Math.min(1, Math.max(0, (t - t0) / dur));
        const val = Math.round(numVal * (1 - Math.pow(1 - k, 3)));
        let str = pre + val.toLocaleString('en-US') + suf;
        const res = bnMatch ? toB(str) : str;

        setCounts((prev) => {
          const next = [...prev];
          next[idx] = res;
          return next;
        });

        if (k < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    });
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true);
            animateStats();
          } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            setStatsAnimated(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [isBn, statsAnimated]);

  // Main scroll driver for doctor & conditions stage
  useEffect(() => {
    const stage = stageRef.current;
    const docImg = docImgRef.current;
    const introEl = introRef.current;
    const sideL = sideLRef.current;
    const sideR = sideRRef.current;
    const ctaM = ctaMRef.current;
    const tkrDeg = tkrDegRef.current;
    const wordsContainer = wordsContainerRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!stage || !docImg) return;

    let animId: number;

    const docState = (i: number) => {
      const sd = sideOf(i);
      if (!sd) return { x: 0, s: 1, y: 0 };
      const H = docImg.offsetHeight || 600;
      const vh = window.innerHeight;
      const S = Math.max(1.6, (0.76 * vh) / (0.42 * H));
      const top0 = vh - H;
      return { x: sd * window.innerWidth * 0.27, s: S, y: vh * 0.24 - (top0 + 0.015 * H * S) };
    };

    const onScroll = () => {
      const r = stage.getBoundingClientRect();
      const q = clamp(-r.top / (stage.offsetHeight - 2 * window.innerHeight), 0, 1);
      const vh = window.innerHeight;
      const mob = window.innerWidth < 860;

      // 1. Curtain: intro lifts off
      const c = seg(q, DOC.curtain[0], DOC.curtain[1]);
      const up = -c * vh * 1.15;

      if (introEl) {
        introEl.style.transform = `translate(0, ${up * 1.1}px)`;
        introEl.style.opacity = String(1 - seg(c, 0.55, 1));
      }
      if (sideL) {
        sideL.style.transform = `translate(0, ${up}px)`;
        sideL.style.opacity = String(1 - seg(c, 0.55, 1));
        sideL.style.pointerEvents = c > 0.5 ? 'none' : 'auto';
      }
      if (sideR) {
        sideR.style.transform = `translate(0, ${up * 0.9}px)`;
        sideR.style.opacity = String(1 - seg(c, 0.55, 1));
        sideR.style.pointerEvents = c > 0.5 ? 'none' : 'auto';
      }
      if (tkrDeg) {
        tkrDeg.style.transform = `translate(0, ${up * 0.25}px)`;
        tkrDeg.style.opacity = String(1 - seg(c, 0, 0.45));
      }
      if (ctaM) {
        ctaM.style.transform = `translate(0, ${up * 1.2}px)`;
        ctaM.style.opacity = String(1 - seg(c, 0.55, 1));
        ctaM.style.pointerEvents = c > 0.5 ? 'none' : 'auto';
      }

      // 2. Treatments: Doctor swings side-to-side (laptop), cards & words scroll
      const inS = seg(q, DOC.curtain[0] + 0.04, DOC.curtain[1] + 0.02);
      const n = svcItems.length;
      const pos = mob ? seg(q, DOC.svc[0], DOC.svc[1]) * (n - 1) : restH(seg(q, DOC.svc[0], DOC.svc[1]) * (n - 1));
      const stepDist = vh * (mob ? 0.34 : 0.62);

      if (mob) {
        docImg.style.transform = '';
      } else {
        const a = Math.floor(pos);
        const f = pos - a;
        const A = docState(a);
        const B = docState(Math.min(n - 1, a + 1));
        const e = f * f * (3 - 2 * f);
        const C = { x: 0, s: 1, y: 0 };
        const k = inS * inS * (3 - 2 * inS);

        let x = lerp(A.x, B.x, e);
        const sc = lerp(A.s, B.s, e) - Math.sin(Math.PI * e) * (A.x && B.x && A.x !== B.x ? 0.45 : 0);
        let y = lerp(A.y, B.y, e);

        x = lerp(C.x, x, k);
        y = lerp(0, y, k);
        const finalScale = lerp(1, sc, k);

        docImg.style.transformOrigin = '50% 0';
        docImg.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px) scale(${finalScale})`;
      }

      // Words & Cards positioning
      if (wordsContainer && cardsContainer) {
        const words = Array.from(wordsContainer.children) as HTMLElement[];
        const cards = Array.from(cardsContainer.children) as HTMLElement[];

        words.forEach((w, i) => {
          const o = i - pos;
          const a = Math.abs(o);
          w.style.transform = `translate(-50%, calc(-50% + ${o * stepDist + (1 - inS) * vh * 0.9}px - ${
            mob ? 14 : 10
          }vh)) scale(${1 - Math.min(a, 1) * 0.12})`;
          w.style.opacity = String(clamp(1 - a * 0.75, 0, 1) * inS);
        });

        cards.forEach((cd, i) => {
          const o = i - pos;
          const a = Math.abs(o);
          const co = clamp(1 - a * 1.6, 0, 1) * inS;
          cd.style.opacity = String(co);
          cd.style.pointerEvents = co > 0.4 ? 'auto' : 'none';

          if (svcItems[i]?.isMore) {
            cd.style.left = '50%';
            cd.style.right = 'auto';
            cd.style.transform = `translate(-50%, ${o * 40}px)`;
          } else {
            const isLeft = sideOf(i) === 1; // 1 = doctor right, card left; -1 = doctor left, card right
            if (mob) {
              cd.style.left = '16px';
              cd.style.right = '16px';
            } else if (isLeft) {
              cd.style.left = '5vw';
              cd.style.right = 'auto';
            } else {
              cd.style.left = 'auto';
              cd.style.right = '5vw';
            }
            cd.style.transform = `translate(0, ${o * 40}px)`;
          }
        });
      }

      // Active category chip
      const curIdx = Math.round(pos);
      if (svcItems[curIdx]?.cat) {
        setActiveChip(svcItems[curIdx].cat);
      }
    };

    const handleLoop = () => {
      onScroll();
      animId = requestAnimationFrame(handleLoop);
    };

    animId = requestAnimationFrame(handleLoop);
    return () => cancelAnimationFrame(animId);
  }, [svcItems]);

  return (
    <section
      ref={stageRef}
      className="relative z-10"
      id="doctor"
      style={{
        height: `calc(${svcItems.length} * 80vh + 330vh)`,
        background: `linear-gradient(180deg, rgba(238,247,246,0) 0, rgba(238,247,246,0) 4vh, var(--tint) 95vh, var(--tint) 100%), var(--edge-row, #f2f2f1)`,
      }}
    >
      <div ref={pinRef} className="sticky top-0 h-[100vh] h-[100svh] overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[min(80vw,860px)] aspect-square rounded-full bg-radial from-[rgba(43,179,177,0.26)] via-[rgba(43,179,177,0.08)] to-transparent pointer-events-none" />

        {/* Phase 1: Giant Intro Word */}
        <h2
          ref={introRef}
          className="absolute inset-x-0 top-[max(11vh,84px)] text-center z-[1] whitespace-nowrap font-heading font-extrabold text-[clamp(44px,9vw,160px)] leading-[0.95] tracking-tight will-change-transform select-none pointer-events-none"
        >
          <span className="inline-block bg-gradient-to-b from-[var(--teal)] via-[var(--teal)]/80 to-[rgba(43,179,177,0.35)] bg-clip-text text-transparent">
            {isBn ? profile.intro_word_bn : profile.intro_word_en}
          </span>
        </h2>

        {/* Phase 2: Category Chips Bar */}
        <div
          ref={chipsRef}
          className="absolute inset-x-0 top-[84px] sm:top-[92px] z-[10] text-center flex flex-col items-center gap-1.5 sm:gap-2 px-3 pointer-events-auto"
        >
          <span className="font-bold text-[10px] sm:text-xs tracking-wider uppercase text-[var(--teal)]/90 px-3 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-[rgba(43,179,177,0.25)] shadow-xs">
            {isBn ? 'যেসব রোগের চিকিৎসা করেন ডাঃ কল্লোল' : 'Conditions Dr. Kollol treats'}
          </span>
          <div className="flex justify-center flex-wrap gap-1 sm:gap-1.5 max-w-[min(980px,96vw)] px-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/conditions-treatments/${c.slug}`}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all backdrop-blur-md ${
                  activeChip === c.slug
                    ? 'bg-[var(--teal)] text-white shadow-sm ring-2 ring-[var(--teal)]/20'
                    : 'bg-white/85 text-[var(--teal)] border border-[rgba(43,179,177,0.3)] hover:bg-white'
                }`}
              >
                {isBn ? c.name_bn : c.name_en}
              </Link>
            ))}
          </div>
        </div>

        {/* Background Giant Words Container */}
        <div ref={wordsContainerRef} className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {svcItems.map((item, idx) => (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap will-change-transform font-heading font-extrabold text-[clamp(26px,5vw,90px)] leading-[0.92] tracking-tight bg-gradient-to-b from-[var(--teal)]/40 via-[var(--teal)]/25 to-[rgba(43,179,177,0.1)] bg-clip-text text-transparent opacity-0 select-none max-w-[92vw] overflow-hidden truncate"
            >
              {item.word}
            </div>
          ))}
        </div>

        {/* Pinned Doctor Cutout (Swings & Zooms) */}
        <div
          ref={docImgRef}
          className="absolute left-1/2 bottom-0 h-[min(65vh,520px)] sm:h-[min(80vh,740px)] aspect-[624/1126] -translate-x-1/2 z-[2] pointer-events-none will-change-transform"
        >
          <Image
            src="/img/doctor.webp"
            alt="Dr. Fahim Foysal Kollol, Surgeon"
            width={624}
            height={1126}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_24px_36px_rgba(6,47,49,0.22)]"
          />
        </div>

        {/* Left Side: Profile & Credentials (Phase 1) */}
        <div
          ref={sideLRef}
          className="absolute top-[34%] sm:top-[60%] -translate-y-1/2 left-4 right-4 sm:right-auto sm:left-[4.5vw] z-[3] text-center sm:text-left sm:w-[min(32vw,430px)] will-change-transform"
        >
          <h3 className="font-heading font-bold text-2xl sm:text-[clamp(28px,2.9vw,50px)] leading-[1.08] tracking-tight text-[var(--ink)]">
            {isBn ? profile.name_bn : profile.name_en}
          </h3>
          <p className="font-sans font-semibold text-xs sm:text-[clamp(14px,1.25vw,18px)] text-[var(--teal)] mt-1.5 sm:mt-2 leading-snug">
            {isBn ? profile.role_bn : profile.role_en}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-1.5 mt-2.5 sm:mt-3.5">
            {profile.degrees_badges.map((deg, idx) => (
              <span
                key={idx}
                className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/80 border border-[rgba(43,179,177,0.3)] text-[11px] sm:text-xs font-semibold text-[var(--ink)] shadow-xs"
              >
                {deg}
              </span>
            ))}
          </div>

          <p className="text-[11px] sm:text-xs font-normal leading-relaxed text-[var(--muted)] mt-2 sm:mt-3 max-w-sm mx-auto sm:mx-0">
            {isBn ? profile.post_bn : profile.post_en}
          </p>

          <div className="mt-4 sm:mt-5 hidden sm:block">
            <div className="flex gap-2.5 flex-wrap">
              {onBookClick ? (
                <button type="button" onClick={onBookClick} className="btn btn-p text-sm py-2.5 px-5">
                  {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
                </button>
              ) : (
                <a href="tel:01750529252" className="btn btn-p text-sm py-2.5 px-5">
                  {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
                </a>
              )}
              <a href="tel:01670879100" className="btn btn-g text-sm py-2.5 px-4">
                {isBn ? 'কল করুন' : 'Call now'}
              </a>
            </div>
            <p
              className="text-xs font-medium text-[var(--muted)] mt-3"
              dangerouslySetInnerHTML={{
                __html: isBn ? profile.chambers_summary_bn : profile.chambers_summary_en,
              }}
            />
          </div>
        </div>

        {/* Right Side: 6 Statistics with Count-Up (Phase 1) - Desktop */}
        <div
          ref={sideRRef}
          className="hidden sm:block absolute top-[60%] -translate-y-1/2 right-[4.5vw] z-[3] w-[min(32vw,430px)] will-change-transform"
        >
          <div className="grid grid-cols-2 gap-3">
            {profile.stats.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-[rgba(43,179,177,0.28)] shadow-[0_14px_34px_-18px_rgba(6,47,49,0.3)]"
              >
                <b className="block font-heading font-extrabold text-[clamp(22px,2vw,32px)] leading-none text-[var(--teal)]">
                  {counts[idx] || (isBn ? st.num_bn : st.num_en)}
                </b>
                <span className="block mt-1.5 text-xs font-medium leading-snug text-[var(--muted)]">
                  {isBn ? st.label_bn : st.label_en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Degrees Infinite Ticker (Bottom of Phase 1) */}
        <div
          ref={tkrDegRef}
          className="absolute inset-x-0 bottom-0 z-[4] py-3 bg-white/75 backdrop-blur-md border-t border-[rgba(43,179,177,0.25)] tkr will-change-transform"
        >
          <div className="trk" style={{ '--dur': '35s' } as React.CSSProperties}>
            {profile.degrees_ticker.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-4 px-5 text-sm font-bold text-[var(--teal)]">
                <span>{isBn ? item.bn : item.en}</span>
                <span className="text-[var(--aqua)] text-xs">✦</span>
              </span>
            ))}
            {/* Repeated for seamless loop */}
            {profile.degrees_ticker.map((item, idx) => (
              <span key={`dup-${idx}`} className="inline-flex items-center gap-4 px-5 text-sm font-bold text-[var(--teal)]">
                <span>{isBn ? item.bn : item.en}</span>
                <span className="text-[var(--aqua)] text-xs">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Phase 2: Condition Glass Cards */}
        <div ref={cardsContainerRef} className="absolute inset-0 pointer-events-none z-[3]">
          {svcItems.map((item, idx) => {
            // When sideOf(idx) === 1: Doctor swings to RIGHT (+X), so card MUST be on LEFT
            // When sideOf(idx) === -1: Doctor swings to LEFT (-X), so card MUST be on RIGHT
            const isCardLeft = sideOf(idx) === 1;

            if (item.isMore) {
              return (
                <div
                  key="more"
                  className="absolute bottom-16 sm:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:w-[560px] sm:max-w-[560px] max-h-[65vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/92 backdrop-blur-2xl border border-[rgba(43,179,177,0.35)] shadow-2xl pointer-events-auto opacity-0 will-change-transform"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--aqua)]">
                    {isBn ? 'সব রোগ ও চিকিৎসা' : 'All conditions & treatments'}
                  </span>
                  <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--ink)] mt-1">
                    {isBn ? 'ডাঃ কল্লোল আরও যেসব রোগের চিকিৎসা করেন' : 'More conditions Dr. Kollol treats'}
                  </h4>

                  <div className="flex flex-wrap gap-1.5 my-3.5 max-w-full">
                    {rest.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/conditions-treatments/${c.category_slug}/${c.slug}`}
                        className="px-2.5 py-1 rounded-full text-xs font-medium text-[var(--ink)] bg-white border border-[rgba(43,179,177,0.3)] hover:bg-[var(--tint)] truncate max-w-full"
                      >
                        {isBn ? c.name_bn : c.name_en}
                      </Link>
                    ))}
                  </div>

                  <p className="text-xs text-[var(--muted)] mb-4">
                    {isBn ? 'কোন রোগ বুঝতে পারছেন না? একবার দেখিয়ে নিন।' : 'Not sure what you have? Come for a consultation.'}
                  </p>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <a href="tel:01750529252" className="btn btn-p text-xs py-2.5 px-4 flex-1 text-center font-bold whitespace-nowrap">
                      {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
                    </a>
                    <Link href="/conditions-treatments" className="btn btn-g text-xs py-2.5 px-4 flex-1 text-center font-bold whitespace-nowrap">
                      {isBn ? 'সব রোগ দেখুন →' : 'All conditions →'}
                    </Link>
                  </div>
                </div>
              );
            }

            const c = item.c!;
            return (
              <Link
                key={c.slug}
                href={`/conditions-treatments/${c.category_slug}/${c.slug}`}
                className="absolute bottom-16 sm:bottom-12 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:w-[min(48vw,620px)] sm:max-w-[620px] p-4 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-2xl border border-[rgba(43,179,177,0.3)] shadow-[0_20px_45px_-20px_rgba(6,47,49,0.35)] pointer-events-auto opacity-0 will-change-transform sm:grid sm:grid-cols-12 sm:gap-5 items-center transition-shadow hover:shadow-2xl"
              >
                {/* Floating condition image */}
                <div className="sm:col-span-5 h-24 sm:h-52 relative mb-2 sm:mb-0">
                  <Image
                    src={c.image_url || `/img/conditions/${c.slug}.webp`}
                    alt={isBn ? c.name_bn : c.name_en}
                    fill
                    className="object-contain filter drop-shadow-[0_18px_26px_rgba(6,47,49,0.3)]"
                  />
                </div>

                <div className="sm:col-span-7 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--aqua)]">
                    {isBn ? categories.find((cat) => cat.slug === c.category_slug)?.name_bn : categories.find((cat) => cat.slug === c.category_slug)?.name_en}
                  </span>
                  <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--ink)] leading-snug">
                    {isBn ? c.name_bn : c.name_en}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {isBn ? c.short_bn : c.short_en}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(43,179,177,0.2)]">
                    {c.is_laparoscopic ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[var(--teal)] bg-[var(--tint)] border border-[rgba(43,179,177,0.3)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--aqua)]" />
                        {isBn ? 'ল্যাপারোস্কপিক' : 'Laparoscopic'}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs font-bold text-[var(--teal)] flex items-center gap-1">
                      {isBn ? 'বিস্তারিত →' : 'Learn more →'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
