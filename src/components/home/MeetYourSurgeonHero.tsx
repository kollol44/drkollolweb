'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { SurgeonProfile } from '@/types/database';

interface MeetYourSurgeonHeroProps {
  profile: SurgeonProfile;
  serialPhone?: string;
  callPhone?: string;
  onBookClick?: () => void;
  id?: string;
  headingLevel?: 'h1' | 'h2';
}

export function MeetYourSurgeonHero({
  profile,
  serialPhone = '01750529252',
  callPhone = '01670879100',
  onBookClick,
  id = 'doctor',
  headingLevel = 'h2',
}: MeetYourSurgeonHeroProps) {
  const { isBn } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const [counts, setCounts] = useState<string[]>(
    profile.stats.map((s) => (isBn ? s.num_bn : s.num_en))
  );

  // Count-up animation for stats numbers when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const BN = '০১২৩৪৫৬৭৮৯';
    const toL = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));
    const toB = (s: string) => s.replace(/\d/g, (d) => BN[parseInt(d, 10)]);

    const countUp = () => {
      profile.stats.forEach((st, idx) => {
        const txt = isBn ? st.num_bn : st.num_en;
        const bnMatch = /[০-৯]/.test(txt);
        const match = toL(txt).match(/[\d,]+/);
        if (!match) return;

        const numVal = parseInt(match[0].replace(/,/g, ''), 10);
        const prefix = toL(txt).slice(0, match.index);
        const suffix = toL(txt).slice((match.index || 0) + match[0].length);
        const start = performance.now();
        const dur = 900;

        const step = (t: number) => {
          const k = Math.min(1, Math.max(0, (t - start) / dur));
          const val = Math.round(numVal * (1 - Math.pow(1 - k, 3)));
          const res = prefix + val.toLocaleString('en-US') + suffix;
          setCounts((prev) => {
            const arr = [...prev];
            arr[idx] = bnMatch ? toB(res) : res;
            return arr;
          });
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countUp();
            e.target.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));
          }
        });
      },
      { threshold: 0.15 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, [isBn, profile.stats]);

  const IntroHeading = headingLevel;
  const NameHeading = headingLevel === 'h1' ? 'h2' : 'h3';

  return (
    <section ref={sectionRef} className="doc-hero" id={id}>
      <div className="glow" />

      {/* Giant Intro Heading Watermark */}
      <IntroHeading className="intro rv in">
        <span>{isBn ? 'ইনিই আপনার সার্জন' : 'Meet Your Surgeon'}</span>
      </IntroHeading>

      {/* Center Doctor Image with Gentle Floating Animation */}
      <div className="doc-img">
        <Image
          src="/img/doctor.webp"
          alt="Dr. Fahim Foysal Kollol, surgeon, in green scrubs"
          width={624}
          height={1126}
          priority
        />
      </div>

      {/* Left Side: Doctor Qualifications & Actions */}
      <div className="side l">
        <NameHeading className="name rv in">{isBn ? profile.name_bn : profile.name_en}</NameHeading>
        <p className="role rv in">{isBn ? profile.role_bn : profile.role_en}</p>
        <div className="deg rv in">
          {profile.degrees_badges.map((deg, i) => (
            <span key={i}>{deg}</span>
          ))}
        </div>
        <p className="post rv in">{isBn ? profile.post_bn : profile.post_en}</p>
        <div className="cta rv in">
          <div className="row">
            {onBookClick ? (
              <button
                type="button"
                onClick={onBookClick}
                className="btn btn-p"
              >
                {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
              </button>
            ) : (
              <a href={`tel:${serialPhone}`} className="btn btn-p">
                {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
              </a>
            )}
            <a href={`tel:${callPhone}`} className="btn btn-g">
              {isBn ? 'কল করুন' : 'Call now'}
            </a>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: isBn ? profile.chambers_summary_bn : profile.chambers_summary_en,
            }}
          />
        </div>
      </div>

      {/* Right Side: 6 Verified Surgical Experience Stats */}
      <div className="side r">
        <div className="stats">
          {profile.stats.map((st, i) => (
            <div key={i} className="stat rv in">
              <b>{counts[i] || (isBn ? st.num_bn : st.num_en)}</b>
              <span>{isBn ? st.label_bn : st.label_en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Infinite Scrolling Degrees & Recognition Ticker */}
      <div className="tkr tkr-deg">
        <div className="trk" style={{ '--dur': '35s' } as React.CSSProperties}>
          {profile.degrees_ticker.map((item, idx) => (
            <span key={idx} className="it">
              <span>{isBn ? item.bn : item.en}</span>
              <span className="sep">✦</span>
            </span>
          ))}
          {profile.degrees_ticker.map((item, idx) => (
            <span key={`dup-${idx}`} className="it">
              <span>{isBn ? item.bn : item.en}</span>
              <span className="sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile-Only CTA Button */}
      <div className="cta-m">
        {onBookClick ? (
          <button
            type="button"
            onClick={onBookClick}
            className="btn btn-p"
          >
            {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
          </button>
        ) : (
          <a href={`tel:${serialPhone}`} className="btn btn-p">
            {isBn ? 'সিরিয়াল নিন' : 'Book a serial'}
          </a>
        )}
        <a href={`tel:${callPhone}`} className="btn btn-g">
          {isBn ? 'কল করুন' : 'Call now'}
        </a>
      </div>
    </section>
  );
}
