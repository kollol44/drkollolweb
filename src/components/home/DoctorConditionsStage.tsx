'use client';

import React, { useEffect, useRef, useMemo } from 'react';
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

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
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
  const { isBn } = useLanguage();
  const stageRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const docImgRef = useRef<HTMLDivElement>(null);
  const svcHeadRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const svcBarRef = useRef<HTMLDivElement>(null);

  // Filter home featured conditions & rest
  const featured = useMemo(
    () =>
      conditions
        .filter((c) => c.home_order && !c.is_hidden)
        .sort((a, b) => (a.home_order || 0) - (b.home_order || 0)),
    [conditions]
  );
  const rest = useMemo(() => conditions.filter((c) => !c.home_order && !c.is_hidden), [conditions]);

  const svcItems = useMemo(
    () => [
      ...featured.map((c) => ({
        word: isBn ? (c.home_word_bn || c.name_bn) : (c.home_word_en || c.name_en),
        cat: c.category_slug,
        c,
        more: false,
      })),
      {
        word: isBn ? 'আরও অনেক' : 'And more',
        cat: null,
        c: null,
        more: true,
      },
    ],
    [featured, isBn]
  );

  const sideOf = (i: number) => {
    if (svcItems[i]?.more) return 0;
    return Math.floor(i / 3) % 2 ? -1 : 1; // groups of 3 by position: right x3, left x3... +1 = doctor right, card left
  };

  // Main scroll loop for swinging doctor and scrolling condition cards
  useEffect(() => {
    const stage = stageRef.current;
    const docImg = docImgRef.current;
    const svcHead = svcHeadRef.current;
    const chipsEl = chipsRef.current;
    const wordsContainer = wordsContainerRef.current;
    const cardsContainer = cardsContainerRef.current;
    const svcBar = svcBarRef.current;

    if (!stage || !docImg) return;

    let animId: number;

    const docState = (i: number) => {
      const sd = sideOf(i);
      if (!sd) return { x: 0, s: 1, y: 0 };
      const H = docImg.offsetHeight || 720;
      const vh = window.innerHeight;
      const S = Math.max(1.6, (0.76 * vh) / (0.42 * H));
      const top0 = vh - H;
      return { x: sd * window.innerWidth * 0.27, s: S, y: vh * 0.24 - (top0 + 0.015 * H * S) };
    };

    const fitWords = () => {
      if (!wordsContainerRef.current) return;
      const words = Array.from(wordsContainerRef.current.children) as HTMLElement[];
      const mob = window.innerWidth < 860;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      words.forEach((w, i) => {
        w.style.removeProperty('--fs');
        const isMore = !!svcItems[i]?.more;
        const base = parseFloat(window.getComputedStyle(w).fontSize) || 120;
        const wd = w.scrollWidth;

        if (mob) {
          // Mobile: watermark is centered with safe margin of 88vw
          const max = vw * 0.88;
          let fs = wd > max ? (base * max) / wd : base;
          fs = Math.min(fs, vh * 0.12, 72);
          fs = Math.max(fs, 28);
          w.style.setProperty('--fs', `${Math.floor(fs)}px`);
        } else {
          // Desktop: watermark is centered on the free side at 25vw or 75vw.
          // Max width is 42% of viewport width so it never clips either screen edge or doctor area
          const max = vw * (isMore ? 0.90 : 0.42);
          let fs = wd > max ? (base * max) / wd : base;
          if (!isMore) {
            fs = Math.min(fs, vh * 0.18);
          }
          fs = Math.max(fs, 36);
          w.style.setProperty('--fs', `${Math.floor(fs)}px`);
        }
      });
    };

    fitWords();
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => fitWords());
    }

    const onDraw = () => {
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const q = clamp(-r.top / (stage.offsetHeight - vh), 0, 1);
      const mob = window.innerWidth < 860;

      const n = svcItems.length;
      const pos = mob
        ? q * (n - 1)
        : restH(q * (n - 1));
      const stepDist = vh * (mob ? 0.34 : 0.62);

      if (mob) {
        docImg.style.transform = '';
      } else {
        const a = Math.floor(pos);
        const f = pos - a;
        const A = docState(a);
        const B = docState(Math.min(n - 1, a + 1));
        const e = f * f * (3 - 2 * f);

        let x = lerp(A.x, B.x, e);
        let sc =
          lerp(A.s, B.s, e) -
          Math.sin(Math.PI * e) * (A.x && B.x && A.x !== B.x ? 0.45 : 0);
        let y = lerp(A.y, B.y, e);

        docImg.style.transformOrigin = '50% 0';
        docImg.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px) scale(${sc})`;
      }

      if (svcHead) svcHead.style.opacity = '1';
      if (svcBar) svcBar.style.opacity = '1';

      if (wordsContainer && cardsContainer) {
        const words = Array.from(wordsContainer.children) as HTMLElement[];
        const cards = Array.from(cardsContainer.children) as HTMLElement[];
        const bars = svcBar ? (Array.from(svcBar.children) as HTMLElement[]) : [];

        words.forEach((w, i) => {
          const o = i - pos;
          const a = Math.abs(o);
          const wx = mob ? 0 : -sideOf(i) * window.innerWidth * 0.25;
          w.style.transform = `translate(calc(-50% + ${wx}px), calc(-50% + ${
            o * stepDist
          }px - ${mob ? 14 : sideOf(i) ? 14 : 8}vh)) scale(${1 - Math.min(a, 1) * 0.12})`;
          w.style.opacity = String(clamp(1 - a * 1.35, 0, 1));
        });

        cards.forEach((cd, i) => {
          const o = i - pos;
          const a = Math.abs(o);
          const co = clamp(1 - a * 2.4, 0, 1);
          cd.style.opacity = String(co);
          cd.style.pointerEvents = co > 0.5 ? 'auto' : 'none';
          cd.style.transform = `translateY(${o * (mob ? 30 : 50)}px)`;
        });

        bars.forEach((b, i) => {
          b.classList.toggle('on', Math.round(pos) === i);
        });
      }

      // Category chip lights up
      const cur = svcItems[Math.round(pos)];
      if (chipsEl) {
        chipsEl.querySelectorAll('a').forEach((a) => {
          const on = !!cur && a.dataset.cat === cur.cat;
          if (on && !a.classList.contains('on') && mob) {
            chipsEl.scrollTo({
              left: a.offsetLeft - chipsEl.clientWidth / 2 + a.offsetWidth / 2,
              behavior: 'smooth',
            });
          }
          a.classList.toggle('on', on);
        });
      }
    };

    const onResize = () => {
      fitWords();
      onDraw();
    };
    window.addEventListener('resize', onResize);

    const loop = () => {
      onDraw();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [svcItems]);

  return (
    <section
      ref={stageRef}
      className="doc"
      id="conditions"
      style={{
        height: `calc(${svcItems.length} * 75vh + 100vh)`,
      }}
    >
      <div ref={pinRef} className="pin">
        <div className="glow" />

        {/* Category Chips & Section Title */}
        <div ref={svcHeadRef} className="svc-head" id="svcHead" style={{ opacity: 1 }}>
          <span>
            {isBn ? 'যেসব রোগের চিকিৎসা করেন ডাঃ কল্লোল' : 'Conditions Dr. Kollol treats'}
          </span>
          <div ref={chipsRef} className="svc-chips" id="svcChips">
            {categories.map((c) => (
              <Link
                key={c.slug}
                data-cat={c.slug}
                href={`/conditions-treatments/${c.slug}`}
              >
                {isBn ? c.name_bn : c.name_en}
              </Link>
            ))}
          </div>
        </div>

        {/* Giant Condition Words Background Container */}
        <div ref={wordsContainerRef} className="svc-words" id="svcWords">
          {svcItems.map((item, idx) => (
            <div key={idx} className="svc-word">
              {item.word}
            </div>
          ))}
        </div>

        {/* Doctor Image Cutout */}
        <div ref={docImgRef} className="doc-img">
          <Image
            src="/img/doctor.webp"
            alt="Dr. Fahim Foysal Kollol, surgeon, in green scrubs"
            width={624}
            height={1126}
            priority
          />
        </div>

        {/* Treatments Glass Cards */}
        <div ref={cardsContainerRef} id="svcCards">
          {svcItems.map((item, idx) => {
            if (item.more) {
              return (
                <div key="more" className="svc-card r more">
                  <small>{isBn ? 'সব রোগ ও চিকিৎসা' : 'All conditions & treatments'}</small>
                  <b>
                    {isBn
                      ? 'ডাঃ কল্লোল আরও যেসব রোগের চিকিৎসা করেন'
                      : 'More conditions Dr. Kollol treats'}
                  </b>
                  <div className="tags">
                    {rest.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/conditions-treatments/${c.category_slug}/${c.slug}`}
                      >
                        {isBn ? c.name_bn : c.name_en}
                      </Link>
                    ))}
                    <Link className="plus" href="/conditions-treatments">
                      +{rest.length - 6 > 0 ? rest.length - 6 : 4}
                    </Link>
                  </div>
                  <p style={{ marginTop: '12px' }}>
                    {isBn
                      ? 'কোন রোগ বুঝতে পারছেন না? একবার দেখিয়ে নিন।'
                      : 'Not sure what you have? Come for a check-up.'}
                  </p>
                  <div className="row">
                    {onBookClick ? (
                      <button type="button" onClick={onBookClick} className="btn btn-p">
                        {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
                      </button>
                    ) : (
                      <a href="tel:01750529252" className="btn btn-p">
                        {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
                      </a>
                    )}
                    <Link href="/conditions-treatments" className="btn btn-g">
                      {isBn ? 'সব রোগ ও চিকিৎসা' : 'All conditions & treatments'}
                    </Link>
                  </div>
                </div>
              );
            }

            const c = item.c!;
            const isLeft = Math.floor(idx / 3) % 2 === 0;
            const cat = categories.find((ct) => ct.slug === c.category_slug);

            return (
              <Link
                key={c.slug}
                className={`svc-card ${isLeft ? 'l' : 'r'}`}
                href={`/conditions-treatments/${c.category_slug}/${c.slug}`}
              >
                <img
                  className="ci"
                  src={c.image_url || `/img/conditions/${c.slug}.webp?v=2`}
                  alt={isBn ? c.name_bn : c.name_en}
                  loading="lazy"
                />
                <small>{cat ? (isBn ? cat.name_bn : cat.name_en) : ''}</small>
                <b>{isBn ? c.name_bn : c.name_en}</b>
                <p>{isBn ? c.short_bn : c.short_en}</p>
                <span className="meta">
                  {c.is_laparoscopic ? (
                    <span className="lapb">{isBn ? 'ল্যাপারোস্কপিক' : 'Laparoscopic'}</span>
                  ) : (
                    <span />
                  )}
                  <span className="go">{isBn ? 'বিস্তারিত →' : 'Learn more →'}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div ref={svcBarRef} className="svc-bar" id="svcBar">
          {svcItems.map((_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
