'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function VideosSection() {
  const { lang } = useLanguage();

  const t = {
    en: {
      eyebrow: 'Medical Videos',
      heading: 'Watch & Understand',
      lead: 'Short informational videos where Dr. Kollol explains common conditions and modern surgical techniques.',
      soon: 'Educational videos coming soon',
    },
    bn: {
      eyebrow: 'ভিডিওতে জানুন',
      heading: 'সহজ ভাষায় চিকিৎসা ও পরামর্শ',
      lead: 'সাধারণ রোগ ও আধুনিক অপারেশন নিয়ে ডাঃ কল্লোলের সংক্ষিপ্ত তথ্যবহুল ভিডিও।',
      soon: 'ভিডিও খুব শীঘ্রই যুক্ত হবে',
    },
  }[lang];

  return (
    <section className="relative z-20 bg-[var(--tint)] py-20 px-4 sm:px-6 lg:px-8" id="videos">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--aqua)] block">
            {t.eyebrow}
          </span>
          <h2 className="font-heading font-extrabold text-[clamp(34px,4.5vw,64px)] leading-tight tracking-tight bg-gradient-to-b from-[var(--teal)] via-[var(--teal)]/80 to-[rgba(43,179,177,0.5)] bg-clip-text text-transparent mt-1">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            {t.lead}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Feature Video Slot */}
          <div className="lg:col-span-8 aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-[rgba(43,179,177,0.4)] bg-gradient-to-br from-white to-[var(--tint)] grid place-items-center text-center p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[var(--teal)] text-white grid place-items-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <span className="ml-1 w-0 h-0 border-y-8 border-y-transparent border-l-14 border-l-white" />
              </div>
              <span className="text-sm font-semibold text-[var(--teal)]">
                {t.soon}
              </span>
            </div>
          </div>

          {/* Sub Video Slots */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex-1 min-h-[100px] rounded-2xl overflow-hidden border border-dashed border-[rgba(43,179,177,0.35)] bg-white/70 grid place-items-center p-4 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--teal)] text-white grid place-items-center shadow-sm">
                    <span className="ml-0.5 w-0 h-0 border-y-5 border-y-transparent border-l-8 border-l-white" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {t.soon} #{item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
